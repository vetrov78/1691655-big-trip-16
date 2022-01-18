import { FilterType } from '../../const';

const noPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PAST]: 'There are no past events now',
};

export const createNoPointsTemplate = (filterType) => {
  const noPointTextValue = noPointsTextType[filterType];

  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
};
