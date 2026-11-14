(() => {
  const root = document.documentElement;
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* storage unavailable */ } }
  };
  const vi = window.I18N_VI || {};
  const labels = {
    en: { light: 'Switch to light theme', dark: 'Switch to dark theme', lang: 'Xem bằng tiếng Việt', next: 'VI' },
    vi: { light: 'Chuyển sang giao diện sáng', dark: 'Chuyển sang giao diện tối', lang: 'View in English', next: 'EN' }
  };
  const themeButton = document.querySelector('#theme');
  const langButton = document.querySelector('#lang');

  // Remember the English markup so switching back never needs a second dictionary.
  const texts = [...document.querySelectorAll('[data-i18n]')].map(el => ({ el, key: el.dataset.i18n, en: el.innerHTML }));
  const attrs = [...document.querySelectorAll('[data-i18n-attr]')].flatMap(el =>
    el.dataset.i18nAttr.split(';').map(pair => {
      const [name, key] = pair.split(':');
      return { el, name, key, en: el.getAttribute(name) };
    }));

  let lang = store.get('lang') === 'vi' ? 'vi' : 'en';
  let theme = store.get('theme') || root.dataset.theme || 'dark';

  function applyTheme() {
    root.dataset.theme = theme;
    themeButton.textContent = theme === 'light' ? '☾' : '☀';
    themeButton.setAttribute('aria-label', labels[lang][theme === 'light' ? 'dark' : 'light']);
  }

  function applyLang() {
    root.lang = lang;
    for (const t of texts) t.el.innerHTML = lang === 'vi' && vi[t.key] ? vi[t.key] : t.en;
    for (const a of attrs) a.el.setAttribute(a.name, lang === 'vi' && vi[a.key] ? vi[a.key] : a.en);
    if (langButton) {
      langButton.textContent = labels[lang].next;
      langButton.setAttribute('aria-label', labels[lang].lang);
    }
    applyTheme();
  }

  themeButton.addEventListener('click', () => {
    theme = theme === 'light' ? 'dark' : 'light';
    store.set('theme', theme);
    applyTheme();
  });
  if (langButton) langButton.addEventListener('click', () => {
    lang = lang === 'vi' ? 'en' : 'vi';
    store.set('lang', lang);
    applyLang();
  });

  applyLang();
})();
