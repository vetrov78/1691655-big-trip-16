import { SortType } from '../const';
import { RenderPosition, render } from '../utils/render';
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

  #sortComponent = new SiteSortView();
  #pointsListComponent = new PointsListView();

  #tripPoints = [];
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
    console.log(actionType, updateType, update);
    //
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPoints(this.#pointTypes, this.#destinations);
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoints = (pointTypes, destinations) => {
    if (this.#pointsModel.points.length === 0) {
      render(this.#pointsListComponent, new SitePointView(this.#tripPoints), RenderPosition.BEFOREEND);
      return;
    }
    this.points.forEach(
      (point) => {
        const pointPresenter = new PointPresenter(point, this.#pointsListComponent, this.#handleViewAction, this.#handleModeChange, pointTypes, destinations);
        this.#pointPresenter.set(point.id, pointPresenter);
      }
    );
  }

  #renderBoard = () => {
    this.#renderPointsList();

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
        this.#pointTypes = pointTypes;
        this.#destinations = destinations;
        this.#renderPoints(pointTypes, destinations);
      });
  }
}
