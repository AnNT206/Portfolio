const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const pages = ['index.html', 'about.html', 'projects.html', 'uses.html'];
const html = Object.fromEntries(pages.map(p => [p, fs.readFileSync(p, 'utf8')]));
const idsOf = src => new Set([...src.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));

// 1. Internal links: pages exist, #anchors exist on the target page, local assets are non-empty.
for (const [page, src] of Object.entries(html)) {
  for (const [, ref] of src.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(ref) || ref === '#') continue;
    const [file, anchor] = ref.split('#');
    const target = file || page;
    assert(fs.existsSync(target) && fs.statSync(target).size > 0, `${page}: missing file ${target}`);
    if (anchor) assert(idsOf(html[target]).has(anchor), `${page}: missing #${anchor} in ${target}`);
  }
  assert.equal((src.match(/aria-current="page"/g) || []).length, page === 'index.html' ? 0 : 1, `${page}: nav current marker`);
}

// 2. Every translation key used in the HTML has a Vietnamese entry, and no entry is unused.
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('i18n.js', 'utf8'), sandbox);
const vi = sandbox.window.I18N_VI;
const used = new Set();
for (const src of Object.values(html)) {
  for (const [, key] of src.matchAll(/data-i18n="([^"]+)"/g)) used.add(key);
  for (const [, list] of src.matchAll(/data-i18n-attr="([^"]+)"/g)) list.split(';').forEach(p => used.add(p.split(':')[1]));
}
for (const key of used) assert(key in vi, `Missing Vietnamese text: ${key}`);
for (const key of Object.keys(vi)) assert(used.has(key), `Unused Vietnamese text: ${key}`);

// 3. Theme and language toggles, with a tiny fake DOM.
function el(attrs = {}, html = '') {
  const a = { ...attrs };
  return {
    innerHTML: html, textContent: '', listeners: {},
    dataset: Object.fromEntries(Object.entries(a).filter(([k]) => k.startsWith('data-')).map(([k, v]) => [k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase()), v])),
    getAttribute: k => a[k], setAttribute: (k, v) => { a[k] = v; },
    addEventListener(type, fn) { this.listeners[type] = fn; }, click() { this.listeners.click(); }
  };
}
const theme = el(), lang = el();
const title = el({ 'data-i18n': 'nav.about' }, 'About');
const img = el({ 'data-i18n-attr': 'alt:home.avatarAlt', alt: 'Portrait' });
const storage = {};
const document = {
  documentElement: { dataset: { theme: 'dark' }, lang: 'en' },
  querySelector: s => ({ '#theme': theme, '#lang': lang })[s],
  querySelectorAll: s => ({ '[data-i18n]': [title], '[data-i18n-attr]': [img] })[s]
};
const localStorage = { getItem: k => storage[k] ?? null, setItem: (k, v) => { storage[k] = String(v); } };
vm.runInNewContext(fs.readFileSync('script.js', 'utf8'), { document, localStorage, window: { I18N_VI: vi } });

theme.click();
assert.equal(document.documentElement.dataset.theme, 'light');
assert.equal(theme.getAttribute('aria-label'), 'Switch to dark theme');
assert.equal(storage.theme, 'light');
lang.click();
assert.equal(document.documentElement.lang, 'vi');
assert.equal(title.innerHTML, vi['nav.about']);
assert.equal(img.getAttribute('alt'), vi['home.avatarAlt']);
assert.equal(lang.textContent, 'EN');
assert.equal(theme.getAttribute('aria-label'), 'Chuyển sang giao diện tối');
lang.click();
assert.equal(title.innerHTML, 'About');
assert.equal(img.getAttribute('alt'), 'Portrait');
theme.click();
assert.equal(document.documentElement.dataset.theme, 'dark');

console.log(`Checked ${pages.length} pages, ${used.size} translation keys, theme and language toggles: all passed.`);
