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

  const shouldBeConcave = Math.random() < 0.5;
  const concaveIndices = shouldBeConcave ? [rand(0, pointsCount)] : [];

  for (let i = 0; i < pointsCount; i++) {
    const angle = (Math.PI * 2 * i) / pointsCount;
    let radius = rand(35, 75);

    if (concaveIndices.includes(i)) {
      radius = rand(10, 28);
    }

    points.push(
      clampPointToCanvas(canvasWidth, canvasHeight, {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      }),
    );
  }

  return {
    id: Date.now(),
    points,
    color: randomColor(),
  };
};
