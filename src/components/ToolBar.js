import { generatePolygon } from "../core/polygon.js";
import { addPolygon } from "../core/actions.js";
import { history } from "../core/history.js";
import { keyHandler } from "../utils/helpers.js";

class ToolBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <div class="toolbar">
                <div class="line">
                  <button title="Добавить полигон" id="add" type="button" class="btn btn-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <circle cx="12" cy="12" r="10" stroke="#F2F2F2" stroke-width="1.5"></circle> <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#F2F2F2" stroke-width="1.5" stroke-linecap="round"></path> </g></svg></button>
                  <button title="Удалить полигон" id="delete" type="button" class="btn btn-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M10 11V17" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V17" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4 7H20" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#F2F2F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                  <button title="Повторить действие" id="redo" type="button" class="btn btn-icon"><svg fill="#F2F2F2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.94.56a8.05 8.05 0 0 1 6.82 3.64V1.55H16V5a1.16 1.16 0 0 1-1.15 1.15h-3.44V4.9h2.32a6.79 6.79 0 0 0-5.79-3.1A6.48 6.48 0 0 0 1.24 8a6.48 6.48 0 0 0 6.7 6.2 6.48 6.48 0 0 0 6.7-6.2h1.24a7.71 7.71 0 0 1-7.94 7.44A7.71 7.71 0 0 1 0 8 7.71 7.71 0 0 1 7.94.56z"></path></g></svg></button>
                  <button title="Отменить действие" id="undo" type="button" class="btn btn-icon"><svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 7H9.00001C7.13077 7 6.19615 7 5.5 7.40193C5.04395 7.66523 4.66524 8.04394 4.40193 8.49999C4 9.19615 4 10.1308 4 12C4 13.8692 4 14.8038 4.40192 15.5C4.66523 15.9561 5.04394 16.3348 5.5 16.5981C6.19615 17 7.13077 17 9 17H16M20 7L17 4M20 7L17 10" stroke="#F2F2F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></button>
                </div>
            </div>
        `;

    this.querySelector("#add").addEventListener('click', () => {
      const canvas = document.querySelector('#canvas');
      if(!canvas){
        console.error('Канвас не найден');
        return;
      }

      const polygon = generatePolygon(canvas.width, canvas.height);

      addPolygon(polygon);
    })

    this.querySelector('#undo').addEventListener('click', () => history.undo());
    this.querySelector('#redo').addEventListener('click', () => history.redo());
    keyHandler(history);
  }
}

customElements.define("tool-bar", ToolBar);
