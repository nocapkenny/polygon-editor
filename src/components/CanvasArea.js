import { render } from "../core/renderer.js";
import { state } from "../core/state.js";
import { selectPolygon } from "../core/actions.js";

class CanvasArea extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<canvas id="canvas"></canvas>`;
    this.canvas = this.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("click", (e) => this.handleClick(e));

    this.loop();
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const clickedPolygon = [...state.polygons]
      .reverse()
      .find((polygon) => {
        const path = new Path2D();

        polygon.points.forEach((p, i) => {
          if (i === 0) path.moveTo(p.x, p.y);
          else path.lineTo(p.x, p.y);
        });

        path.closePath();
        return this.ctx.isPointInPath(path, x, y);
      });
    selectPolygon(clickedPolygon ?? null);
  }

  resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    this.canvas.width = width;
    this.canvas.height = height;
  }

  loop() {
    render(this.ctx, this.canvas);
    requestAnimationFrame(() => this.loop());
  }
}

customElements.define("canvas-area", CanvasArea);
