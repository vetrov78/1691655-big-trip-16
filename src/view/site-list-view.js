import { createElement } from '../utils/render';

const createPointListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>`
);

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
