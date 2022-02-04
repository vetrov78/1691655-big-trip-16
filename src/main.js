import { disableChildren, enableChildren, remove, render, RenderPosition } from './utils/render';
import { MenuItem } from './consts';

import SiteMenuView from './view/site-menu/site-menu-view';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import StatisticsView from './view/statistics/statistics-view';
import ApiService from './services/api-service';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');
const siteMenuComponent = new SiteMenuView();

const filterModel = new FilterModel();
const pointsModel = new PointsModel(new ApiService());

const filterPresenter = new FilterPresenter(controlsFilters, filterModel, pointsModel);
const tripPresenter = new TripPresenter(mainSort, pointsModel, filterModel);


// show menu
let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      remove(statisticsComponent);
      document.querySelector('.trip-main__event-add-btn').disabled = false;
      tripPresenter.init();
      filterPresenter.init();
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      filterPresenter.destroy();
      document.querySelector('.trip-main__event-add-btn').disabled = true;
      statisticsComponent = new StatisticsView(pointsModel.points);
      render(mainSort, statisticsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

pointsModel.init().finally(() => {
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  render(controlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);
});

const handleNewPointFormClose = () => {
  document.querySelector('.trip-main__event-add-btn').disabled = false;

  enableChildren(document.querySelector('.trip-main__trip-controls'));
  enableChildren(document.querySelector('.trip-events__trip-sort'));
};

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  evt.target.disabled = true;

  filterPresenter.destroy();
  filterPresenter.init();

  tripPresenter.destroy();
  tripPresenter.init();
  tripPresenter.createPoint(handleNewPointFormClose);

  disableChildren(document.querySelector('.trip-main__trip-controls'));
  const sortComponent = document.querySelector('.trip-events__trip-sort');
  if (sortComponent) {
    disableChildren(sortComponent);
  }
});
