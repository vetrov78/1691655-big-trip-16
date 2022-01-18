import { createSiteSortTemplate } from './site-sort.tpl';

import AbstractView from '../abstract-view';

export default class SiteSortView extends AbstractView {
  get template() {
    return createSiteSortTemplate();
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
