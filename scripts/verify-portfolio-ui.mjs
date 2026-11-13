import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Test the actual production bundle, never a report or a design prototype.
const baseline = process.argv.includes('--baseline')
const checksOnly = process.argv.includes('--checks-only')
const fullPage = process.argv.includes('--full-page')
const v1Archive = process.argv.includes('--v1-archive')
const basePath = v1Archive ? '/irabor.com.ng' : ''
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(process.env.PORTFOLIO_QA_DIST || join(root, 'dist'))
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
    if (basePath && !requested.startsWith(`${basePath}/`)) throw new Error('Outside archive base path')
    const relative = requested.slice(basePath.length).replace(/^\/+/, '')
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
const origin = process.env.PORTFOLIO_QA_ORIGIN || `http://127.0.0.1:${server.address().port}`
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
    await evaluate("Promise.all([...document.querySelectorAll('.profile-enter')].flatMap(el=>el.getAnimations()).map(animation=>animation.finished.catch(()=>{})))")
  }
  const navigate = async path => {
    await cdp('Page.navigate', { url: origin + basePath + path })
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
  if (!v1Archive) {
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]})
  }
  await navigate('/')
  if (!v1Archive) {
    await check('New visitors start in light mode on dark devices', "document.documentElement.dataset.theme==='light' && document.documentElement.dataset.themePreference==='light'")
    await evaluate("localStorage.setItem('portfolio-theme','system')")
    await cdp('Page.reload')
    await settle()
    await check('Legacy automatic preferences migrate to light', "document.documentElement.dataset.theme==='light' && localStorage.getItem('portfolio-theme')==='light'")
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'light'}]})
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:'dark'}]})
    await wait(300)
    await check('Device theme changes keep the selected light theme', "document.documentElement.dataset.theme==='light' && document.querySelector('meta[name=\"theme-color\"]').content==='#ffffff'")
    await cdp('Emulation.setEmulatedMedia',{features:[]})
  }
  await theme('dark')
  if (v1Archive) {
    await evaluate("Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))")
    await check('V1 renders under the GitHub Pages base path', "location.pathname==='/irabor.com.ng/' && !!document.querySelector('#main-content h1')")
    await check('V1 assets load under the archive base path', "[...document.images].filter(img=>img.currentSrc).every(img=>new URL(img.currentSrc).pathname.startsWith('/irabor.com.ng/') && img.complete && img.naturalWidth>0)")
    await check('V1 internal links preserve their base path', "[...document.querySelectorAll('a[href^=\"/\"]')].every(a=>a.getAttribute('href').startsWith('/irabor.com.ng/'))")
    await check('V1 favicon and manifest resolve', "Promise.all([...document.querySelectorAll('link[rel=\"icon\"],link[rel=\"manifest\"]')].map(async link=>{const response=await fetch(link.href);return response.ok})).then(results=>results.every(Boolean))")
    await check('V1 service worker uses the archive scope', "navigator.serviceWorker.ready.then(registration=>new URL(registration.scope).pathname==='/irabor.com.ng/')")
    await screenshot('v1-desktop.png')
    await evaluate("document.querySelector('a[href=\"/irabor.com.ng/projects\"]').click()")
    await settle()
    await check('V1 client navigation opens projects', "location.pathname==='/irabor.com.ng/projects' && !!document.querySelector('.post-list__item')")
    const casePath = await evaluate("new URL(document.querySelector('.post-list__primary-link').href).pathname.slice('/irabor.com.ng'.length)")
    await navigate(casePath)
    await check('V1 case studies survive direct navigation', "!!document.querySelector('.article') || !!document.querySelector('.article-layout')")
    await size(390)
    await noOverflow('V1 mobile case study fits')
    await screenshot('v1-mobile.png')
    await check('V1 has no browser runtime errors', 'true')
    checks.at(-1).passed=runtimeErrors.length===0 && consoleErrors.length===0
    if(!checks.at(-1).passed) throw new Error('V1 browser runtime errors')
    console.log(JSON.stringify({checks,runtimeErrors,consoleErrors},null,2))
  } else if (baseline) {
    await screenshot('before-desktop.png')
    await size(390)
    await settle()
    await screenshot('before-mobile.png')
    console.log(`Baseline captures: ${join(output, 'before-desktop.png')} and before-mobile.png`)
  } else {
    await check('Floating navigation is commented out', "!document.querySelector('.site-header') && !document.querySelector('.site-mobile-nav')")
    await check('Status gradient is commented out', "!document.querySelector('.status-bar')")
    await check('Safe-area spacing is zero', "parseFloat(getComputedStyle(document.querySelector('.site-shell')).getPropertyValue('--safe-area-top'))===0")
    await check('Homepage shows current-year projects including V2', "document.querySelectorAll('.project-card').length===5 && !!document.querySelector('a[href=\"/projects/portfolio-v2\"]') && !document.querySelector('a[href=\"/projects/payship-fintech-platform\"]')")
    await check('Irabor V2 thumbnail preserves the full image', "getComputedStyle(document.querySelector('a[href=\"/projects/portfolio-v2\"] img')).objectFit==='contain'")
    await check('Profile role is Frontend Engineer', "document.querySelector('.profile-identity__role').textContent==='Frontend Engineer'")
    await check('Homepage entrance matches reference timing', "(() => {const name=getComputedStyle(document.querySelector('#profile-name'));const role=getComputedStyle(document.querySelector('.profile-identity__role'));return name.animationName==='profile-content-enter' && name.animationDuration==='0.35s' && Math.abs(parseFloat(name.animationDelay)-0.04)<0.001 && Math.abs(parseFloat(role.animationDelay)-parseFloat(name.animationDelay)-0.05)<0.001})()")
    const sectionTopBeforeEntrance = await evaluate("document.getElementById('experience').getBoundingClientRect().top")
    await evaluate("(() => {const root=document.querySelector('.profile-layout');root.classList.remove('profile-layout--enter');void root.offsetHeight;root.classList.add('profile-layout--enter');window.__entranceAnimations=root.getAnimations({subtree:true}).filter(animation=>animation.animationName==='profile-content-enter');window.__entranceAnimations.forEach(animation=>{animation.pause();animation.currentTime=animation.effect.getTiming().delay+175})})()")
    await check('Entrance fades, rises, and sharpens content', "(() => {const s=getComputedStyle(document.querySelector('#profile-name'));const y=new DOMMatrix(s.transform).m42;return Number(s.opacity)>0 && Number(s.opacity)<1 && y>0 && y<10 && s.filter.includes('blur(')})()")
    await check('Entrance preserves section geometry', `Math.abs(document.getElementById('experience').getBoundingClientRect().top-${sectionTopBeforeEntrance})<0.1`)
    await screenshot('entrance-mid-desktop.png')
    await evaluate("Promise.all(window.__entranceAnimations.map(animation=>{animation.play();return animation.finished.catch(()=>{})}))")
    await check('Entrance finishes with sharp visible content', "[...document.querySelectorAll('.profile-enter')].every(el=>{const s=getComputedStyle(el);return s.opacity==='1' && s.filter==='none' && s.transform==='none'})")
    await check('Desktop top spacing is compact', "parseFloat(getComputedStyle(document.querySelector('.site-main')).paddingTop)===32")
    await check('Footer credit paragraph is removed', "!document.querySelector('.profile-colophon').textContent.includes('Built with React')")
    await check('Company link includes a diagonal arrow', "!!document.querySelector('.experience-entry__company-link svg')")
    await check('Single contact toggle sits above page layers', "(() => {const el=document.querySelector('.social-rail--floating');const s=getComputedStyle(el);return el.parentElement===document.body && s.position==='fixed' && Number(s.zIndex)>101 && s.right==='24px' && s.bottom==='24px' && el.querySelectorAll('button').length===1})()")
    await check('Contact links start hidden and unfocusable', "document.querySelector('.social-rail__links').inert && document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='false' && [...document.querySelectorAll('.social-rail__links a')].every(el=>el.tabIndex===-1 && getComputedStyle(el).visibility==='hidden')")
    await check('Contact trigger uses a speech bubble', "document.querySelector('.social-rail__toggle-icon svg').innerHTML.includes('M7 10h10M7 14h6')")
    await check('Contact buttons use solid circular surfaces', "[...document.querySelectorAll('.social-rail--floating a')].every(el=>{const s=getComputedStyle(el);return s.borderRadius==='50%' && s.backdropFilter==='none' && !s.backgroundColor.startsWith('rgba(')})")
    await screenshot('desktop.png')
    await evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})")
    await evaluate("Promise.all([...document.querySelectorAll('#projects img')].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))")
    await check('Irabor V2 cover image loads successfully', "(() => {const img=document.querySelector('a[href=\"/projects/portfolio-v2\"] img');return img.complete && img.naturalWidth>0})()")
    await screenshot('v2-cover-desktop.png',{preserveScroll:true})
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
      if (desired==='light') {
        await evaluate("document.getElementById('projects').scrollIntoView({behavior:'instant'})")
        await evaluate("Promise.all([...document.querySelectorAll('#projects img')].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))")
        await screenshot('v2-cover-mobile.png',{preserveScroll:true})
      }
      await evaluate("document.getElementById('experience').scrollIntoView({behavior:'instant'});window.scrollBy({top:150,behavior:'instant'})")
      await wait(200)
      await check('Full-width sticky heading '+desired, "(() => {const r=document.querySelector('#experience h2').getBoundingClientRect();return Math.abs(r.top)<2 && Math.abs(r.left)<2 && Math.abs(r.width-innerWidth)<2})()")
      await check('Solid section heading '+desired, "(() => {const s=getComputedStyle(document.querySelector('#experience h2'));return s.backdropFilter==='none' && !s.backgroundColor.startsWith('rgba(')})()")
      await screenshot('experience-mobile-'+desired+'.png',{preserveScroll:true})
    }
    await evaluate("document.querySelector('.social-rail__toggle').focus()")
    await key('Enter','Enter',13)
    await wait(400)
    await check('Keyboard opens the contact fan', "document.querySelector('.social-rail__toggle').getAttribute('aria-expanded')==='true' && !document.querySelector('.social-rail__links').inert")
    const openingTiming = await evaluate("[...document.querySelectorAll('.social-rail__links a')].map(el=>{const s=getComputedStyle(el);return {duration:s.transitionDuration,delay:s.transitionDelay.split(',').slice(0,2).join(',')}})")
    await check('Expanded links stay on screen and respond to pointer hits', "[...document.querySelectorAll('.social-rail__links a')].every(el=>{const r=el.getBoundingClientRect();return r.left>=0 && r.right<=innerWidth && r.top>=0 && r.bottom<=innerHeight && el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))})")
    await screenshot('contact-open-mobile.png',{preserveScroll:true})
    await key('Tab','Tab',9)
    await check('Expanded links receive keyboard focus', "document.querySelector('.social-rail__links').contains(document.activeElement)")
    await key('Escape','Escape',27)
    const closingTiming = await evaluate("[...document.querySelectorAll('.social-rail__links a')].map(el=>{const s=getComputedStyle(el);return {duration:s.transitionDuration,delay:s.transitionDelay.split(',').slice(0,2).join(',')}})")
    checks.push({name:'Contact fan opening and closing share timing',passed:JSON.stringify(openingTiming)===JSON.stringify(closingTiming)})
    if (!checks.at(-1).passed) throw new Error('Contact timing mismatch')
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
    const profileHeadingPadding = await evaluate("getComputedStyle(document.querySelector('#experience h2')).paddingTop")
    await evaluate("document.querySelector('a[href=\"/archive\"]').click()")
    await settle()
    await check('Archive includes only past-year projects', "location.pathname==='/archive' && document.querySelectorAll('.project-archive tbody tr').length===5 && [...document.querySelectorAll('.project-archive tbody tr')].every(row=>Number(row.querySelector('td').textContent)<new Date().getFullYear())")
    await check('V1 archive links to GitHub Pages', "!!document.querySelector('.project-archive a[href=\"https://p0slyx23.github.io/irabor.com.ng/\"]')")
    await check('Archive has stable unfiltered page layers', "(() => {const s=getComputedStyle(document.querySelector('.route-frame'));return s.animationName==='none' && s.transform==='none' && s.filter==='none' && getComputedStyle(document.querySelector('thead')).backdropFilter==='none'})()")
    await check('Archive years are newest first', "(() => {const years=[...document.querySelectorAll('.project-archive tbody tr')].map(row=>Number(row.querySelector('td').textContent));return years.every((year,index)=>index===0 || years[index-1]>=year)})()")
    await check('Mobile archive hides external links', "[...document.querySelectorAll('.project-archive__live')].every(el=>getComputedStyle(el).display==='none')")
    await check('Archive back link is plain with zero bottom margin', "(() => {const s=getComputedStyle(document.querySelector('.project-archive__back'));return s.marginBottom==='0px' && s.padding==='0px' && s.borderTopWidth==='0px' && s.boxShadow==='none' && s.backgroundColor==='rgba(0, 0, 0, 0)'})()")
    await check('Archive headings retain profile label typography', "(() => {const s=getComputedStyle(document.querySelector('thead th'));return s.fontSize==='13px' && s.fontWeight==='700' && s.letterSpacing==='1.3px'})()")
    await check('Mobile archive matches homepage heading padding', `getComputedStyle(document.querySelector('thead th')).paddingTop===${JSON.stringify(profileHeadingPadding)}`)
    await check('Mobile archive header uses solid native table cells', "(() => {const r=document.querySelector('thead').getBoundingClientRect();const s=getComputedStyle(document.querySelector('thead th'));return Math.abs(r.left)<1 && Math.abs(r.width-innerWidth)<1 && s.backdropFilter==='none' && !s.backgroundColor.startsWith('rgba(')})()")
    await check('Final archive row has no bottom border', "[...document.querySelector('.project-archive tbody tr:last-child').children].every(el=>parseFloat(getComputedStyle(el).borderBottomWidth)===0)")
    await cdp('Emulation.setDeviceMetricsOverride',{width:390,height:360,deviceScaleFactor:1,mobile:true})
    await evaluate("window.scrollTo({top:300,behavior:'instant'})")
    await wait(100)
    await check('Mobile table headings stick while archive back scrolls away', "(() => {const th=document.querySelector('thead th');const back=document.querySelector('.project-archive__back');return Math.abs(th.getBoundingClientRect().top)<2 && getComputedStyle(back).position==='static' && back.getBoundingClientRect().bottom<0})()")
    await size(1440)
    await check('Desktop archive includes both PayShip store links', "(() => {const row=[...document.querySelectorAll('.project-archive tbody tr')].find(el=>el.textContent.includes('PayShip'));return row.querySelectorAll('.project-archive__links a').length===2 && getComputedStyle(row.querySelector('.project-archive__live')).display!=='none'})()")
    await check('Archive project links share a horizontal row', "(() => {const row=[...document.querySelectorAll('.project-archive tbody tr')].find(el=>el.textContent.includes('PayShip'));const links=[...row.querySelectorAll('.project-archive__links a')].map(el=>el.getBoundingClientRect());return Math.abs(links[0].top-links[1].top)<1 && links[0].right<links[1].left})()")
    await check('Desktop archive header has no bottom divider', "[...document.querySelectorAll('thead th')].every(el=>getComputedStyle(el).borderBottomWidth==='0px')")
    await check('Desktop archive header is exactly 52.33px tall', "Math.abs(document.querySelector('thead').getBoundingClientRect().height-52.33)<0.1")
    for (const width of [901,1024,1440]) {
      await size(width)
      await noOverflow('Archive fits '+width+'px')
    }
    await check('Desktop archive column headings are sticky', "getComputedStyle(document.querySelector('thead')).position==='sticky'")
    await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:360,deviceScaleFactor:1,mobile:false})
    await evaluate("window.scrollTo({top:300,behavior:'instant'})")
    await wait(150)
    await check('Desktop headings retain their columns while pinned', "[...document.querySelectorAll('thead th')].every(el=>Math.abs(el.getBoundingClientRect().top)<2)")
    await check('Pinned desktop header retains its 52.33px height', "Math.abs(document.querySelector('thead').getBoundingClientRect().height-52.33)<0.1")
    await screenshot('archive-desktop.png',{preserveScroll:true})
    await size(390)
    await noOverflow('Archive mobile fits')
    await screenshot('archive-mobile.png')
    for (const width of [390,901]) {
      await cdp('Emulation.setDeviceMetricsOverride',{width,height:480,deviceScaleFactor:1,mobile:width<700})
      for (const offset of [0,120,260,0,200]) {
        await evaluate(`window.scrollTo({top:${offset},behavior:'instant'})`)
        await wait(offset===200?1500:350)
        const bounds = await evaluate("(() => {const header=document.querySelector('thead').getBoundingClientRect();const link=[...document.querySelectorAll('tbody th a')].find(el=>{const r=el.getBoundingClientRect();return r.top>header.bottom+2 && r.bottom<innerHeight-10});if(!link)return null;const r=link.getBoundingClientRect();return {left:Math.floor(r.left),top:Math.floor(r.top),width:Math.ceil(r.width),height:Math.ceil(r.height),dark:document.documentElement.dataset.theme==='dark'}})()")
        if (!bounds) throw new Error('No archive title available to inspect')
        const capture = await cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})
        const {data,info}=await sharp(Buffer.from(capture.data,'base64')).extract({left:bounds.left,top:bounds.top,width:bounds.width,height:bounds.height}).removeAlpha().raw().toBuffer({resolveWithObject:true})
        let inkPixels=0
        for(let pixel=0;pixel<data.length;pixel+=info.channels){const light=(data[pixel]+data[pixel+1]+data[pixel+2])/3;if(bounds.dark?light>120:light<140)inkPixels++}
        const painted=inkPixels>30
        checks.push({name:`Archive title remains painted after scrolling and pausing at ${width}px / ${offset}`,passed:painted})
        if(!painted) throw new Error('Archive title disappeared after scroll pause')
      }
    }
    await size(390)
    await evaluate("window.scrollTo({top:0,behavior:'instant'})")
    await evaluate("document.querySelector('.project-archive tbody th a').click()")
    await settle()
    await check('Case study offers an explicit back arrow', "!!document.querySelector('.project-back-link svg') && document.querySelector('.project-back-link').getAttribute('href')==='/#projects'")
    await evaluate("window.scrollTo({top:400,behavior:'instant'})")
    await wait(100)
    await check('Back button sticks with a solid surface', "(() => {const el=document.querySelector('.project-back-link');const s=getComputedStyle(el);return Math.abs(el.getBoundingClientRect().top-12)<2 && s.backdropFilter==='none' && !s.backgroundColor.startsWith('rgba(')})()")
    const backBounds = await evaluate("(() => {const r=document.querySelector('.project-back-link').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()")
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',...backBounds})
    await wait(250)
    await check('Back hover moves arrow left without underline', "(() => {const el=document.querySelector('.project-back-link');const m=new DOMMatrix(getComputedStyle(el.querySelector('svg')).transform);return getComputedStyle(el).textDecorationLine==='none' && m.m41 < -3 && Math.abs(m.m42)<0.5})()")
    await screenshot('article-mobile.png')
    await evaluate("document.querySelector('.project-back-link').click()")
    await settle()
    await waitFor(sectionIsAligned('projects'))
    await check('Case study back link returns to Projects', "location.hash==='#projects' && !!document.querySelector('#projects')")
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
    await navigate('/')
    await check('Reduced motion displays homepage content immediately', "[...document.querySelectorAll('.profile-enter')].every(el=>{const s=getComputedStyle(el);return s.animationName==='none' && s.opacity==='1'})")
    await cdp('Emulation.setEmulatedMedia',{features:[]})
    await navigate('/archive')
    await navigate('/#experience')
    await waitFor(sectionIsAligned('experience'))
    await check('Deep links open directly at their section', "!document.querySelector('.profile-layout--enter') && location.hash==='#experience'")
    await theme('light')
    await cdp('Emulation.setDeviceMetricsOverride',{width:960,height:748,deviceScaleFactor:2,mobile:false})
    await navigate('/')
    await evaluate("document.activeElement?.blur();Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{})}))")
    await screenshot('portfolio-v2-light.png')
    await check('V2 cover capture uses the light theme', "document.documentElement.dataset.theme==='light' && getComputedStyle(document.body).backgroundColor==='rgb(255, 255, 255)'")
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
    mode: v1Archive ? 'v1-archive' : baseline ? 'baseline' : 'after', checkedAt: new Date().toISOString(), fullPage,
    checks, runtimeErrors, consoleErrors, failure: failure?.message || null, failureDiagnostics,
    scope: `${process.env.PORTFOLIO_QA_ORIGIN ? 'Live-site' : 'Local production-bundle'} Chrome checks. Physical devices and assistive technology require separate verification.`,
  }
  await writeFile(join(output, v1Archive ? 'v1-checks.json' : baseline ? 'baseline-checks.json' : 'ui-checks.json'), JSON.stringify(report, null, 2))
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
