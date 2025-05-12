#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import { minify } from 'html-minifier-terser';
import pages from './pages.config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const _binDir = path.dirname(__filename);
const __dirname = path.dirname(_binDir);
console.log(__dirname);

const VIEWS_DIR = path.join(__dirname, 'views');
const DIST_DIR = path.join(__dirname, 'public');

console.log(`Building templates from ${VIEWS_DIR} to ${DIST_DIR}...`);
console.log(`Using pages config: ${path.join(__dirname, 'pages.config.json')}`);
/*
console.log(`Using EJS version: ${ejs.VERSION}`);
console.log(`Using HTML Minifier version: ${minify.version}`);
console.log(`Using Node.js version: ${process.versions.node}`);
console.log(`Using OS: ${process.platform} ${process.arch}`);
console.log(`Using process.env.NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`Using process.env.NODE_OPTIONS: ${process.env.NODE_OPTIONS}`);
console.log(`Using process.env.PWD: ${process.env.PWD}`);
console.log(`Using process.env.HOME: ${process.env.HOME}`);
console.log(`Using process.env.TEMP: ${process.env.TEMP}`);
console.log(`Using process.env.TMPDIR: ${process.env.TMPDIR}`);
console.log(`Using process.env.TMP: ${process.env.TMP}`);
console.log(`Using process.env.TEMP_DIR: ${process.env.TEMP_DIR}`);
console.log(`Using process.env.TEMP_DIRS: ${process.env.TEMP_DIRS}`);
*/

const args = process.argv.slice(2);
const shouldMinify = args.includes('--minify');
const selectedTemplates = args.filter(arg => !arg.startsWith('--'));

const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    useShortDoctype: true
};

async function build() {
    await fs.mkdir(DIST_DIR, { recursive: true });

    const selectedPages = selectedTemplates.length
        ? pages.filter(p =>
            selectedTemplates.includes(path.parse(p.template).name)
        )
        : pages;

    if (selectedPages.length === 0) {
        console.warn('⚠️  No matching templates found.');
        return;
    }

    for (const { template, output, data } of selectedPages) {
        const templatePath = path.join(VIEWS_DIR, template);
        const outputPath = path.join(DIST_DIR, output);
        try {
            const html = await ejs.renderFile(templatePath, data, {});
            const finalHtml = shouldMinify
                ? await minify(html, minifyOptions)
                : html;

            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            await fs.writeFile(outputPath, finalHtml, 'utf8');
            console.log(`✔️  Rendered ${outputPath}${shouldMinify ? ' (minified)' : ''}`);
        } catch (err) {
            console.error(`❌ Error rendering ${templatePath}:`, err);
        }
    }
}

build();
