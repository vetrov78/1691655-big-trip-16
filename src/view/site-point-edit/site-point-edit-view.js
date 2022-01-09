import AbstractView from '../abstract-view';
import { createEditPointTemplate } from './site-point-edit.tpl';

export default class EditPointView extends AbstractView {

  #pointTypes = null;
  #destinations = null;

  constructor (point, pointTypes, destinations) {
    super();
    this._data = EditPointView.parsePointToData(point);
    this.#pointTypes = pointTypes;
    this.#destinations = destinations;

    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointTemplate(this._data, this.#pointTypes, this.#destinations);
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

    this.#restoreHandlers();
  }

  #restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('click', this.#chooseTypeHandler);
    });
    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#chooseDestinationHandler);
  }

  #chooseTypeHandler = (evt) => {
    evt.preventDefault();

    const chosenType = this.#pointTypes.find((el) => el.type === evt.target.value);
    this.updateData({
      type: chosenType.type,
      offers: chosenType.offers,
    });
  }

  #chooseDestinationHandler = (evt) => {
    evt.preventDefault();

    const newDestination = this.#destinations.find((el) => el.name === evt.target.value);
    if (newDestination) {
      this.updateData ({
        destination: newDestination,
      });
    } else {
      this.updateData ({
        destination: {name: evt.target.value, description: ''},
      });
    }
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
