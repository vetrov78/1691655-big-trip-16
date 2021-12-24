
import { createEditPointTemplate } from './site-edit.tpl';
import { createElement } from '../../utils/render';

export default class EditPointView {
  #element = null;
  #event = null;

  constructor (event = {}) {
    this.#event = event;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createEditPointTemplate(this.#event);
  }

  removeElement() {
    this.#element = null;
  }
}
