#!/usr/bin/env node
/*
 Script: strip-comments-safe.js
 - Walks frontend/src recursively
 - For .ts/.js files uses TypeScript scanner to remove SingleLineCommentTrivia and MultiLineCommentTrivia safely
 - For .html files removes <!-- --> comments
 - For .scss/.css files removes C-style block comments
 - Creates .bak backup before overwriting
 - Supports --dry-run to report files that would be changed
*/

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.resolve(__dirname, '..', 'src');
const exts_ts = new Set(['.ts', '.js']);
const exts_html = new Set(['.html']);
const exts_css = new Set(['.scss', '.css']);

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || args.includes('-n');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      // skip node_modules, dist, .angular cache folders
      if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.angular') continue;
      walk(full, cb);
    } else if (ent.isFile()) {
      cb(full);
    }
  }
}

function processTsLike(file) {
  const src = fs.readFileSync(file, 'utf8');
  const scanner = ts.createScanner(ts.ScriptTarget.Latest, /*skipTrivia*/ false, ts.LanguageVariant.Standard, src);
  let out = '';
  let tok;
  while ((tok = scanner.scan()) !== ts.SyntaxKind.EndOfFileToken) {
    if (tok === ts.SyntaxKind.SingleLineCommentTrivia || tok === ts.SyntaxKind.MultiLineCommentTrivia) {
      // skip comments
      continue;
    }
    out += scanner.getTokenText();
  }
  if (out !== src) {
    return out;
  }
  return null;
}

function processHtml(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/<!--([\s\S]*?)-->/g, (m) => {
    // keep conditional comments for IE if any (rare), but remove general comments
    if (/^<!--[\s]*\[if[\s\S]*?endif\][\s]*-->$/i.test(m)) return m;
    return '';
  });
  return out === src ? null : out;
}

function processCss(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = src.replace(/\/\*[\s\S]*?\*\//g, '');
  return out === src ? null : out;
}

const changes = [];
walk(ROOT, (file) => {
  const ext = path.extname(file).toLowerCase();
  let newContent = null;
  try {
    if (exts_ts.has(ext)) {
      newContent = processTsLike(file);
    } else if (exts_html.has(ext)) {
      newContent = processHtml(file);
    } else if (exts_css.has(ext)) {
      newContent = processCss(file);
    }
  } catch (err) {
    console.error('Error processing', file, err && err.message);
  }
  if (newContent !== null) {
    changes.push({ file, newContent });
  }
});

if (changes.length === 0) {
  console.log('No comments found to remove in', ROOT);
  process.exit(0);
}

console.log(`Found ${changes.length} files with comment changes.`);
if (dryRun) {
  for (const c of changes) console.log('[dry-run]', c.file);
  process.exit(0);
}

for (const c of changes) {
  const bak = c.file + '.bak';
  if (!fs.existsSync(bak)) fs.copyFileSync(c.file, bak);
  fs.writeFileSync(c.file, c.newContent, 'utf8');
  console.log('Updated', c.file);
}

console.log('Done. Backups written with .bak extension next to original files.');
