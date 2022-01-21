import { FilterType, SortType, UpdateType, UserAction } from '../const';
import { RenderPosition, render, remove } from '../utils/render';
import { sortStartTimeDown, sortTimeDown } from '../utils/utils';
import { filter } from '../utils/filter';

import PointsListView from '../view/site-list/site-list-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter from './point-presenter';
import SiteNoPointView from '../view/site-no-point/site-no-point-view';
import PointNewPresenter from './point-new-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filtersModel = null;

  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointsComponent = null;

  #pointTypes = null;
  #destinations = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;

  constructor(tripContainer, pointsModel, filtersModel, pointTypes, destinations) {
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointTypes = pointTypes;
    this.#destinations = destinations;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointsListComponent, this.#handleViewAction, this.#pointTypes, this.#destinations);

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

    this.#renderBoard();
  }

  destroy = () => {
    this.#clearBoard({resetSortType: true});

    remove(this.#pointsListComponent);

    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filtersModel.removeObserver(this.#handleModelEvent);
  }

  createPoint = (callback) => {
    this.#filtersModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
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
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#pointsListComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SiteSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderNoPoints = () => {
    this.#noPointsComponent = new SiteNoPointView(this.#filterType).element;
    render(this.#tripContainer, this.#noPointsComponent, RenderPosition.AFTERBEGIN);
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
    const pointsLength = this.points.length;

    if (pointsLength === 0) {
      this.#renderNoPoints(this.#filterType);
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints(this.#pointTypes, this.#destinations);
  }
}
