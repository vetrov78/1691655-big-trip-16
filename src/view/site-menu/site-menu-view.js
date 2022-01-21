import AbstractView from '../abstract-view.js';
import { createSiteMenuTemplate } from './site-menu.tpl.js';

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler = (callback) => {
    this._callback.menuClick = callback;
    this.element.querySelectorAll('.trip-tabs__btn').forEach((element) => {
      element.addEventListener('click', this.#menuClickHandler);
    });
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains('trip-tabs__btn--active')) {
      this.element.querySelector('.trip-tabs__btn--active').classList.remove('trip-tabs__btn--active');
      evt.target.classList.add('trip-tabs__btn--active');
      this._callback.menuClick(evt.target.text);
    }

  }
}
