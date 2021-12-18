import { createElement } from '../render';

const createSitePointListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

export default class SitePointListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSitePointListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
