export const selectedPolygonText = (selectedId) => {
  if (selectedId === null) {
    return "Ничего не выбрано";
  } else {
    return `Текущий полигон: <span>${selectedId}</span>`;
  }
};

export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const randomColor = () => {
  return `hsl(${rand(0, 360)}, 70%, 60%)`;
};

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
