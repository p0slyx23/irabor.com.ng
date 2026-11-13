import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

// Test the actual production bundle, never a report or a design prototype.
const baseline = process.argv.includes('--baseline')
const checksOnly = process.argv.includes('--checks-only')
const fullPage = process.argv.includes('--full-page')
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const output = join(root, '.impeccable', 'review')
await mkdir(output, { recursive: true })
await readFile(join(dist, 'index.html'))
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.pdf': 'application/pdf',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
}
const server = createServer(async (req, res) => {
  try {
    const requested = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
    const relative = requested.replace(/^\/+/, '')
    const asset = resolve(dist, relative || 'index.html')
    if (asset !== dist && !asset.startsWith(dist + sep)) throw new Error('Invalid path')
    const target = extname(relative) ? asset : join(dist, 'index.html')
    const data = await readFile(target)
    res.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  }
})
await new Promise(resolveListening => server.listen(0, '127.0.0.1', resolveListening))
const origin = `http://127.0.0.1:${server.address().port}`
const profile = await mkdtemp(join(tmpdir(), 'irabor-ui-qa-'))
const chromePath = process.env.PORTFOLIO_QA_CHROME || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore', windowsHide: true })
let socket
let launchError
chrome.on('error', error => { launchError = error })
const wait = ms => new Promise(resolveWait => setTimeout(resolveWait, ms))
const checks = []
const runtimeErrors = []
const consoleErrors = []
let failure
let failureDiagnostics
try {
  let port
  for (let attempt = 0; attempt < 100; attempt++) {
    if (launchError) throw launchError
    try {
      port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]
      break
    } catch { await wait(100) }
  }
  if (!port) throw new Error('Chrome did not expose a debugging port. Run this command outside the sandbox if Chrome was blocked.')
  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
  socket = new WebSocket(version.webSocketDebuggerUrl)
  await new Promise((opened, reject) => {
    socket.addEventListener('open', opened, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let sequence = 0
  const pending = new Map()
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data)
    if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails)
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') {
      consoleErrors.push(message.params.args.map(arg => arg.value ?? arg.description).join(' '))
    }
    if (!message.id) return
    const task = pending.get(message.id)
    if (!task) return
    clearTimeout(task.timer)
    pending.delete(message.id)
    if (message.error) task.reject(new Error(JSON.stringify(message.error)))
    else task.resolve(message.result)
  })
  const send = (method, params = {}, sessionId) => new Promise((resolveRequest, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 15000)
    pending.set(id, { resolve: resolveRequest, reject, timer })
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }))
  })
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const cdp = (method, params) => send(method, params, sessionId)
  await cdp('Page.enable')
  await cdp('Runtime.enable')
  await cdp('Network.enable')
  const evaluate = async expression => {
    const response = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails))
    return response.result.value
  }
  const check = async (name, expression) => {
    const result = await evaluate(expression)
    const passed = Boolean(result)
    checks.push({ name, passed })
    if (!passed) {
      failureDiagnostics = await evaluate("({focused:document.activeElement?.outerHTML,contact:document.querySelector('.social-rail--floating')?.outerHTML})")
      throw new Error(`Failed: ${name}`)
    }
  }
  const waitFor = async expression => {
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await evaluate(expression)) return
      await wait(100)
    }
    failureDiagnostics = await evaluate(`(() => ({
      url: location.href,
      scrollY,
      viewport: {width: innerWidth, height: innerHeight},
      documentHeight: document.documentElement.scrollHeight,
      bodyOverflow: document.body.style.overflow,
      fonts: document.fonts.status,
      headerBottom: document.querySelector('.site-header')?.getBoundingClientRect().bottom,
      routeTransform: getComputedStyle(document.querySelector('.route-frame')).transform,
      sections: ['about','experience','projects'].map(id=>{
        const element = document.getElementById(id);
        return element ? {id, top: element.getBoundingClientRect().top, margin: getComputedStyle(element).scrollMarginTop} : {id};
      })
    }))()`)
    throw new Error(`Condition did not settle: ${expression}`)
  }
  const settle = async () => {
    for (let attempt = 0; attempt < 80; attempt++) {
      if (await evaluate("document.readyState === 'complete' && !!document.querySelector('#main-content h1')")) break
      await wait(100)
    }
    await evaluate("Promise.race([document.fonts.ready.then(()=>true), new Promise(r=>setTimeout(()=>r(false),2500))])")
    // Allow route entrances and theme transitions to settle before capture.
    await wait(450)
  }
  const navigate = async path => {
    await cdp('Page.navigate', { url: origin + path })
    await settle()
  }
  const size = async width => {
    await cdp('Emulation.setDeviceMetricsOverride', {
      width, height: width < 700 ? 844 : 1000, deviceScaleFactor: 1, mobile: width < 700,
    })
    await wait(100)
  }
  const theme = async desired => {
    if ((await evaluate('document.documentElement.dataset.theme')) !== desired) {
      await evaluate(`localStorage.setItem('portfolio-theme', '${desired}')`)
      await cdp('Page.reload')
      await settle()
    }
    await check(`${desired} root theme`, `document.documentElement.dataset.theme === '${desired}'`)
  }
  const screenshot = async (name, { preserveScroll = false, captureFullPage = false } = {}) => {
    if (checksOnly) return
    if (!preserveScroll) await evaluate("window.scrollTo({top:0,left:0,behavior:'instant'})")
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))')
    let clip
    if (captureFullPage) {
      const { cssContentSize } = await cdp('Page.getLayoutMetrics')
      clip = { x: 0, y: 0, width: cssContentSize.width, height: cssContentSize.height, scale: 1 }
    }
    const { data } = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: captureFullPage, ...(clip ? { clip } : {}) })
    await writeFile(join(output, name), Buffer.from(data, 'base64'))
  }
  const noOverflow = name => check(name, 'document.documentElement.scrollWidth <= innerWidth + 1')
  const key = async (keyName, code, keyCode, modifiers = 0) => {
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: keyName, code, windowsVirtualKeyCode: keyCode, modifiers, ...(keyName === 'Enter' ? { text: '\r', unmodifiedText: '\r' } : {}) })
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: keyName, code, windowsVirtualKeyCode: keyCode, modifiers })
  }
  const sectionIsAligned = id => `(() => {
    const section = document.getElementById('${id}');
    if (!section) return false;
    const top = section.getBoundingClientRect().top;
    const absoluteTop = top + scrollY;
    const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const maximumScroll = document.documentElement.scrollHeight - innerHeight;
    const expectedScroll = Math.max(0, Math.min(absoluteTop - margin, maximumScroll));
    const header = document.querySelector('.site-header')?.getBoundingClientRect() ?? {top:0,bottom:0};
    const headerBottom = header.top > innerHeight / 2 ? 0 : header.bottom;
    return Math.abs(scrollY - expectedScroll) <= 3 && (scrollY === 0 || top >= headerBottom - 2);
  })()`

  await size(1440)
  await navigate('/')
  await theme('dark')
  if (baseline) {
    await screenshot('before-desktop.png')
    await size(390)
    await settle()
    await screenshot('before-mobile.png')
    console.log(`Baseline captures: ${join(output, 'before-desktop.png')} and before-mobile.png`)
  } else {
    await check('Floating navigation is commented out', "!document.querySelector('.site-header') && !document.querySelector('.site-mobile-nav')")
    await check('Status gradient is commented out', "!document.querySelector('.status-bar')")
    await check('Safe-area spacing is zero', "parseFloat(getComputedStyle(document.querySelector('.site-shell')).getPropertyValue('--safe-area-top'))===0")
    await check('Four featured projects remain available', "document.querySelectorAll('.project-card').length===4")
    await check('Desktop top spacing is compact', "parseFloat(getComputedStyle(document.querySelector('.site-main')).paddingTop)===32")
    await check('Footer credit paragraph is removed', "!document.querySelector('.profile-colophon').textContent.includes('Built with React')")
    await check('Company link includes a diagonal arrow', "!!document.querySelector('.experience-entry__company-link svg')")
    await check('Single contact toggle sits above page layers', "(() => {const el=document.querySelector('.social-rail--floating');const s=getComputedStyle(el);return el.parentElement===document.body && s.position==='fixed' && Number(s.zIndex)>101 && s.right==='24px' && s.bottom==='24px' && el.querySelectorAll('button').length===1})()")
    await check('Contact links start hidden and unfocusable', "document.querySelector('.social-rail__links').inert && document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='false' && [...document.querySelectorAll('.social-rail__links a')].every(el=>el.tabIndex===-1 && getComputedStyle(el).visibility==='hidden')")
    await check('Contact trigger uses a speech bubble', "document.querySelector('.social-rail__toggle-icon svg').innerHTML.includes('M7 10h10M7 14h6')")
    await check('Social buttons are circular frosted glass', "[...document.querySelectorAll('.social-rail--floating a')].every(el=>{const s=getComputedStyle(el);return s.borderRadius==='50%' && s.backdropFilter.includes('blur(') && s.backgroundColor.startsWith('rgba(')})")
    await screenshot('desktop.png')
    await key('Tab','Tab',9)
    await check('Keyboard navigation remains available', "document.activeElement !== document.body")
    for (const width of [320,390,768,900,901,1024,1440]) {
      await size(width)
      await noOverflow('Layout fits '+width+'px')
    }
    await size(390)
    for (const desired of ['dark','light']) {
      await theme(desired)
      await noOverflow('Mobile '+desired+' fits')
      await screenshot('mobile-'+desired+'.png')
      await evaluate("document.getElementById('experience').scrollIntoView({behavior:'instant'});window.scrollBy({top:150,behavior:'instant'})")
      await wait(200)
      await check('Full-width sticky heading '+desired, "(() => {const r=document.querySelector('#experience h2').getBoundingClientRect();return Math.abs(r.top)<2 && Math.abs(r.left)<2 && Math.abs(r.width-innerWidth)<2})()")
      await check('Frosted translucent heading '+desired, "(() => {const s=getComputedStyle(document.querySelector('#experience h2'));return s.backdropFilter.includes('blur(') && s.backgroundColor.startsWith('rgba(')})()")
      await screenshot('experience-mobile-'+desired+'.png',{preserveScroll:true})
    }
    await evaluate("document.querySelector('.social-rail__toggle').focus()")
    await key('Enter','Enter',13)
    await wait(400)
    await check('Keyboard opens the contact fan', "document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='true' && !document.querySelector('.social-rail__links').inert")
    await check('Expanded links stay on screen and respond to pointer hits', "[...document.querySelectorAll('.social-rail__links a')].every(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight && el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})")
    await screenshot('contact-open-mobile.png',{preserveScroll:true})
    await key('Tab','Tab',9)
    await check('Expanded links receive keyboard focus', "document.querySelector('.social-rail__links').contains(document.activeElement)")
    await key('Escape','Escape',27)
    await wait(320)
    await check('Escape closes and restores toggle focus', "document.querySelector('.social-rail__toggle')===document.activeElement && document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='false'")
    await evaluate("document.querySelector('.social-rail__toggle').click()")
    await wait(350)
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:160,y:150,button:'left',clickCount:1})
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:160,y:150,button:'left',clickCount:1})
    await check('Outside click dismisses contact links', "document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='false'")
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
    await evaluate("document.querySelector('.social-rail__toggle').click()")
    await wait(100)
    await check('Reduced motion reveals links without CSS animation', "[...document.querySelectorAll('.social-rail__links a')].every(el=>getComputedStyle(el).transitionDuration==='0s' && getComputedStyle(el).opacity==='1')")
    await evaluate("document.querySelector('.social-rail__links a').addEventListener('click',e=>e.preventDefault(),{once:true});document.querySelector('.social-rail__links a').click()")
    await check('Link selection dismisses the contact fan', "document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='false'")
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]})
    await check('Reduced-transparency heading remains legible', "getComputedStyle(document.querySelector('#experience h2')).backdropFilter==='none'")
    await cdp('Emulation.setEmulatedMedia',{features:[]})
    await evaluate("document.querySelector('a[href=\"/archive\"]').click()")
    await settle()
    await check('Archive remains reachable', "location.pathname==='/archive' && document.querySelectorAll('.project-archive tbody tr').length===8")
    await check('Archive years are newest first', "(() => {const years=[...document.querySelectorAll('.project-archive tbody tr')].map(row=>Number(row.querySelector('td').textContent));return years.every((year,index)=>index===0 || years[index-1]>=year)})()")
    await check('Mobile archive hides external links', "[...document.querySelectorAll('.project-archive__live')].every(el=>getComputedStyle(el).display==='none')")
    await check('Archive back link is plain with zero bottom margin', "(() => {const s=getComputedStyle(document.querySelector('.project-archive__back'));return s.marginBottom==='0px' && s.padding==='0px' && s.borderTopWidth==='0px' && s.boxShadow==='none' && s.backgroundColor==='rgba(0, 0, 0, 0)'})()")
    await check('Archive headings match homepage type and vertical padding', "(() => {const s=getComputedStyle(document.querySelector('thead th'));return s.fontSize==='13px' && s.paddingTop==='18px' && s.paddingBottom==='18px' && s.fontWeight==='700' && s.letterSpacing==='1.3px'})()")
    await check('Mobile archive header uses edge-to-edge frosted glass', "(() => {const s=getComputedStyle(document.querySelector('thead'),'::before');return s.left==='-24px' && s.right==='-24px' && s.backdropFilter.includes('blur(') && s.borderBottomWidth==='0px'})()")
    await check('Final archive row has no bottom border', "[...document.querySelector('.project-archive tbody tr:last-child').children].every(el=>parseFloat(getComputedStyle(el).borderBottomWidth)===0)")
    await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:600,deviceScaleFactor:1,mobile:true})
    await evaluate("window.scrollTo({top:300,behavior:'instant'})")
    await wait(100)
    await check('Mobile table headings stick while archive back scrolls away', "(() => {const th=document.querySelector('thead th');const back=document.querySelector('.project-archive__back');return Math.abs(th.getBoundingClientRect().top)<2 && getComputedStyle(back).position==='static' && back.getBoundingClientRect().bottom<0})()")
    await size(1440)
    await check('Desktop archive includes both PayShip store links', "(() => {const row=[...document.querySelectorAll('.project-archive tbody tr')].find(el=>el.textContent.includes('PayShip'));return row.querySelectorAll('.project-archive__links a').length===2 && getComputedStyle(row.querySelector('.project-archive__live')).display!=='none'})()")
    await check('Archive project links share a horizontal row', "(() => {const row=[...document.querySelectorAll('.project-archive tbody tr')].find(el=>el.textContent.includes('PayShip'));const links=[...row.querySelectorAll('.project-archive__links a')].map(el=>el.getBoundingClientRect());return Math.abs(links[0].top-links[1].top)<1 && links[0].right<links[1].left})()")
    await check('Desktop archive header has no bottom divider', "getComputedStyle(document.querySelector('thead'),'::before').borderBottomWidth==='0px'")
    await check('Desktop archive header is exactly 55px tall', "Math.abs(document.querySelector('thead').getBoundingClientRect().height-55)<0.1")
    for (const width of [901,1024,1440]) {
      await size(width)
      await noOverflow('Archive fits '+width+'px')
    }
    await check('Desktop archive column headings are sticky', "getComputedStyle(document.querySelector('thead')).position==='sticky'")
    await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:640,deviceScaleFactor:1,mobile:false})
    await evaluate("window.scrollTo({top:300,behavior:'instant'})")
    await wait(150)
    await check('Desktop headings retain their columns while pinned', "[...document.querySelectorAll('thead th')].every(el=>Math.abs(el.getBoundingClientRect().top)<2)")
    await check('Pinned desktop header retains its 55px height', "Math.abs(document.querySelector('thead').getBoundingClientRect().height-55)<0.1")
    await screenshot('archive-desktop.png',{preserveScroll:true})
    await size(390)
    await noOverflow('Archive mobile fits')
    await screenshot('archive-mobile.png')
    await evaluate("document.querySelector('.project-archive tbody th a').click()")
    await settle()
    await check('Case study offers an explicit back arrow', "!!document.querySelector('.project-back-link svg') && document.querySelector('.project-back-link').getAttribute('href')==='/#projects'")
    await evaluate("window.scrollTo({top:400,behavior:'instant'})")
    await wait(100)
    await check('Back button sticks with glass styling', "(() => {const el=document.querySelector('.project-back-link');const s=getComputedStyle(el);return Math.abs(el.getBoundingClientRect().top-12)<2 && s.backdropFilter.includes('blur(') && s.backgroundColor.startsWith('rgba(')})()")
    const backBounds = await evaluate("(() => {const r=document.querySelector('.project-back-link').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()")
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...backBounds})
    await wait(250)
    await check('Back hover moves arrow left without underline', "(() => {const el=document.querySelector('.project-back-link');const m=new DOMMatrix(getComputedStyle(el.querySelector('svg')).transform);return getComputedStyle(el).textDecorationLine==='none' && m.m41 < -3 && Math.abs(m.m42)<0.5})()")
    await screenshot('article-mobile.png')
    await evaluate("document.querySelector('.project-back-link').click()")
    await settle()
    await waitFor(sectionIsAligned('projects'))
    await check('Case study back link returns to Projects', "location.hash==='#projects' && !!document.querySelector('#projects')")
    await check('No runtime errors', 'true')
    checks.at(-1).passed=runtimeErrors.length===0 && consoleErrors.length===0
    if(!checks.at(-1).passed) throw new Error('Runtime errors')
    console.log(JSON.stringify({checks,runtimeErrors,consoleErrors},null,2))
  }
  await send('Browser.close')
} catch (error) {
  failure = error
  console.error(error.stack || error.message)
} finally {
  const report = {
    mode: baseline ? 'baseline' : 'after', checkedAt: new Date().toISOString(), fullPage,
    checks, runtimeErrors, consoleErrors, failure: failure?.message || null, failureDiagnostics,
    scope: 'Local production-bundle Chrome checks. Not physical-device or broad assistive-technology certification.',
  }
  await writeFile(join(output, baseline ? 'baseline-checks.json' : 'ui-checks.json'), JSON.stringify(report, null, 2))
  socket?.close()
  chrome.kill()
  await new Promise(resolveClosed => server.close(resolveClosed))
  // The only deletion target is the unique temporary Chrome profile created above.
  const temporaryRoot = resolve(tmpdir()) + sep
  const absoluteProfile = resolve(profile)
  if (absoluteProfile.startsWith(temporaryRoot) && absoluteProfile.slice(temporaryRoot.length).startsWith('irabor-ui-qa-')) {
    for (let attempt = 0; attempt < 10; attempt++) {
      try { await rm(absoluteProfile, { recursive: true, force: true }); break }
      catch { await wait(200) }
    }
  }
}
if (failure) process.exitCode = 1
