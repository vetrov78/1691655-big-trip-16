import { createSiteCreatePointTemplate } from './site-create.tpl';
import { createElement } from '../../utils/render';

export default class SiteCreatePointView {
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
    return createSiteCreatePointTemplate(this.#event);
  }

  removeElement() {
    this.#element = null;
  }
}
