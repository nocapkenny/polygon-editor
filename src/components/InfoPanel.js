import { selectedPolygonText } from "../utils/helpers.js";
import { state } from "../core/state.js";

class InfoPanel extends HTMLElement {
  connectedCallback() {
    this.render();

    state.subscribe(() => this.update());
  }

  render() {
    this.innerHTML = `
      <div class="infopanel">
        <div class="column">
          <p class="text">
            Полигонов на холсте:
            <span>${state.polygons.length}</span>
          </p>

          <p class="text">
            ${selectedPolygonText(state.selectedId)}
          </p>
        </div>
      </div>
    `;
  }

  update() {
    this.render();
  }
}

customElements.define("info-panel", InfoPanel);
