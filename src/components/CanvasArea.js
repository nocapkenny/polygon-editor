import { render } from "../core/renderer.js";
import { state } from "../core/state.js";

class CanvasArea extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<canvas id="canvas"></canvas>`;
    this.canvas = this.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize());

    this.loop();
  }

  resize() {
    const rect = this.getBoundingClientRect();

    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  loop() {
    render(this.ctx, this.canvas);
    requestAnimationFrame(() => this.loop());
  }
}

customElements.define("canvas-area", CanvasArea);
