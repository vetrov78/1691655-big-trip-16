import { createElement } from '../../utils/render';
import { createSiteFiltersTemplate } from './site-filters.tpl';

export default class SiteFilterView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteFiltersTemplate();
  }

  removeELement() {
    this.#element = null;
  }
}
