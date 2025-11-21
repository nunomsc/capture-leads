// script-question.js
// Question1 logic: detect language, load localized UI, handle selection and server persistence

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

const lang = detectLang();
try { localStorage.setItem('lang', lang); } catch (e) {}

// Load localized UI
fetch('locales/' + encodeURIComponent(lang) + '.json')
  .then(r => r.json())
  .then(data => {
    if (data.page1 && data.page1.title) {
      const t = document.getElementById('title');
      if (t) t.innerText = data.page1.title;
    }
    const nextBtn = document.getElementById('next');
    if (nextBtn && data.button && data.button.next) nextBtn.innerText = data.button.next;
  })
  .catch(() => {
    // fallback: load default locale (pt)
    fetch('locales/pt.json').then(r => r.json()).then(data => {
      const t = document.getElementById('title');
      if (t && data.page1 && data.page1.title) t.innerText = data.page1.title;
      const nextBtn = document.getElementById('next');
      if (nextBtn && data.button && data.button.next) nextBtn.innerText = data.button.next;
    }).catch(() => {});
  });

// selection logic
const customSelectEl = document.getElementById('customSelect');
const optionsList = customSelectEl ? Array.from(customSelectEl.querySelectorAll('.options li')) : [];
let selectedChoice = null;

optionsList.forEach(li => {
  li.addEventListener('click', (e) => {
    e.stopPropagation();
    optionsList.forEach(i => i.classList.remove('selected'));
    li.classList.add('selected');
    selectedChoice = li.dataset.value;
  });
});

// submit
const form = document.getElementById('leadForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const errEl = document.getElementById('error');
    if (errEl) { errEl.style.display = 'none'; errEl.innerText = ''; }

    if (!selectedChoice) {
      if (errEl) { errEl.innerText = (lang === 'en' ? 'Please select an option.' : 'Por favor selecione uma opção.'); errEl.style.display = 'block'; }
      return;
    }

    const fd = new FormData();
    fd.append('choices[]', selectedChoice);
    fd.append('lang', lang);

    fetch('form_submit.php', { method: 'POST', body: fd })
      .then(r => r.json())
      .then(resp => {
        if (resp && resp.success && resp.id) {
          window.location.href = 'question2.html?lead_id=' + encodeURIComponent(resp.id) + '&lang=' + encodeURIComponent(lang);
        } else {
          try { localStorage.setItem('selectedOption', selectedChoice); } catch (err) {}
          window.location.href = 'question2.html?lang=' + encodeURIComponent(lang);
        }
      })
      .catch(err => {
        console.error('Error saving selection:', err);
        try { localStorage.setItem('selectedOption', selectedChoice); } catch (e) {}
        window.location.href = 'question2.html?lang=' + encodeURIComponent(lang);
      });
  });
}

// hide options on outside click
document.addEventListener('click', (e) => {
  if (!customSelectEl) return;
  const opts = customSelectEl.querySelector('.options');
  if (opts && !customSelectEl.contains(e.target)) opts.style.display = 'none';
});

