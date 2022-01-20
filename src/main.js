import { getRandomString } from './utils/utils';

import SiteMenuView from './view/site-menu/site-menu-view';

import { render, RenderPosition } from './utils/render';
import TripPresenter from './presenter/trip-presenter';
import camelcaseKeys from 'camelcase-keys';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

render(controlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);

const pointsUrl = 'https://16.ecmascript.pages.academy/big-trip/points';
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${getRandomString()}`,
  },
};

fetch(pointsUrl, fetchOptions)
  .then((response) => response.json())
  .then((points) => {
    const filterModel = new FilterModel();
    const pointsModel = new PointsModel();
    pointsModel.points = camelcaseKeys(points);

    new FilterPresenter(controlsFilters, filterModel, pointsModel);

    // Убрать в отдельный модуль
    const offersUrl = 'https://16.ecmascript.pages.academy/big-trip/offers';
    const destinationsUrl = 'https://16.ecmascript.pages.academy/big-trip/destinations';

    Promise
      .all([
        fetch(offersUrl, fetchOptions),
        fetch(destinationsUrl, fetchOptions)
      ])
      .then(
        (response) => Promise.all(response.map((e) => e.json()))
      )
      .then(
        ([pointTypes, destinations]) => {
          const tripPresenter = new TripPresenter(mainSort, pointsModel, filterModel, pointTypes, destinations);
          document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
            evt.preventDefault();
            tripPresenter.createPoint();
          });
        }
      );
  });


