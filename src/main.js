import { disableChildren, enableChildren, remove, render, RenderPosition } from './utils/render';
import { MenuItem } from './const';

import SiteMenuView from './view/site-menu/site-menu-view';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import StatisticsView from './view/site-statistics/site-statistics-view';
import ApiService from './api-service';

const END_POINT = 'https://16.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');
const siteMenuComponent = new SiteMenuView();

const offersUrl = 'https://16.ecmascript.pages.academy/big-trip/offers';
const destinationsUrl = 'https://16.ecmascript.pages.academy/big-trip/destinations';
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': 'Basic fcf324571e',
  },
};

Promise
  .all([
    fetch(offersUrl, fetchOptions),
    fetch(destinationsUrl, fetchOptions)
  ])
  .then((response) => Promise.all(response.map((e) => e.json())))
  .then(([pointTypes, destinations]) => {
    // points = camelcaseKeys(points);
    // points = points.map((point) => ({
    //   ...point,
    //   duration: dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'm'),
    // }));

    const filterModel = new FilterModel();
    const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));

    const tripPresenter = new TripPresenter(mainSort, pointsModel, filterModel, pointTypes, destinations);
    const filterPresenter = new FilterPresenter(controlsFilters, filterModel, pointsModel);

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
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(controlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);

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
      disableChildren(document.querySelector('.trip-events__trip-sort'));
    });
  });


