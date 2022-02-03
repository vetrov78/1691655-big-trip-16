import SmartView from '../smart-view';
import { createSitePointTemplate } from './site-point.tpl';

export default class SitePointView extends SmartView {
  #point = null;

  constructor (point) {
    super();
    this.#point = point;
  }

  get template() {
    return createSitePointTemplate(this.#point);
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
