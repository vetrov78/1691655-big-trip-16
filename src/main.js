import { getRandomString } from './utils/utils';

import SiteMenuView from './view/site-menu/site-menu-view';
import SiteFilterView from './view/site-filters/site-filters-view';

import { render, RenderPosition } from './utils/render';
import TripPresenter from './presenter/trip-presenter';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

// ДОБАВЛЕНИЕ НАВИГАЦИИ И ФИЛЬТРА
render(controlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
render(controlsFilters, new SiteFilterView(), RenderPosition.BEFOREEND);

const url = 'https://16.ecmascript.pages.academy/big-trip/points';
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${getRandomString()}`,
  },
};
fetch(url, fetchOptions)
  .then((response) => response.json())
  .then((points) => {
    new TripPresenter(mainSort, points);
  });
