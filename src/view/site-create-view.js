import { ALL_TYPES_OFFERS } from '../mock/event.js';
import { createElement } from '../render.js';
import dayjs from 'dayjs';

const createEventTypeList = () => {
  let result = '';

  ALL_TYPES_OFFERS.forEach((offer) => {
    const typeInLowerCase = offer.type.toLowerCase();
    result += `<div class="event__type-item">
                <input id="event-type-${typeInLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeInLowerCase}">
                <label class="event__type-label  event__type-label--${typeInLowerCase}" for="event-type-${typeInLowerCase}-1">${offer.type}</label>
              </div>`;
  });

  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${result}
            </fieldset>
          </div>`;
};

const createPhotosTemplate = (destination) => {
  let result = '';

  destination['pictures'].forEach(
    (photo) => (
      result += `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`
    )
  );

  return `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${result}
            </div>
          </div>`;
};

const createAvailableOffers = (offers) => {
  let result = '';

  offers.forEach((offer) => {
    const checked = (offer.checked) ? 'checked' : '';
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
    <label class="event__offer-label" for="event-offer-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
  });

  return `<div class="event__available-offers">
            ${result}
          </div>`;
};

const createSiteCreatePointTemplate = (event) => {

  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, offers, type} = event;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          ${createEventTypeList()}

        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination['name']}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY hh:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY hh:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          ${createAvailableOffers(offers)}

        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination['description']}</p>

          ${createPhotosTemplate(destination)}

        </section>
      </section>
    </form>
  </li>`;
};

export default class SiteCreatePointView {
  #element = null;
  #event = null;

  constructor (event = {}) {
    this.#event = event;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createSiteCreatePointTemplate(this.#event);
  }

  removeElement() {
    this.#element = null;
  }
}
