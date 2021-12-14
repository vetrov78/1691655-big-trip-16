import { ALL_TYPES_OFFERS } from '../const';

export const siteCreatePointTemplate = (event) => {

  const createPhotosTemplate = () => {
    let result = '';
    for (const photo of event['photos']) {
      result += `<img class="event__photo" src="${photo}" alt="Event photo">`;
    }

    return result;
  };

  const createEventTypeList = () => {
    let result = '';
    for (const offer of ALL_TYPES_OFFERS) {
      const typeInLowerCase = offer.type.toLowerCase();
      result += `<div class="event__type-item">
      <input id="event-type-${typeInLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeInLowerCase}">
      <label class="event__type-label  event__type-label--${typeInLowerCase}" for="event-type-${typeInLowerCase}-1">${offer.type}</label>
    </div>`;
    }

    return result;
  };

  const createAvailableOffers = () => {
    let result = '';
    for (const type of event.pointType.offers) {
      console.log(type);
      result += `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${type.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">30</span>
      </label>
    </div>`;
    }

    return result;
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${event['pointType']['type']}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${createEventTypeList()}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${event['pointType']['type']}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${event['destination']}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

            ${createAvailableOffers()}


          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${event['description']}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${createPhotosTemplate()}
            </div>
          </div>
        </section>
      </section>
    </form>
  </li>`;
};
