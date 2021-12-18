import { getRandomString } from './utils';

import SiteMenuView from './view/site-menu-view';
import SiteFilterView from './view/site-filters-view';
import SiteSortView from './view/site-sort-view';
import SitePointListView from './view/site-list-view';

import { siteCreatePointTemplate } from './view/site-create-view';
import { sitePointTemplate } from './view/site-point-view';
import { renderTemplate, RenderPosition, renderElement } from './render';
import { generateEvent, relationNameDescription } from './mock/event';

// const POINTS_COUNT = 12;

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

// ДОБАВЛЕНИЕ НАВИГАЦИИ И ФИЛЬТРА
renderElement(controlsNavigation, new SiteMenuView().element, RenderPosition.BEFOREEND);
renderElement(controlsFilters, new SiteFilterView().element, RenderPosition.BEFOREEND);
renderElement(mainSort, new SiteSortView().element, RenderPosition.BEFOREEND);
renderElement(mainSort, new SitePointListView().element, RenderPosition.BEFOREEND);

const itemsList = mainSort.querySelector('.trip-events__list');

// GET THE DATA
const url = 'https://16.ecmascript.pages.academy/big-trip/';
const pointsUrl = `${url}points`;
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${getRandomString()}`,
  },
};
const cb = (events) => {
  console.log(events);

  renderTemplate(itemsList, siteCreatePointTemplate(events[0]), RenderPosition.BEFOREEND);
  for (let i = 1; i < events.length; i++) {
    renderTemplate(itemsList, sitePointTemplate(events[i]), RenderPosition.BEFOREEND);
  }
};

fetch(pointsUrl, fetchOptions)
  .then((response) => response.json())
  .then((events) => cb(events));

