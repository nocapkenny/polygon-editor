import {
  clampPointToCanvas,
  doPolygonsOverlap,
  rand,
  randomColor,
} from "../utils/helpers.js";

const MAX_GENERATION_ATTEMPTS = 100;

/**
 * Генерирует полигон внутри canvas без наложения на существующие фигуры.
 *
 * @param {number} canvasWidth - Ширина канваса.
 * @param {number} canvasHeight - Высота канваса.
 * @param {Array<{ id: number|string, points: Array<{ x: number, y: number }> }>} existingPolygons
 * @returns {{ id: number, points: Array<{x: number, y: number}>, color: string } | null}
 */
export const generatePolygon = (
  canvasWidth,
  canvasHeight,
  existingPolygons = [],
) => {
  for (
    let attemptIndex = 0;
    attemptIndex < MAX_GENERATION_ATTEMPTS;
    attemptIndex++
  ) {
    const pointsCount = rand(3, 7);
    const padding = 10;
    const cx = rand(padding, canvasWidth - padding);
    const cy = rand(padding, canvasHeight - padding);
    const points = [];
    const shouldBeConcave = Math.random() < 0.5;
    const concaveIndices = shouldBeConcave ? [rand(0, pointsCount)] : [];

    for (let pointIndex = 0; pointIndex < pointsCount; pointIndex++) {
      const angle = (Math.PI * 2 * pointIndex) / pointsCount;
      let radius = rand(35, 75);

      if (concaveIndices.includes(pointIndex)) {
        radius = rand(10, 28);
      }

      points.push(
        clampPointToCanvas(canvasWidth, canvasHeight, {
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        }),
      );
    }

    const hasOverlap = existingPolygons.some((polygon) =>
      doPolygonsOverlap(points, polygon.points),
    );

    if (!hasOverlap) {
      return {
        id: Date.now() + attemptIndex,
        points,
        color: randomColor(),
      };
    }
  }

  return null;
};
