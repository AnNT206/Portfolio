const themeButton = document.querySelector('#theme');
themeButton.addEventListener('click', () => {
  const light = document.documentElement.dataset.theme !== 'light';
  document.documentElement.dataset.theme = light ? 'light' : 'dark';
  themeButton.textContent = light ? '☾' : '☀';
  themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
});
