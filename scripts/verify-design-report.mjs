import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('docs/portfolio-design-report.html', root));
const output = new URL('docs/report-qa/', root);
await mkdir(output, { recursive: true });
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
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
    const { data } = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile(new URL(name, output), Buffer.from(data, 'base64'));
  };
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
  for (let i = 0; i < 60; i++) {
    if (await evaluate("document.readyState === 'complete' && [...document.images].every(i => i.complete && i.naturalWidth > 0)")) break;
    await wait(100);
  }
  await check('Five distinct concept sections', "document.querySelectorAll('section.concept').length === 5");
  await check('Embedded images decode', "[...document.images].every(i => i.complete && i.naturalWidth > 0 && i.src.startsWith('data:image/'))");
  await check('Internal links resolve', "[...document.querySelectorAll('a[href^=\"#\"]')].every(a => document.getElementById(a.hash.slice(1)))");
  await check('Desktop has no page overflow', 'document.documentElement.scrollWidth <= innerWidth');
  await screenshot('desktop.png');
  await evaluate("document.querySelector('[data-project=\"1\"]').click()");
  await check('Project selection updates preview', "document.querySelector('#ledger-image').alt.includes('LGSC') && document.querySelector('[data-project=\"1\"]').getAttribute('aria-pressed') === 'true'");
  for (const state of ['loading', 'error', 'empty', 'ready']) {
    await evaluate(`document.querySelector('.lab-tools [data-state="${state}"]').click()`);
    await check(`Workshop ${state} state`, `document.querySelector('#service-demo').dataset.state === '${state}'`);
  }
  await evaluate("document.querySelector('[data-layer=\"api\"]').click()");
  await check('Atlas explains API boundary', "document.querySelector('#layer-title').textContent === 'Enforce the boundary'");
  await evaluate("document.querySelector('#gallery-next').click()");
  await check('Gallery advances', "document.querySelector('#gallery-title').textContent === 'LGSC Election Results'");
  await evaluate("document.querySelector('#gallery-prev').click()");
  await check('Gallery returns', "document.querySelector('#gallery-title').textContent === 'Primewave Cleaning'");
  await evaluate("const field=document.querySelector('#note-search'); field.value='election'; field.dispatchEvent(new Event('input',{bubbles:true}))");
  await check('Search narrows to matching note', "document.querySelector('#note-count').textContent === '1 note'");
  await evaluate("document.querySelector('#note-search').value='no-such-topic';document.querySelector('#note-search').dispatchEvent(new Event('input'))");
  await check('Search has honest empty state', "!document.querySelector('#no-notes').hidden");
  await evaluate("document.querySelector('#note-search').value='';document.querySelector('#note-search').dispatchEvent(new Event('input'));document.querySelector('#motion-toggle').click();document.querySelector('#replay').click()");
  await check('Reduced motion disables replay', "!document.querySelector('#motion-box').classList.contains('play') && document.body.classList.contains('reduce')");
  await evaluate("document.querySelector('#workshop').scrollIntoView({behavior:'instant'})");
  await screenshot('workshop-desktop.png');
  await evaluate("document.querySelector('#viewport').click()");
  await wait(350);
  await check('Narrow preview mode', "document.querySelector('.preview').getBoundingClientRect().width <= 390");
  await screenshot('workshop-narrow-preview.png');
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await evaluate("window.scrollTo({top:0,behavior:'instant'})");
  await check('Phone has no page overflow', 'document.documentElement.scrollWidth <= innerWidth');
  await screenshot('mobile.png');
  await evaluate("document.querySelector('#workshop').scrollIntoView({behavior:'instant'})");
  await screenshot('workshop-mobile.png');
  await cdp('Emulation.setEmulatedMedia', { media: 'print' });
  await check('Print hides sticky toolbar', "getComputedStyle(document.querySelector('.toolbar')).display === 'none'");
  const result = { checkedAt: new Date().toISOString(), checks, note: 'Browser QA for this standalone report, not an audit of the deployed portfolio.' };
  await writeFile(new URL('checks.json', output), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
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
