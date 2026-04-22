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
