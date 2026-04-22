import { state } from "./state.js";

const APPEAR_ANIMATION_DURATION = 220;
const polygonAnimationStarts = new Map();

/**
 * Рендерит полигоны на canvas.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {HTMLCanvasElement} canvas
 */
export const render = (ctx, canvas) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  syncAnimationState();

  state.polygons.forEach((polygon) => {
    drawPolygon(ctx, polygon, polygon.id === state.selectedId);
  });
};

/**
 * Синхронизирует служебное состояние анимации со списком полигонов.
 *
 * @returns {void}
 */
const syncAnimationState = () => {
  const polygonIds = new Set(state.polygons.map((polygon) => polygon.id));

  state.polygons.forEach((polygon) => {
    if (!polygonAnimationStarts.has(polygon.id)) {
      polygonAnimationStarts.set(polygon.id, performance.now());
    }
  });

  polygonAnimationStarts.forEach((_, polygonId) => {
    if (!polygonIds.has(polygonId)) {
      polygonAnimationStarts.delete(polygonId);
    }
  });
};

/**
 * Возвращает прогресс анимации появления полигона.
 *
 * @param {number|string} polygonId
 * @returns {number}
 */
const getAppearProgress = (polygonId) => {
  const animationStart = polygonAnimationStarts.get(polygonId);

  if (animationStart === undefined) {
    return 1;
  }

  if (animationStart === null) {
    return 1;
  }

  const elapsed = performance.now() - animationStart;
  const progress = Math.min(elapsed / APPEAR_ANIMATION_DURATION, 1);

  if (progress >= 1) {
    polygonAnimationStarts.set(polygonId, null);
  }

  return easeOutCubic(progress);
};

/**
 * Возвращает центр полигона.
 *
 * @param {{ points: Array<{ x: number, y: number }> }} polygon
 * @returns {{ x: number, y: number }}
 */
const getPolygonCenter = (polygon) => {
  const sum = polygon.points.reduce(
    (acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      return acc;
    },
    { x: 0, y: 0 },
  );

  return {
    x: sum.x / polygon.points.length,
    y: sum.y / polygon.points.length,
  };
};

/**
 * Плавное завершение анимации.
 *
 * @param {number} value
 * @returns {number}
 */
const easeOutCubic = (value) => {
  return 1 - Math.pow(1 - value, 3);
};

/**
 * Рисует полигон.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ id: number|string, points: Array<{ x: number, y: number }>, color: string }} polygon
 * @param {boolean} selected
 * @returns {void}
 */
const drawPolygon = (ctx, polygon, selected) => {
  const appearProgress = getAppearProgress(polygon.id);
  const scale = 0.88 + appearProgress * 0.12;
  const center = getPolygonCenter(polygon);

  ctx.save();
  ctx.globalAlpha = appearProgress;
  ctx.translate(center.x, center.y);
  ctx.scale(scale, scale);
  ctx.translate(-center.x, -center.y);

  ctx.beginPath();

  polygon.points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });

  ctx.closePath();

  ctx.fillStyle = polygon.color;
  ctx.fill();
  ctx.strokeStyle = selected ? "blue" : "black";
  ctx.lineWidth = selected ? 3 : 1;
  ctx.stroke();
  ctx.restore();
};
