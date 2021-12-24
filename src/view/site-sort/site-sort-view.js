import { createElement } from '../../utils/render';
import { createSiteSortTemplate } from './site-sort.tpl';

export default class SiteSortView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteSortTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
