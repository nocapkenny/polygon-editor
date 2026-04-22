import { clampPointToCanvas, rand, randomColor } from "../utils/helpers.js";

/**
 * 
 * @param {number} canvasWidth - Ширина канваса
 * @param {number} canvasHeight - Высота канваса
 * @returns {{ id: number, points: [{x: number, y: number}], color: string }} - Полигон
 */
export const generatePolygon = (canvasWidth, canvasHeight) => {
  const pointsCount = rand(3, 7);

  const padding = 10;
  const cx = rand(padding, canvasWidth - padding);
  const cy = rand(padding, canvasHeight - padding);

  const points = [];

  for (let i = 0; i < pointsCount; i++) {
    const angle = (Math.PI * 2 * i) / pointsCount;
    const radius = rand(30, 70);

    points.push(clampPointToCanvas(canvasWidth, canvasHeight, {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    }));
  }

  return {
    id: Date.now(),
    points,
    color: randomColor(),
  };
};
