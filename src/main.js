import { siteCreateMenuTemplate } from './view/site-menu-view';
import { siteCreateFiltersTemplate } from './view/site-filters-view';
import { siteCreateSortTemplate } from './view/site-sort-view';
import { siteCreatePointListTemplate } from './view/site-list-view';
import { siteEditPointTemplate } from './view/site-edit-view';
import { siteCreatePointTemplate } from './view/site-create-view';
import { sitePointTemplate } from './view/site-point-view';
import { renderTemplate, RenderPosition } from './render';


const ITEMS_COUNT = 3;

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

renderTemplate(controlsNavigation, siteCreateMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(controlsFilters, siteCreateFiltersTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainSort, siteCreateSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainSort, siteCreatePointListTemplate(), RenderPosition.BEFOREEND);

const itemsList = mainSort.querySelector('.trip-events__list');

renderTemplate(itemsList, siteEditPointTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(itemsList, siteCreatePointTemplate(), RenderPosition.BEFOREEND);

for (let i = 0; i < ITEMS_COUNT; i++) {
  renderTemplate(itemsList, sitePointTemplate(), RenderPosition.BEFOREEND);
}
