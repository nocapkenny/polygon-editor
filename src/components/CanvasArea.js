import { render } from "../core/renderer.js";
import { state } from "../core/state.js";
import { commitPolygonMove, selectPolygon } from "../core/actions.js";
import { clampPointToCanvas, doPolygonsOverlap } from "../utils/helpers.js";

class CanvasArea extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<canvas id="canvas"></canvas>`;
    this.canvas = this.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dragState = null;
    this.suppressClick = false;

    this.resize();
    window.addEventListener("resize", () => this.resize());
    this.canvas.addEventListener("click", (e) => this.handleClick(e));
    this.canvas.addEventListener("pointerdown", (e) => this.handlePointerDown(e));
    this.canvas.addEventListener("pointermove", (e) => this.handlePointerMove(e));
    this.canvas.addEventListener("pointerup", (e) => this.handlePointerUp(e));
    this.canvas.addEventListener("pointerleave", (e) => this.handlePointerUp(e));
    this.canvas.addEventListener("pointercancel", (e) => this.handlePointerUp(e));

    this.loop();
  }

  handlePointerDown(e) {
    e.preventDefault();

    const { x, y } = this.getCanvasPoint(e);
    const polygon = this.getPolygonAt(x, y);

    if (!polygon) {
      return;
    }

    selectPolygon(polygon);
    this.dragState = {
      pointerId: e.pointerId,
      polygonId: polygon.id,
      startX: x,
      startY: y,
      startPoints: polygon.points.map((point) => ({ ...point })),
      hasMoved: false,
    };

    this.canvas.setPointerCapture(e.pointerId);
  }

  handlePointerMove(e) {
    if (!this.dragState || this.dragState.pointerId !== e.pointerId) {
      return;
    }

    e.preventDefault();

    const { x, y } = this.getCanvasPoint(e);
    const dx = x - this.dragState.startX;
    const dy = y - this.dragState.startY;
    const polygon = state.polygons.find(
      (item) => item.id === this.dragState.polygonId,
    );

    if (!polygon) {
      return;
    }

    const nextPoints = this.dragState.startPoints.map((point) =>
      clampPointToCanvas(this.canvas.width, this.canvas.height, {
        x: point.x + dx,
        y: point.y + dy,
      }),
    );

    const hasOverlap = state.polygons.some((item) => {
      if (item.id === polygon.id) {
        return false;
      }

      return doPolygonsOverlap(nextPoints, item.points);
    });

    if (hasOverlap) {
      return;
    }

    polygon.points = nextPoints;

    this.dragState.hasMoved = true;
    state.notify();
  }

  handlePointerUp(e) {
    if (!this.dragState) {
      return;
    }

    e.preventDefault();

    if (e?.pointerId !== undefined && this.dragState.pointerId === e.pointerId) {
      this.canvas.releasePointerCapture(e.pointerId);
    }

    const polygon = state.polygons.find(
      (item) => item.id === this.dragState.polygonId,
    );

    if (polygon && this.dragState.hasMoved) {
      const nextPoints = polygon.points.map((point) => ({ ...point }));
      const didChange = nextPoints.some((point, index) => {
        const startPoint = this.dragState.startPoints[index];

        return point.x !== startPoint.x || point.y !== startPoint.y;
      });

      if (didChange) {
        this.suppressClick = true;
        commitPolygonMove(
          this.dragState.polygonId,
          this.dragState.startPoints,
          nextPoints,
        );
      }
    }

    this.dragState = null;
  }

  handleClick(e) {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }

    const { x, y } = this.getCanvasPoint(e);
    const clickedPolygon = this.getPolygonAt(x, y);

    selectPolygon(clickedPolygon ?? null);
  }

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  getPolygonAt(x, y) {
    return [...state.polygons].reverse().find((polygon) => {
      const path = new Path2D();

      polygon.points.forEach((point, index) => {
        if (index === 0) {
          path.moveTo(point.x, point.y);
        } else {
          path.lineTo(point.x, point.y);
        }
      });

      path.closePath();
      return this.ctx.isPointInPath(path, x, y);
    });
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
