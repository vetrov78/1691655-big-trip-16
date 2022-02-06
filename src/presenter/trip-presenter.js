import { FilterType, SortType, UpdateType, UserAction } from '../consts';
import { RenderPosition, render, remove } from '../utils/render';
import { sortFinishTimeUp, sortStartTimeDown, sortTimeDown } from '../utils/utils';
import { filter } from '../utils/filter';

import PointsListView from '../view/points-list/points-list-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter, {State as PointPresenterViewState} from './point-presenter';
import SiteNoPointView from '../view/site-no-point/site-no-point-view';
import PointNewPresenter from './point-new-presenter';
import SiteLoadingView from '../view/site-loading/site-loading-view';
import SiteTripInfoView from '../view/site-trip-info/site-trip-info-view';
import dayjs from 'dayjs';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #filtersModel = null;

  #tripInfoComponent = null;
  #sortComponent = null;
  #noPointsComponent = null;
  #pointsListComponent = new PointsListView();
  #loadingComponent = new SiteLoadingView();

  #offers = null;
  #destinations = null;

  #pointPresenter = new Map();
  #pointNewPresenter = null;

  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;

  constructor(tripContainer, pointsModel, filtersModel) {
    this.#tripContainer = tripContainer;

    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.points.sort(sortStartTimeDown);
    this.init();
  }

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
    render(this.#tripContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);

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
    this.#pointNewPresenter.init(callback);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
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
    this.#pointNewPresenter.destroy();

    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#tripInfoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
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
    this.#noPointsComponent = new SiteNoPointView(this.#filterType);
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

  #renderLoading = () => {
    render(this.#tripContainer, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #getTripInfo = () => {
    const tripInfo = {
      cities: '',
    };
    const points = this.#pointsModel.points;

    const firstPoint = points.sort(sortStartTimeDown)[0];
    const lastPoint = points.sort(sortFinishTimeUp)[0];

    // Города
    const destinationNames = [...new Set(points.map((item) => item.destination.name))];

    const destinationsNumber = destinationNames.length;

    if (destinationsNumber > 3) {
      tripInfo.cities = `${firstPoint.destination.name} - ... - ${lastPoint.destination.name}`;
    } else {
      for (let i = destinationsNumber; i > 0; i--) {
        tripInfo.cities = `${tripInfo.cities} ${destinationNames[i - 1]} -`;
      }
      tripInfo.cities = tripInfo.cities.slice(0, -2);
    }

    // Даты
    tripInfo.dates = `${dayjs(firstPoint.dateFrom).format('MMM D')} - ${dayjs(lastPoint.dateTo).format('MMM D')}`;

    // Стоимость
    const basePriceTotal = points.map((item) => item.basePrice).reduce((a, b) => a + b);

    const PointsOffers = points.map((item) => item.offers);
    const getPointOffersTotal = (previousTotal, currentOffer) => previousTotal + currentOffer.price;
    const getOffersTotal = (previousTotal, currentPointOffers) => previousTotal + currentPointOffers.reduce(getPointOffersTotal, 0);
    const offersPriceTotal = PointsOffers.reduce(getOffersTotal, 0);

    tripInfo.totalPrice = basePriceTotal + offersPriceTotal;

    return tripInfo;
  }

  #renderTripInfo = () => {
    const tripMainContainer = document.querySelector('.trip-main');
    this.#tripInfoComponent = new SiteTripInfoView(this.#getTripInfo());

    render(tripMainContainer, this.#tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    // Добавляет блок с общей информацией о маршруте
    if (this.#pointsModel.points.length > 0) {
      this.#renderTripInfo();
    }

    this.#destinations = this.#pointsModel.destinations;
    this.#offers = this.#pointsModel.offers;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointsListComponent, this.#handleViewAction, this.#offers, this.#destinations);

    const pointsLength = this.points.length;
    if (pointsLength === 0) {
      this.#renderNoPoints(this.#filterType);
      return;
    }
    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints(this.#offers, this.#destinations);
  }
}
