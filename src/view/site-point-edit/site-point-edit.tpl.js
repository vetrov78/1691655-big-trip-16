import dayjs from 'dayjs';

const createEventTypeList = (pointTypes) => {
  let result = '';

  pointTypes.forEach((element) => {
    result += `<div class="event__type-item">
                <input id="event-type-${element.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${element.type}">
                <label class="event__type-label  event__type-label--${element.type}" for="event-type-${element.type}-1">${element.type}</label>
              </div>`;
  });

  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${result}
            </fieldset>
          </div>`;
};

const createDestinationsList = (availableDestinations) => {
  let result = '';

  availableDestinations.forEach((destination) => {
    result += `<option value="${destination.name}"></option>`;
  });

  return `<datalist id="destination-list-1">
            ${result}
          </datalist>`;
};

const createOffers = (pointType, choosenOffers) => {
  let result = '';

  pointType.offers.forEach((offer) => {
    const isChecked = choosenOffers.some((element) => element.id === offer.id);

    const checked = isChecked ? 'checked' : '';
    result += `<div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${pointType.type}-${offer.id}" type="checkbox" name="event-offer-${pointType.type}" ${checked}>
    <label class="event__offer-label" for="event-offer-${pointType.type}-${offer.id}">
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

const createPhotosList = (pictures) => pictures
  .map((picture) => (`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`))
  .join('');

export const createEditPointTemplate = (data, pointTypes, destinations) => {
  const {basePrice, dateFrom, dateTo, destination, offers: choosenOffers, type} = data;
  const pointType = pointTypes.find((element) => element.type === type);

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  ${createEventTypeList(pointTypes)}

                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${type}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">

                  ${createDestinationsList(destinations)}

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
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                <section class="event__section  event__section--offers">
                  <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                  ${createOffers(pointType, choosenOffers)}

                </section>

                <section class="event__section  event__section--destination">
                  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                  <p class="event__destination-description">${destination['description']}</p>
                  <div class="event__photos-container">
                      <div class="event__photos-tape">

                        ${createPhotosList(destination.pictures)}

                      </div>
                    </div>
                </section>
              </section>
            </form>
          </li>`;
};
