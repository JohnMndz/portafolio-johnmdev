import { chromium } from 'playwright-core';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const raiz = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const [, , salida, n = '4', w = '1280'] = process.argv;
const tipos = { '.html': 'text/html', '.js': 'text/javascript' };
const srv = http
	.createServer((q, s) => {
		const f = path.join(raiz, decodeURIComponent(q.url.split('?')[0]));
		fs.readFile(f, (e, d) => {
			if (e) {
				s.writeHead(404);
				s.end();
			} else {
				s.writeHead(200, { 'content-type': tipos[path.extname(f)] || 'application/octet-stream' });
				s.end(d);
			}
		});
	})
	.listen(5199);
fs.mkdirSync(salida, { recursive: true });
const b = await chromium.launch({
	executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
	// GPU real vía ANGLE/D3D11: mucho más rápido que SwiftShader y con MSAA.
	args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']
});
const p = await b.newPage();
p.on('pageerror', (e) => console.log('ERR', e.message));
p.on('console', (m) => m.type() === 'error' && console.log('CON', m.text()));
await p.goto(`http://localhost:5199/escena.html?w=${w}&modo=${process.argv[5] || 'escritorio'}`);
await p.waitForFunction('window.listo', null, { timeout: 60000 });
const total = +n;
for (let i = 0; i < total; i++) {
	const url = await p.evaluate((t) => window.renderFrame(t), total === 1 ? 0 : i / (total - 1));
	fs.writeFileSync(
		path.join(salida, `f${String(i).padStart(4, '0')}.png`),
		Buffer.from(url.split(',')[1], 'base64')
	);
}
await b.close();
srv.close();
console.log('ok', total);
