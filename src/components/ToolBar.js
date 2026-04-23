import { generatePolygon } from "../core/polygon.js";
import {
  addPolygon,
  deleteSelectedPolygon,
  deletePolygons,
  changePolygonColor,
} from "../core/actions.js";
import { history } from "../core/history.js";
import { state } from "../core/state.js";
import { keyHandler, hexToHsl } from "../utils/helpers.js";
import { modalState } from "../core/modal.js";
import { importState, exportState } from "../core/save.js";

class ToolBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="toolbar">
                <div class="line">
                  <div class="box">
                    <button title="Сгенерировать полигон" id="add" type="button" class="btn btn-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#F2F2F2" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#F2F2F2" stroke-width="1.5" stroke-linecap="round"></path> </g></svg></button>
                    <button title="Удалить выбранный" id="deleteSelected" type="button" class="btn btn-icon"><svg viewBox="0 0 1024 1024" fill="#F2F2F2" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#F2F2F2" stroke-width="25.6"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z" fill=""></path><path d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z" fill=""></path><path d="M328 340.8l32-31.2 348 348-32 32z" fill=""></path></g></svg></button>
                    <button title="Удалить все" id="delete" type="button" class="btn btn-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                    <button title="Отменить" id="undo" type="button" class="btn btn-icon"><svg style="transform: scaleX(-1);" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7H9.00001C7.13077 7 6.19615 7 5.5 7.40193C5.04395 7.66523 4.66524 8.04394 4.40193 8.49999C4 9.19615 4 10.1308 4 12C4 13.8692 4 14.8038 4.40192 15.5C4.66523 15.9561 5.04394 16.3348 5.5 16.5981C6.19615 17 7.13077 17 9 17H16M20 7L17 4M20 7L17 10" stroke="#F2F2F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                    <button title="Повторить" id="redo" type="button" class="btn btn-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7H9.00001C7.13077 7 6.19615 7 5.5 7.40193C5.04395 7.66523 4.66524 8.04394 4.40193 8.49999C4 9.19615 4 10.1308 4 12C4 13.8692 4 14.8038 4.40192 15.5C4.66523 15.9561 5.04394 16.3348 5.5 16.5981C6.19615 17 7.13077 17 9 17H16M20 7L17 4M20 7L17 10" stroke="#F2F2F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                  </div>
                  <div class="box">
                    <div class="divider"></div>
                    <button title="Импортировать сцену" id="import" type="button" class="btn">Импорт</button>
                    <button title="Экспортировать сцену" id="export" type="button" class="btn">Экспорт</button>
                    <div class="divider"></div>
                    <div class="color-picker">
                      <label class="text" for="color-picker">Изменить цвет</label>
                      <input type="color" id="color-picker" />
                    </div>
                  </div>
                </div>
            </div>
        `;

    // Handlers
    this.querySelector("#color-picker").addEventListener("input", (e) => {
      if (!state.selectedId) {
        modalState.message = "Выберите полигон для смены цвета";
        modalState.isOpen = true;
        state.notify();
        return;
      }
      const hslColor = hexToHsl(e.target.value);
      changePolygonColor(state.selectedId, hslColor);
    });
    this.querySelector("#add").addEventListener("click", () => {
      const canvas = document.querySelector("#canvas");
      if (!canvas) {
        console.error("Канвас не найден");
        return;
      }

      const polygon = generatePolygon(
        canvas.width,
        canvas.height,
        state.polygons,
      );

      if (!polygon) {
        modalState.message = "На холсте не осталось места для нового полигона";
        modalState.isOpen = true;
        state.notify();
        return;
      }

      addPolygon(polygon);
    });
    this.querySelector("#deleteSelected").addEventListener("click", () =>
      this.handleDelete(),
    );
    this.querySelector("#delete").addEventListener("click", () => {
      const stateBeforeDelete = { ...state };
      deletePolygons(stateBeforeDelete);
    });
    this.querySelector("#undo").addEventListener("click", () => history.undo());
    this.querySelector("#redo").addEventListener("click", () => history.redo());
    this.querySelector("#import").addEventListener("click", importState);
    this.querySelector("#export").addEventListener("click", exportState);
    keyHandler(history, () => this.handleDelete());
  }
  handleDelete() {
    if (!state.selectedId) {
      modalState.message = "Выберите полигон для удаления";
      modalState.isOpen = true;
      state.notify();
      return;
    }
    const polygon = state.polygons.find((p) => p.id === state.selectedId);
    deleteSelectedPolygon(polygon);
  }
}

customElements.define("tool-bar", ToolBar);
