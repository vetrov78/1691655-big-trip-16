import AbstractView from '../abstract-view';
import { createSitePointTemplate } from './site-point.tpl';

export default class SitePointView extends AbstractView {
  #event = null;

  constructor (event) {
    super();
    this.#event = event;
  }

  get template() {
    return createSitePointTemplate(this.#event);
  }

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openClick();
  }

  setOpenEditHandler = (callback) => {
    this._callback.openClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openClickHandler);
  }
}
