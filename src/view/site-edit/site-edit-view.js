
import AbstractView from '../abstract-view';
import { createEditPointTemplate } from './site-edit.tpl';

export default class EditPointView extends AbstractView {
  #event = null;

  constructor (event) {
    super();
    this.#event = event;
  }

  get template() {
    return createEditPointTemplate(this.#event);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  }
}
