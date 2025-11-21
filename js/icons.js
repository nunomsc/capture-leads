class IconRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const icons = [
      { icon: 'fa-briefcase', color: '#007bff' },
      { icon: 'fa-folder', color: '#28a745' },
      { icon: 'fa-check', color: '#ffc107' }
    ];

    const style = `
      <style>
        .row {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .icon-circle {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          color: white;
          font-size: 24px;
        }
      </style>
    `;

    const html = `
      <div class="row">
        ${icons.map(ic => `
          <div class="icon-circle" style="background-color:${ic.color}">
            <i class="fa-solid ${ic.icon}"></i>
          </div>
        `).join('')}
      </div>
    `;

    this.shadowRoot.innerHTML = style + html;
  }
}

customElements.define('icon-row', IconRow);
