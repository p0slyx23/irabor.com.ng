import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const baseline = process.argv.includes('--baseline');
const siteRoot = new URL(baseline ? 'dist/' : 'docs/portfolio-v2/', root);
const output = new URL('docs/portfolio-v2/evidence/', root);
await mkdir(output, { recursive: true });
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, '');
    if (path.includes('..')) throw new Error('Invalid path');
    const asset = path && /\.[a-z0-9]+$/i.test(path) ? path : 'index.html';
    const data = await readFile(new URL(asset, siteRoot));
    const ext = asset.split('.').pop();
    res.writeHead(200, {'Content-Type': ({html:'text/html',js:'text/javascript',css:'text/css',svg:'image/svg+xml',webp:'image/webp',ttf:'font/ttf',png:'image/png'})[ext] || 'application/octet-stream'});
    res.end(data);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const profile = await mkdtemp(join(tmpdir(), 'irabor-report-qa-'));
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore', windowsHide: true });
let socket;
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
try {
  chrome.on('error', error => { console.error(error.message); });
  let port;
  for (let i = 0; i < 100; i++) {
    try { port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; break; }
    catch { await wait(100); }
  }
  if (!port) throw new Error('Chrome did not expose its debugging port.');
  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let seq = 0;
  const pending = new Map();
  socket.addEventListener('message', e => {
    const data = JSON.parse(e.data);
    if (!data.id) return;
    const task = pending.get(data.id);
    if (!task) return;
    pending.delete(data.id);
    if (data.error) task.reject(new Error(JSON.stringify(data.error)));
    else task.resolve(data.result);
  });
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const cdp = (method, params) => send(method, params, sessionId);
  await cdp('Page.enable');
  await cdp('Runtime.enable');
  const evaluate = async expression => {
    const response = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  const checks = [];
  const check = async (name, expression) => {
    const passed = await evaluate(expression);
    checks.push({ name, passed });
    if (!passed) throw new Error(`Failed: ${name}`);
  };
  const screenshot = async name => {
    if (process.argv.includes('--checks-only')) return;
    const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile(new URL(name, output), Buffer.from(data, 'base64'));
  };
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
  for (let i = 0; i < 60; i++) {
    if (await evaluate("document.readyState === 'complete' && [...document.images].every(i => i.complete && i.naturalWidth > 0)")) break;
    await wait(100);
  }
  if (baseline) {
    await screenshot('current-light-desktop.png');
    await evaluate("localStorage.setItem('portfolio-theme','dark');location.reload()");
    await wait(1500);
    await screenshot('current-dark-desktop.png');
    await cdp('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
    await screenshot('current-dark-mobile.png');
  } else {
    await check('Report preview loaded', "document.querySelector('#portfolio-frame').contentDocument.querySelector('#view').children.length > 0");
    await check('No desktop overflow', 'document.documentElement.scrollWidth <= innerWidth');
    await screenshot('v2-report-desktop.png');
    await evaluate("document.querySelector('#preview').scrollIntoView({behavior:'instant'})");
    await screenshot('v2-report-preview.png');
    await evaluate("document.querySelector('[data-layout=\"2\"]').click()");
    await wait(350);
    await check('Report selects direction 2', "document.querySelector('#portfolio-frame').contentDocument.documentElement.dataset.layout === '2'");
    await evaluate("document.querySelector('#show-current').click()");
    await check('Current comparison visible', "!document.querySelector('#before').hidden && document.querySelector('#portfolio-frame').hidden");
    await evaluate("document.querySelector('#show-v2').click();document.querySelector('#phone').click();document.querySelector('#light').click()");
    await wait(200);
    await check('Report controls affect preview', "document.querySelector('#frame-wrap').classList.contains('phone') && document.querySelector('#portfolio-frame').contentDocument.documentElement.dataset.theme === 'light'");
    await cdp('Emulation.setDeviceMetricsOverride', {width:390,height:844,deviceScaleFactor:1,mobile:true});
    await evaluate("window.scrollTo({top:0,behavior:'instant'})");
    await check('No phone report overflow', 'document.documentElement.scrollWidth <= innerWidth');
    await screenshot('v2-report-mobile.png');
    await cdp('Page.navigate', {url:`http://127.0.0.1:${server.address().port}/prototype.html`});
    await wait(500);
    for (const width of [1440,390]) {
      await cdp('Emulation.setDeviceMetricsOverride', {width,height:width===390?844:1000,deviceScaleFactor:1,mobile:width===390});
      for (let direction=1;direction<=5;direction++) {
        await evaluate(`document.querySelector('#layout-select').value='${direction}';document.querySelector('#layout-select').dispatchEvent(new Event('change'))`);
        await wait(350);
        await check(`Direction ${direction} at ${width}px has no overflow`, 'document.documentElement.scrollWidth <= innerWidth');
        await check(`Direction ${direction} images load at ${width}px`, "[...document.querySelectorAll('#view img')].every(i=>i.complete && i.naturalWidth>0)");
        await screenshot(`v2-${direction}-${width}.png`);
      }
    }
    await evaluate("document.querySelector('#layout-select').value='2';document.querySelector('#layout-select').dispatchEvent(new Event('change'));document.querySelector('[data-select=\"1\"]').click()");
    await check('Project index selects actual case', "document.querySelector('.index-preview h2').textContent === 'LGSC Election Results Platform'");
    await evaluate("document.querySelector('.index-preview [data-open]').click()");
    await check('Project detail opens with correct content', "document.querySelector('#detail-dialog').open && document.querySelector('#detail-title').textContent.includes('LGSC')");
    await cdp('Input.dispatchKeyEvent', {type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await cdp('Input.dispatchKeyEvent', {type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
    await check('Escape closes detail', "!document.querySelector('#detail-dialog').open");
    await evaluate("document.querySelector('#layout-select').value='5';document.querySelector('#layout-select').dispatchEvent(new Event('change'));document.querySelector('[data-filter=\"Mobile\"]').click()");
    await check('Mobile filter shows only PayShip', "document.querySelectorAll('.archive-card:not([hidden])').length === 1 && document.querySelector('.archive-card:not([hidden]) h2').textContent === 'PayShip'");
    await evaluate("document.querySelector('#menu-open').click();document.querySelector('#menu-dialog .theme-toggle').click()");
    await check('Menu and header theme stay synchronized', "document.documentElement.dataset.theme === 'light' && [...document.querySelectorAll('.theme-toggle')].every(b=>b.getAttribute('aria-pressed')==='false')");
    await check('Status strip shares theme background', "getComputedStyle(document.querySelector('.status')).backgroundColor === 'rgb(255, 255, 255)' && document.querySelector('meta[name=\"theme-color\"]').content === '#ffffff'");
    await screenshot('v2-menu-light-mobile.png');
    await evaluate("document.querySelector('#menu-close').click()");
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    await check('Menu closes and restores focus', "!document.querySelector('#menu-dialog').open && document.activeElement.id === 'menu-open'");
    await cdp('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await check('Reduced motion removes transitions', "getComputedStyle(document.querySelector('.button')).transitionDuration === '0s'");
    await writeFile(new URL('v2-checks.json',output),JSON.stringify({checks,note:'Local prototype/report checks, not a physical-device or production audit.'},null,2));
    console.log(JSON.stringify(checks,null,2));
  }
  await send('Browser.close');
} finally {
  socket?.close();
  chrome.kill();
  await new Promise(resolve => server.close(resolve));
  // Only remove the unique temporary Chrome profile created by this script.
  if (profile.startsWith(join(tmpdir(), 'irabor-report-qa-'))) {
    for (let i = 0; i < 10; i++) {
      try { await rm(profile, { recursive: true, force: true }); break; }
      catch { await wait(200); }
    }
  }
}

