export const createTripInfoTemplate = (tripInfo) => (
  `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfo.cities}</h1>

      <p class="trip-info__dates">${tripInfo.dates}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripInfo.totalPrice}</span>
    </p>
  </section>`
);
