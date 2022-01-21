import camelcaseKeys from 'camelcase-keys';
import { getRandomString } from './utils/utils';
import { disableChildren, enableChildren, render, RenderPosition } from './utils/render';
import { MenuItem } from './const';

import SiteMenuView from './view/site-menu/site-menu-view';
import TripPresenter from './presenter/trip-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';


const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

const pointsUrl = 'https://16.ecmascript.pages.academy/big-trip/points';
const offersUrl = 'https://16.ecmascript.pages.academy/big-trip/offers';
const destinationsUrl = 'https://16.ecmascript.pages.academy/big-trip/destinations';
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${getRandomString()}`,
  },
};

Promise
  .all([
    fetch(pointsUrl, fetchOptions),
    fetch(offersUrl, fetchOptions),
    fetch(destinationsUrl, fetchOptions)
  ])
  .then((response) => Promise.all(response.map((e) => e.json())))
  .then(([points, pointTypes, destinations]) => {

    // show menu

    const siteMenuComponent = new SiteMenuView();
    const handleSiteMenuClick = (menuItem) => {
      switch (menuItem) {
        case MenuItem.TABLE:

          break;
        case MenuItem.STATS:
          break;
      }
    };
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

    render(controlsNavigation, siteMenuComponent, RenderPosition.BEFOREEND);

    const filterModel = new FilterModel();
    const pointsModel = new PointsModel();
    pointsModel.points = camelcaseKeys(points);

    new FilterPresenter(controlsFilters, filterModel, pointsModel);

    const tripPresenter = new TripPresenter(mainSort, pointsModel, filterModel, pointTypes, destinations);

    const handleNewPointFormClose = () => {
      document.querySelector('.trip-main__event-add-btn').disabled = false;

      enableChildren(document.querySelector('.trip-main__trip-controls'));
      enableChildren(document.querySelector('.trip-events__trip-sort'));
    };

    document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.target.disabled = true;

      tripPresenter.createPoint(handleNewPointFormClose);

      disableChildren(document.querySelector('.trip-main__trip-controls'));
      disableChildren(document.querySelector('.trip-events__trip-sort'));
    });
  });


