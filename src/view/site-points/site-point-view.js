import { createElement } from '../../utils/render';
import { createSitePointTemplate } from './site-points.tpl';

export default class SitePointView {
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
    return createSitePointTemplate(this.#event);
  }

  removeElement() {
    this.#element = null;
  }
}
