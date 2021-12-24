import { createElement } from '../../utils/render.js';
import { createSiteMenuTemplate } from './site-menu.tpl.js';

export default class SiteMenuView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteMenuTemplate();
  }

  removeElement() {
    this.element = null;
  }
}
