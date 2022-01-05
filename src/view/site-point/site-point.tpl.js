import { getDurationString } from '../../utils/utils';
import dayjs from 'dayjs';

const createOffersList = (offers) => {
  let result = '';
  for (const offer of offers) {
    result += `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`;
  }

  return result;
};

export const createSitePointTemplate = (point) => {

  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, isFavorite: isFavorite, offers, type} = point;
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'm');

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dayjs(dateFrom)}">${dayjs(dateFrom).format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dayjs(dateFrom)}">${dayjs(dateFrom).format('hh:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dayjs(dateTo)}">${dayjs(dateTo).format('hh:mm')}</time>
        </p>
        <p class="event__duration">${getDurationString(durationInMinutes)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">

        ${createOffersList(offers)}

      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export const createEmptyTemplate = () => (
  '<p class="trip-events__msg">Click New Event to create your first point</p>'
);
