#!/usr/bin/env node

const fs = require('fs/promises');
const path = require('path');
const ejs = require('ejs');
const { minify } = require('html-minifier');
const pages = require('./pages.config.json');

// === Configuration ===
const VIEWS_DIR = path.join(__dirname, 'views');
const DIST_DIR = path.join(__dirname, 'dist');

// === CLI Flags ===
const args = process.argv.slice(2);
const shouldMinify = args.includes('--minify');
const selectedTemplates = args.filter(arg => !arg.startsWith('--'));

// === Build Function ===
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
        ? minify(html, {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
          })
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
