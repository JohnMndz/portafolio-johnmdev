import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('scripts/og.svg', 'utf-8');

const resvg = new Resvg(svg, {
	font: {
		fontFiles: ['scripts/fonts/crimson-700.ttf', 'scripts/fonts/inter-var.ttf'],
		loadSystemFonts: false,
		defaultFontFamily: 'Inter'
	}
});

const out = process.argv[2] || 'static/og.png';
const png = resvg.render();
writeFileSync(out, png.asPng());
console.log('done', png.width, png.height, '->', out);
