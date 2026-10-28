const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, 'dist');
const html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

const assetFiles = fs.readdirSync(path.join(distDir, 'assets'));
const cssFile = assetFiles.find(f => f.endsWith('.css'));
const jsFile = assetFiles.find(f => f.endsWith('.js'));

const css = fs.readFileSync(path.join(distDir, 'assets', cssFile), 'utf8');
const js = fs.readFileSync(path.join(distDir, 'assets', jsFile), 'utf8');

let single = html.replace(/<link rel="stylesheet"[^>]*>/, `<style>${css}</style>`);
// Note: replace script tag safely without special replacement patterns like $$ or $&
const scriptOpen = '<script type="module">';
const scriptClose = '</' + 'script>';
single = single.replace(/<script type="module"[^>]*><\/script>/, () => `${scriptOpen}\n${js}\n${scriptClose}`);

fs.writeFileSync(path.join(distDir, 'standalone.html'), single, 'utf8');
console.log('Standalone singlefile bundle generated successfully!');
console.log('Size:', (single.length / 1024).toFixed(2), 'KB');
