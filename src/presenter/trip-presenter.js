import { SortType, UpdateType, UserAction } from '../const';
import { RenderPosition, render, remove } from '../utils/render';
import { getRandomString } from '../utils/utils';
import { sortStartTimeDown, sortTimeDown } from '../utils/utils';
import PointsListView from '../view/site-list/site-list-view';
import SitePointView from '../view/site-point/site-point-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #tripContainer = null;
  //Создаем модель данных
  #pointsModel = null;

  #sortComponent = null;
  #pointsListComponent = new PointsListView();
  #noPointsComponent = null; //new NoPointsView();

  #pointTypes = null;
  #destinations = null;

  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor(tripContainer, pointsModel) {
    this.#tripContainer = tripContainer;

    //инициализируем модель
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);

    this.#pointsModel.points.sort(sortStartTimeDown);
    this.init();
  }

  //возвращает отсортированный список точек
  get points() {
    switch (this.#currentSortType) {
      case SortType.PRICE_DOWN:
        return [...this.#pointsModel.points].sort((a, b) => b.basePrice - a.basePrice);
      case SortType.TIME_DOWN:
        return [...this.#pointsModel.points].sort(sortTimeDown);
    }
    return this.#pointsModel.points;
  }

  init = () => {
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

    console.log(updateType);

    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoints();
        this.#renderPoints(this.#pointTypes, this.#destinations);
        break;
      case UpdateType.MAJOR:
        // обновить весь презентер
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
