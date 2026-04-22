import { state } from "./state.js";

/**
 * Рендер полигонов на канвасе
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {HTMLCanvasElement} canvas 
 */
export const render = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  state.polygons.forEach((polygon) => {
    drawPolygon(ctx, polygon, polygon.id === state.selectedId);
  });
};

/**
 * Рисует полигон
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} polygon - { id: number, points: [{x: number, y: number}], color: string } 
 * @param {boolean} selected 
 */
const drawPolygon = (ctx, polygon, selected) => {
  ctx.beginPath();

  polygon.points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });

  ctx.closePath();

  ctx.fillStyle = polygon.color;
  ctx.fill();
  ctx.strokeStyle = selected ? "blue" : "black";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.stroke();
};
