// Genera static/og.png (1200x630) a partir de scripts/og/og.html con Chrome headless.
// Uso: node scripts/og/render.mjs [salida]
// Las fuentes se cargan desde node_modules (@fontsource), así que hace falta `npm install`.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const salida = path.resolve(process.argv[2] || 'static/og.png');

const candidatos = [
	process.env.CHROME_PATH,
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
	'/usr/bin/chromium'
].filter(Boolean);
const chrome = candidatos.find((c) => existsSync(c));
if (!chrome) throw new Error('No se encontró Chrome; define CHROME_PATH.');

execFileSync(chrome, [
	'--headless=new',
	'--disable-gpu',
	'--hide-scrollbars',
	'--force-device-scale-factor=1',
	'--allow-file-access-from-files',
	'--virtual-time-budget=3000',
	'--window-size=1200,630',
	`--screenshot=${salida}`,
	pathToFileURL(path.join(raiz, 'og.html')).href
]);
console.log('listo ->', salida);
