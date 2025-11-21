// script-landing.js
// Load localized strings for landing page and handle navigation
function detectLang() {
  const params = new URLSearchParams(window.location.search);
  const paramLang = params.get('lang');
  if (paramLang) return paramLang;
  const stored = localStorage.getItem('lang');
  if (stored) return stored;
  const nav = navigator.language || navigator.userLanguage || '';
  if (nav.toLowerCase().startsWith('en')) return 'en';
  return 'pt';
}

let lang = detectLang();
try { localStorage.setItem('lang', lang); } catch (e) {}

// Language selector logic
const langRadios = document.querySelectorAll('input[name="lang"]');
langRadios.forEach(radio => {
  radio.checked = (radio.value === lang);
  radio.addEventListener('change', (e) => {
    lang = e.target.value;
    try { localStorage.setItem('lang', lang); } catch (err) {}
    location.reload();
  });
});

fetch('locales/' + encodeURIComponent(lang) + '.json')
  .then(r => r.json())
  .then(data => {
    if (data.landing) {
      const t = document.getElementById('title');
      const desc = document.getElementById('description');
      const badge = document.getElementById('badge-time');
      if (t && data.landing.title) t.innerText = data.landing.title;
      if (desc && data.landing.description) desc.innerText = data.landing.description;
      if (badge && data.landing.badge) badge.innerText = data.landing.badge;
    }

    if (data.page1) {
      const receive = document.getElementById('receive');
      if (receive && data.page1.receive) receive.innerText = data.page1.receive;
    }

    if (data.steps) {
      ['title1','title2','title3','message1','message2','message3'].forEach(k => {
        const el = document.getElementById(k);
        if (el && data.steps[k]) el.innerText = data.steps[k];
      });
    }

    const startBtn = document.getElementById('startButton');
    if (startBtn && data.button && data.button.start) startBtn.innerText = data.button.start;
  })
  .catch(() => {
    // fallback: try default locale (pt)
    fetch('locales/pt.json').then(r => r.json()).then(data => {
      const t = document.getElementById('title');
      const desc = document.getElementById('description');
      if (t && data.landing && data.landing.title) t.innerText = data.landing.title;
      if (desc && data.landing && data.landing.description) desc.innerText = data.landing.description;
      const startBtn = document.getElementById('startButton');
      if (startBtn && data.button && data.button.start) startBtn.innerText = data.button.start;
    }).catch(() => {});
  });

// Navigate to question1 page when button is clicked
document.getElementById('startButton').addEventListener('click', function() {
  window.location.href = 'question1.html?lang=' + encodeURIComponent(lang);
});
