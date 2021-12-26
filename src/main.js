import { getRandomString, isEscPressed } from './utils/utils';

import SiteMenuView from './view/site-menu/site-menu-view';
import SiteFilterView from './view/site-filters/site-filters-view';
import SiteSortView from './view/site-sort/site-sort-view';
import PointsListView from './view/site-list/site-list-view';
import SitePointView from './view/site-points/site-point-view';
import EditPointView from './view/site-edit/site-edit-view';

import { render, RenderPosition } from './utils/render';
import SiteEmptyView from './view/site-empty/site-empty-view';
import BoardPresenter from './presenter/board-presenter';

const controlsNavigation = document.querySelector('.trip-controls__navigation');
const controlsFilters = document.querySelector('.trip-controls__filters');
const mainSort = document.querySelector('.trip-events');

const boardPresenter = new BoardPresenter(mainSort);

// ДОБАВЛЕНИЕ НАВИГАЦИИ И ФИЛЬТРА
render(controlsNavigation, new SiteMenuView(), RenderPosition.BEFOREEND);
render(controlsFilters, new SiteFilterView(), RenderPosition.BEFOREEND);

const renderPoints = (points) => {
  const pointsListComponent = new PointsListView();
  renderElement(mainSort, pointsListComponent.element, RenderPosition.BEFOREEND);

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

      pointComponent.setOpenEditHandler (() => {
        replacePointToEditPoint();
        document.addEventListener('keydown', onEscKeyDown);
      });

      pointEditComponent.setCloseClickHandler (() => {
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      });

      pointEditComponent.setFormSubmitHandler(() => {
        replaceEditPointToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      });

      renderElement(pointsListComponent.element, pointComponent.element, RenderPosition.BEFOREEND);
    }
  );
};

const renderBoard = (points) => {
  if (points.length > 0) {
    renderPoints(points);
  }
  else {
    // Приглашение добавить новую точку
    const invitationComponent = new SiteEmptyView();
    renderElement(mainSort, invitationComponent.element, RenderPosition.BEFOREEND);
  }
};

const url = 'https://16.ecmascript.pages.academy/big-trip/points';
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Basic ${getRandomString()}`,
  },
};
fetch(url, fetchOptions)
  .then((response) => response.json())
  .then((points) => boardPresenter.init(points));
