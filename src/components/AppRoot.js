class AppRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="app">
                <info-panel></info-panel>
                <canvas-area></canvas-area>
                <tool-bar></tool-bar>
                <modal-component>Выберите полигон</modal-component>
            </div>
        `;
  }
}

customElements.define("app-root", AppRoot);
