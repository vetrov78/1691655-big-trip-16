import AbstractView from '../abstract-view';
import { createSitePointTemplate, createEmptyTemplate } from './site-point.tpl';

export default class SitePointView extends AbstractView {
  #point = null;

  constructor (point) {
    super();
    this.#point = point;
  }

  get template() {
    if (this.#point.length !== 0) {
      return createSitePointTemplate(this.#point);
    } else {
      return createEmptyTemplate();
    }
  }

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openClick();
  }

  setOpenEditHandler = (callback) => {
    this._callback.openClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openClickHandler);
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }
}
