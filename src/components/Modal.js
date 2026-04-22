import { modalState } from "../core/modal.js";
import { state } from "../core/state.js";

class Modal extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__content">
          <p class="modal__content-text text"></p>
          <button type="button" class="btn">Закрыть</button>
        </div>
      </div>
    `;

    this.modal = this.querySelector(".modal");
    this.text = this.querySelector(".modal__content-text");
    this.button = this.querySelector("button");

    this.button.addEventListener("click", () => {
      modalState.isOpen = false;
      state.notify();
    });

    this.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal__overlay")) {
        modalState.isOpen = false;
        state.notify();
      }
    });

    state.subscribe(() => this.update());
    this.update();
  }

  update() {
    this.text.textContent = modalState.message ?? "";
    this.modal.classList.toggle("modal--open", modalState.isOpen);
  }
}

customElements.define("modal-component", Modal);
