/**
 * Возвращает текст для отображения текущего выбранного полигона.
 *
 * @param {?string|number} selectedId - Идентификатор выбранного полигона.
 * @returns {string} HTML-строка со статусом выбранного полигона.
 */
export const selectedPolygonText = (selectedId) => {
  if (selectedId === null) {
    return "Ничего не выбрано";
  } else {
    return `Текущий полигон: <span>${selectedId}</span>`;
  }
};

/**
 * Возвращает случайное целое число в диапазоне от `min` включительно до `max` не включительно.
 *
 * @param {number} min - Нижняя граница диапазона.
 * @param {number} max - Верхняя граница диапазона.
 * @returns {number} Случайное целое число.
 */
export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Ограничивает значение в заданном диапазоне.
 *
 * @param {number} value - Исходное значение.
 * @param {number} min - Минимально допустимое значение.
 * @param {number} max - Максимально допустимое значение.
 * @returns {number} Значение, ограниченное диапазоном.
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Генерирует случайный цвет в формате HSL.
 *
 * @returns {string} Строка цвета в формате `hsl(...)`.
 */
export const randomColor = () => {
  return `hsl(${rand(0, 360)}, 70%, 60%)`;
};

/**
 * Подписывает обработчик горячих клавиш для undo/redo.
 *
 * @param {{ undo: Function, redo: Function }} history - Объект с методами истории изменений.
 * @returns {void}
 */
export const keyHandler = (history) => {
  document.addEventListener("keydown", (e) => {
    if (e.key === "z" && e.ctrlKey) history.undo();
    if (e.key === "y" && e.ctrlKey) history.redo();
    if (e.key === "Z" && e.ctrlKey) history.undo();
    if (e.key === "Y" && e.ctrlKey) history.redo();
    if (e.key === "Н" && e.ctrlKey) history.redo();
    if (e.key === "н" && e.ctrlKey) history.redo();
    if (e.key === "я" && e.ctrlKey) history.undo();
    if (e.key === "Я" && e.ctrlKey) history.undo();
  });
};

/**
 * Ограничивает координаты точки границами canvas.
 *
 * @param {number} canvasWidth - Ширина canvas.
 * @param {number} canvasHeight - Высота canvas.
 * @param {{ x: number, y: number }} point - Координаты точки.
 * @returns {{ x: number, y: number }} Точка внутри границ canvas.
 */
export const clampPointToCanvas = (canvasWidth, canvasHeight, point) => {
  return {
    x: clamp(point.x, 0, canvasWidth),
    y: clamp(point.y, 0, canvasHeight),
  };
};

/**
 * Проверяет, находится ли точка внутри полигона.
 *
 * @param {{ x: number, y: number }} point
 * @param {Array<{ x: number, y: number }>} polygonPoints
 * @returns {boolean}
 */
export const isPointInsidePolygon = (point, polygonPoints) => {
  let isInside = false;

  for (
    let currentIndex = 0, previousIndex = polygonPoints.length - 1;
    currentIndex < polygonPoints.length;
    previousIndex = currentIndex++
  ) {
    const currentPoint = polygonPoints[currentIndex];
    const previousPoint = polygonPoints[previousIndex];
    const intersects =
      currentPoint.y > point.y !== previousPoint.y > point.y &&
      point.x <
        ((previousPoint.x - currentPoint.x) * (point.y - currentPoint.y)) /
          (previousPoint.y - currentPoint.y) +
          currentPoint.x;

    if (intersects) {
      isInside = !isInside;
    }
  }

  return isInside;
};

/**
 * Проверяет пересечение двух отрезков.
 *
 * @param {{ x: number, y: number }} a
 * @param {{ x: number, y: number }} b
 * @param {{ x: number, y: number }} c
 * @param {{ x: number, y: number }} d
 * @returns {boolean}
 */
export const doSegmentsIntersect = (a, b, c, d) => {
  const getOrientation = (p1, p2, p3) => {
    const value =
      (p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y);

    if (Math.abs(value) < 0.000001) {
      return 0;
    }

    return value > 0 ? 1 : 2;
  };

  const isPointOnSegment = (p1, p2, p3) => {
    return (
      p2.x <= Math.max(p1.x, p3.x) &&
      p2.x >= Math.min(p1.x, p3.x) &&
      p2.y <= Math.max(p1.y, p3.y) &&
      p2.y >= Math.min(p1.y, p3.y)
    );
  };

  const firstOrientation = getOrientation(a, b, c);
  const secondOrientation = getOrientation(a, b, d);
  const thirdOrientation = getOrientation(c, d, a);
  const fourthOrientation = getOrientation(c, d, b);

  if (
    firstOrientation !== secondOrientation &&
    thirdOrientation !== fourthOrientation
  ) {
    return true;
  }

  if (firstOrientation === 0 && isPointOnSegment(a, c, b)) return true;
  if (secondOrientation === 0 && isPointOnSegment(a, d, b)) return true;
  if (thirdOrientation === 0 && isPointOnSegment(c, a, d)) return true;
  if (fourthOrientation === 0 && isPointOnSegment(c, b, d)) return true;

  return false;
};

/**
 * Проверяет наложение двух полигонов.
 *
 * @param {Array<{ x: number, y: number }>} firstPolygonPoints
 * @param {Array<{ x: number, y: number }>} secondPolygonPoints
 * @returns {boolean}
 */
export const doPolygonsOverlap = (firstPolygonPoints, secondPolygonPoints) => {
  for (let firstIndex = 0; firstIndex < firstPolygonPoints.length; firstIndex++) {
    const firstStart = firstPolygonPoints[firstIndex];
    const firstEnd =
      firstPolygonPoints[(firstIndex + 1) % firstPolygonPoints.length];

    for (
      let secondIndex = 0;
      secondIndex < secondPolygonPoints.length;
      secondIndex++
    ) {
      const secondStart = secondPolygonPoints[secondIndex];
      const secondEnd =
        secondPolygonPoints[(secondIndex + 1) % secondPolygonPoints.length];

      if (doSegmentsIntersect(firstStart, firstEnd, secondStart, secondEnd)) {
        return true;
      }
    }
  }

  return (
    isPointInsidePolygon(firstPolygonPoints[0], secondPolygonPoints) ||
    isPointInsidePolygon(secondPolygonPoints[0], firstPolygonPoints)
  );
};
