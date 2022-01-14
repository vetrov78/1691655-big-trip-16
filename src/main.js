import { getRandomString } from './utils/utils';

import SiteMenuView from './view/site-menu/site-menu-view';
import SiteFilterView from './view/site-filters/site-filters-view';

import { render, RenderPosition } from './utils/render';
import TripPresenter from './presenter/trip-presenter';
import camelcaseKeys from 'camelcase-keys';
import PointsModel from './model/points-model';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

// ДОБАВЛЕНИЕ НАВИГАЦИИ И ФИЛЬТРА
render(controlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
render(controlsFilters, new SiteFilterView(), RenderPosition.BEFOREEND);


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
    const pointsModel = new PointsModel();
    pointsModel.points = camelcaseKeys(points);
    new TripPresenter(mainSort, pointsModel);
  });

