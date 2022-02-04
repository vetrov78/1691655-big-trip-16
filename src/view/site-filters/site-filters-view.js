import AbstractView from '../abstract-view';
import { createSiteFiltersTemplate } from './site-filters.tpl';

export default class SiteFiltersView extends AbstractView {
  #currentFilter = null;
  #filterStatus = null

  constructor(currentFilter, filterStatus) {
    super();
    this.#currentFilter = currentFilter;
    this.#filterStatus = filterStatus;
  }

  get template() {
    return createSiteFiltersTemplate(this.#currentFilter, this.#filterStatus);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}
