import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { RenderPosition, render, remove } from '../utils/render';
import { getRandomString } from '../utils/utils';
import { sortStartTimeDown, sortTimeDown } from '../utils/utils';
import { filter } from '../utils/filter';

import PointsListView from '../view/site-list/site-list-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filtersModel = null;

  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointsComponent = null; //new NoPointsView();

  #pointTypes = null;
  #destinations = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  constructor(tripContainer, pointsModel, filtersModel) {
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#pointsModel.points.sort(sortStartTimeDown);
    this.init();
  }

  //возвращает отсортированный список точек
  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.PRICE_DOWN:
        return filteredPoints.sort((a, b) => b.basePrice - a.basePrice);
      case SortType.TIME_DOWN:
        return filteredPoints.sort(sortTimeDown);
    }
    return filteredPoints.sort(sortStartTimeDown);
  }

  init = () => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);

    this.#renderSort();
    this.#renderBoard();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderPoints(this.#pointTypes, this.#destinations);
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #clearPoints = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SiteSortView();
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripContainer, this.#sortComponent, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints = () => {
    render(this.#pointsListComponent, this.#noPointsComponent, RenderPosition.AFTERBEGIN);
  };

  #renderPoints = (pointTypes, destinations) => {
    this.points.forEach(
      (point) => {
        const pointPresenter = new PointPresenter(point, this.#pointsListComponent, this.#handleViewAction, this.#handleModeChange, pointTypes, destinations);
        this.#pointPresenter.set(point.id, pointPresenter);
      }
    );
  }

  #renderBoard = () => {
    this.#renderPointsList();

    // Убрать в отдельный модуль
    const offersUrl = 'https://16.ecmascript.pages.academy/big-trip/offers';
    const destinationsUrl = 'https://16.ecmascript.pages.academy/big-trip/destinations';
    const fetchOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${getRandomString()}`,
      },
    };
    Promise.all([
      fetch(offersUrl, fetchOptions),
      fetch(destinationsUrl, fetchOptions)
    ]).then((response) => Promise.all(response.map((e) => e.json())))
      .then(([pointTypes, destinations]) => {
      //**************

        const pointsLength = this.points.length;
        if (pointsLength === 0) {
          this.#renderNoPoints();
          return;
        }

        this.#pointTypes = pointTypes;
        this.#destinations = destinations;
        this.#renderPoints(pointTypes, destinations);
      });
  }
}
