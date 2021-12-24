import { createElement } from '../../utils/render';
import { createPointListTemplate } from './site-list.tpl';

export default class PointsListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createPointListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
