import { siteCreateMenuTemplate } from './view/site-menu-view';
import { siteCreateFiltersTemplate } from './view/site-filters-view';
import { siteCreateSortTemplate } from './view/site-sort-view';
import { siteCreatePointListTemplate } from './view/site-list-view';
import { siteCreatePointTemplate } from './view/site-create-view';
import { sitePointTemplate } from './view/site-point-view';
import { renderTemplate, RenderPosition } from './render';
import { generateEvent, relationNameDescription } from './mock/event';

const POINTS__COUNT = 12;

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

// ДОБАВЛЕНИЕ НАВИГАЦИИ И ФИЛЬТРА
renderTemplate(controlsNavigation, siteCreateMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(controlsFilters, siteCreateFiltersTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainSort, siteCreateSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainSort, siteCreatePointListTemplate(), RenderPosition.BEFOREEND);

const itemsList = mainSort.querySelector('.trip-events__list');

let events = Array.from({length: POINTS__COUNT}, generateEvent);
// FUNCTION FROM STACKOVERFLOW.. MERGED TWO ARRAYS BY KEY
const mergeArrays = (arr1, arr2) => (arr1.map((x) => Object.assign(x, arr2.find((y) => y.destination === x.destination))));
events = mergeArrays(events, relationNameDescription());

renderTemplate(itemsList, siteCreatePointTemplate(events[0]), RenderPosition.BEFOREEND);

for (let i = 1; i < POINTS__COUNT; i++) {
  renderTemplate(itemsList, sitePointTemplate(events[i]), RenderPosition.BEFOREEND);
}
