import { createSiteSortTemplate } from './site-sort.tpl';
import AbstractView from '../abstract-view';

export default class SiteSortView extends AbstractView {
  #sortType = null;

  constructor(sortType) {
    super();
    this.#sortType = sortType;
  }

  get template() {
    console.log(this.#sortType);
    return createSiteSortTemplate(this.#sortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (!evt.target.id.includes('sort')) {
      return;
    }
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
