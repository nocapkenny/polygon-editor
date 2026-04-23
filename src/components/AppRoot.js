import { saveLocalState, loadLocalState } from "../core/save.js";

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

    loadLocalState();
    window.addEventListener("beforeunload", saveLocalState);
  }

  disconnectedCallback() {
    window.removeEventListener("beforeunload", saveLocalState);
  }
}

customElements.define("app-root", AppRoot);
