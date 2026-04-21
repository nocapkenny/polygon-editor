class AppRoot extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="app">
                <info-panel></info-panel>
                <canvas-area></canvas-area>
                <tool-bar></tool-bar>
            </div>
        `;
  }
}

customElements.define("app-root", AppRoot);
