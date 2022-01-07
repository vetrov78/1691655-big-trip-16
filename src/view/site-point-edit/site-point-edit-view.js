import AbstractView from '../abstract-view';
import { createEditPointTemplate } from './site-point-edit.tpl';

export default class EditPointView extends AbstractView {

  constructor (point) {
    super();
    this._data = EditPointView.parsePointToData(point);
  }

  get template() {
    return createEditPointTemplate(this._data);
  }


  updateData = (update) => {
    if (!update) {
      return;
    }

    this._data = {...this._data, ...update};
    this.updateElement();
  }

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
  }

  setChooseTypeHandler = (callback) => {
    this._callback.chooseType = callback;
    this.element.querySelectorAll('.event__type-input').forEach((type) => {
      type.addEventListener('click', this.#chooseTypeHandler);
    });
  }

  #chooseTypeHandler = (evt) => {
    evt.preventDefault();
    this._callback.chooseType(evt.target.id);
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  }

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#submitHandler);
  }

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditPointView.parseDataToPoint(this._data));
  }

  static parsePointToData = (point) => ({
    ...point,
  })

  static parseDataToPoint = (data) => ({
    ...data,
  })
}
