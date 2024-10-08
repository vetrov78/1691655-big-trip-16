import _ from 'lodash';
import SmartView from '../smart-view';
import { createEditPointTemplate } from './edit-point.tpl';
import flatpickr from 'flatpickr';
import { checkDatesOrder } from '../../utils/utils';

import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs().add(1, 'day'),
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

export default class EditPointView extends SmartView {
  #chosenType = null;
  #startDatepicker = null;
  #endDatepicker = null;

  #pointTypes = null;
  #destinations = null;

  #isNewPoint = false;

  constructor (pointTypes, destinations, isNewPoint = false, point = BLANK_POINT) {
    super();

    this.#chosenType = pointTypes.find((el) => el.type === point.type);
    this.#pointTypes = pointTypes;
    this.#destinations = destinations;
    this.#isNewPoint = isNewPoint;

    if (!point.destination) {
      point.destination = this.#destinations[0].id;
      // point.destination.description = this.#destinations[0].description;
      // point.destination.pictures = this.#destinations[0].pictures;
    }

    this._data = EditPointView.parsePointToData(point);

    this.#setInnerHandlers();
    this.#setStartDatepicker();
    this.#setEndDatepicker();
  }

  get template() {
    return createEditPointTemplate(this._data, this.#pointTypes, this.#destinations, this.#isNewPoint);
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
    this.element.querySelector('.event__input--price').setAttribute('type', 'number');
    this.element.querySelector('.event__input--price').addEventListener('change', this.#changePriceHandler);
  }

  #changePriceHandler = (evt) => {
    evt.preventDefault();

    this.updateData({
      basePrice: Number(evt.target.value),
    });
  }

  #chooseTypeHandler = (evt) => {
    evt.preventDefault();

    this.#chosenType = this.#pointTypes.find((el) => el.type === evt.target.value);
    this.updateData({
      type: this.#chosenType.type,
      offers: [],
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
      evt.target.value = this._data.destination.name;
    }

    evt.target.reportValidity();
  }

  #changeOfferHandler = (evt) => {
    evt.preventDefault();

    const changedOfferId = Number(evt.target.id.slice(-1));
    const changedOffer = this.#chosenType.offers.find((offer) => offer.id === changedOfferId);
    if (evt.target.checked) {
      this._data.offers.push(changedOffer);
    } else {
      this._data.offers = this._data.offers.filter((offer) => offer.id !== changedOfferId);
    }
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

    if (this.#isNewPoint) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#closeClickHandler);
    } else {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    }
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

  static parsePointToData = (point) => {
    const clonedPoint = _.cloneDeep(point);

    return {
      ...clonedPoint,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseDataToPoint = (data) => {
    const point = {...data,};

    delete point.isDeleting;
    delete point.isSaving;
    delete point.isDisabled;

    return point;
  }
}
