document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const leadId = params.get('lead_id');

  const titleEl = document.getElementById('title');
  const descriptionEl = document.getElementById('description');
  const noteEl = document.getElementById('note');
  const bodyEl = document.getElementById('body');

  let contentMap = null;

  // Renderiza o corpo da opção selecionada
  function renderBody(selected) {
    if (!selected || !contentMap || !contentMap[selected]) {
      if (bodyEl) bodyEl.innerHTML = `<a href="question1.html">Voltar e escolher</a>`;
      return;
    }

    if (bodyEl) bodyEl.textContent = contentMap[selected].body;
  }

  // Determina o idioma
  function determineLang(leadLang) {
    const urlLang = params.get('lang');
    const storedLang = localStorage.getItem('lang');
    const defaultLang = navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'pt';
    const lang = urlLang || leadLang || storedLang || defaultLang;
    try { localStorage.setItem('lang', lang); } catch(e) {}
    return lang;
  }

  // Carrega o JSON do locale
  function loadLocale(lang, selected) {
    fetch(`locales/${encodeURIComponent(lang)}.json`)
      .then(r => r.json())
      .then(loc => {
        if (!loc?.page2) return;

        // Atualiza o título da página
        if (titleEl) titleEl.textContent = loc.page2.title;
        if (descriptionEl) descriptionEl.innerHTML = loc.page2.description;
        if (noteEl) noteEl.innerHTML = loc.page2.note;

        // Preenche contentMap
        contentMap = loc.page2.options || {};

        // Renderiza corpo da opção
        renderBody(selected);
      })
      .catch(() => renderBody(selected));
  }

  // Obtém a opção selecionada
  function getSelectedOption(leadData) {
    if (leadData?.choices && leadData.choices.length) return leadData.choices[0];
    return localStorage.getItem('selectedOption');
  }

  if (leadId) {
    fetch(`get_lead.php?lead_id=${encodeURIComponent(leadId)}`)
      .then(r => r.json())
      .then(resp => {
        const lead = resp?.lead || null;
        const selected = getSelectedOption(lead);
        const lang = determineLang(lead?.lang);

        // Se o servidor enviar conteúdo pronto
        if (resp?.content) {
          contentMap = { [selected]: resp.content };
          renderBody(selected);
          loadLocale(lang, selected); // ainda precisa do page2.title
          return;
        }

        loadLocale(lang, selected);
      })
      .catch(() => {
        const selected = localStorage.getItem('selectedOption');
        const lang = determineLang(null);
        loadLocale(lang, selected);
      });
  } else {
    const selected = localStorage.getItem('selectedOption');
    const lang = determineLang(null);
    loadLocale(lang, selected);
  }
});
