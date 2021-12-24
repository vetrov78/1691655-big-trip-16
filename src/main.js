import { getRandomString, isEscPressed } from './utils/utils';

import SiteMenuView from './view/site-menu/site-menu-view';
import SiteFilterView from './view/site-filters/site-filters-view';
import SiteSortView from './view/site-sort/site-sort-view';
import PointsListView from './view/site-list/site-list-view';
import SitePointView from './view/site-points/site-point-view';
import EditPointView from './view/site-edit/site-edit-view';

import { renderElement, RenderPosition } from './utils/render';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

// ДОБАВЛЕНИЕ НАВИГАЦИИ И ФИЛЬТРА
renderElement(controlsNavigation, new SiteMenuView().element, RenderPosition.BEFOREEND);
renderElement(controlsFilters, new SiteFilterView().element, RenderPosition.BEFOREEND);
renderElement(mainSort, new SiteSortView().element, RenderPosition.BEFOREEND);

const pointsListComponent = new PointsListView();
renderElement(mainSort, pointsListComponent.element, RenderPosition.BEFOREEND);

// GET THE DATA
const url = 'https://16.ecmascript.pages.academy/big-trip/points';
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${getRandomString()}`,
  },
};
const renderPoints = (points) => {
  // console.log(points);

  points.forEach(
    (event) => {
      const pointComponent = new SitePointView(event);
      const pointEditComponent = new EditPointView(event);

      const replacePointToEditPoint = () => {
        pointsListComponent.element.replaceChild(pointEditComponent.element, pointComponent.element);
      };

      const replaceEditPointToPoint = () => {
        pointsListComponent.element.replaceChild(pointComponent.element, pointEditComponent.element);
      };

      const onEscKeyDown = (evt) => {
        if (isEscPressed(evt)) {
          evt.preventDefault();
          replaceEditPointToPoint();
          document.removeEventListener('keydown', onEscKeyDown);
        }
      };

      pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        replacePointToEditPoint();
        document.addEventListener('keydown', onEscKeyDown);
      });

      pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      });

      pointEditComponent.element.querySelector('form').addEventListener('submit', (evt) => {
        evt.preventDefault();
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      });

      renderElement(pointsListComponent.element, pointComponent.element, RenderPosition.BEFOREEND);
    }
  );
};

fetch(url, fetchOptions)
  .then((response) => response.json())
  .then((points) => renderPoints(points));

