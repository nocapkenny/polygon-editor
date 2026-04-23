import { state } from "./state.js";
import { history } from "./history.js";
import { addPolygon } from "./actions.js";
import { modalState } from "./modal.js";

const STATE_STORAGE_KEY = "state";

/**
 * Сохраняет состояние в localStorage
 */
export const saveLocalState = () => {
  const serializableState = {
    polygons: state.polygons,
  };

  localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(serializableState));
};

/**
 * Загружает состояние из localStorage
 */
export const loadLocalState = () => {
  const rawState = localStorage.getItem(STATE_STORAGE_KEY);

  if (!rawState) {
    return;
  }

  try {
    const parsedState = JSON.parse(rawState);

    state.polygons = Array.isArray(parsedState?.polygons)
      ? parsedState.polygons
      : [];

    history.undoStack = [];
    history.redoStack = [];

    state.notify();
  } catch (error) {
    console.error("Не удалось восстановить состояние из localStorage", error);
    localStorage.removeItem(STATE_STORAGE_KEY);
  }
};

/**
 * Сохраняет состояние в файл
 */
export const exportState = () => {
    const serializableState = {
        polygons: state.polygons,
    };
    const json = JSON.stringify(serializableState);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date();
    const filename = `state-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Загружает состояние из файла
 */
export const importState = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const json = reader.result;
            const exportedState = JSON.parse(json);
            if(!exportedState.polygons){
                modalState.message = "Некорректный файл";
                modalState.isOpen = true;
                state.notify();
                return;
            }
            exportedState.polygons.forEach(polygon => {
                addPolygon(polygon);
            });
        };
        reader.readAsText(file);
    };
    input.click();
}
