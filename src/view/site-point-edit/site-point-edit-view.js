import SmartView from '../smart-view';
import { createEditPointTemplate } from './site-point-edit.tpl';
import flatpickr from 'flatpickr';
import { checkDatesOrder } from '../../utils/utils';

import 'flatpickr/dist/flatpickr.min.css';

export default class EditPointView extends SmartView {
  #startDatepicker = null;
  #endDatepicker = null;

  #pointTypes = null;
  #destinations = null;

  constructor (point, pointTypes, destinations) {
    super();
    this._data = EditPointView.parsePointToData(point);
    this.#pointTypes = pointTypes;
    this.#destinations = destinations;

    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  get template() {
    return createEditPointTemplate(this._data, this.#pointTypes, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }
    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  }

  reset = (point) => {
    this.updateData(
      EditPointView.parsePointToData(point),
    );
  }


  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormDeleteClickHandler(this._callback.deleteClick);
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('.event__type-input').forEach((input) => {
      input.addEventListener('click', this.#chooseTypeHandler);
    });
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#chooseDestinationHandler);
    this.element.querySelectorAll('.event__offer-checkbox').forEach((input) => {
      input.addEventListener('change', this.#changeOfferHandler);
    });
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
      evt.target.setCustomValidity('');
    } else {
      evt.target.setCustomValidity('Выберите пункт назначения из списка');
    }

    evt.target.reportValidity();
  }

  #changeOfferHandler = (evt) => {
    evt.preventDefault();

    console.log(point.offers);

  };

  #setStartDatepicker = () => {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onClose: this.#startDatepickerCloseHandler,
      },
    );
  }

  #startDatepickerCloseHandler = (selectedDates) => {
    if (checkDatesOrder(selectedDates, this.#endDatepicker.selectedDates)) {
      this.updateData({
        dateFrom: selectedDates,
      });
      return;
    }
    this.#startDatepicker.setDate(this._data.dateFrom);
    //alert ('Дата начала должна быть меньше даты окончания');
  }

  #setEndDatepicker = () => {
    this.#endDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onClose: this.#endDatepickerCloseHandler,
      },
    );
  }

  #endDatepickerCloseHandler = (selectedDates) => {
    if (checkDatesOrder(this.#startDatepicker.selectedDates, selectedDates)) {
      this.updateData({
        dateTo: selectedDates,
      });
      return;
    }
    this.#endDatepicker.setDate(this._data.dateTo);
    //alert ('Дата окончания должна быть больше даты начала');
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

  setFormDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('form').addEventListener('reset', this.#deleteHandler);
  };

  #deleteHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditPointView.parseDataToPoint(this._data));
  };

  static parsePointToData = (point) => ({
    ...point,
  })

  static parseDataToPoint = (data) => ({
    ...data,
  })
}
