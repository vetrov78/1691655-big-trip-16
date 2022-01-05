import { SortType } from '../const';
import { RenderPosition, render } from '../utils/render';
import { sortStartTimeDown, sortTimeDown, updateItem } from '../utils/utils';
import PointsListView from '../view/site-list/site-list-view';
import SitePointView from '../view/site-point/site-point-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #sortComponent = new SiteSortView();
  #pointsListComponent = new PointsListView();

  #tripPoints = [];
  #pointPresenter = new Map();
  #currentSortType = SortType.DEFAULT;
  // Для сохранения начального порядка сортировки
  #sourcedTripPoints = [];

  constructor(tripContainer, points) {
    this.#tripContainer = tripContainer;
    points.forEach ((point) => {
      point.isFavorite = point.is_favorite;
    });

    points.sort(sortStartTimeDown);
    this.#tripPoints = [...points];
    this.#sourcedTripPoints =  [...points];
    this.init();
  }

  init = () => {
    this.#renderSort();
    this.#renderBoard();
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#sourcedTripPoints = updateItem(this.#sourcedTripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.PRICE_DOWN:
        this.#tripPoints.sort((a, b) => b.base_price - a.base_price);
        break;
      case SortType.TIME_DOWN:
        this.#tripPoints.sort(sortTimeDown);
        break;
      default:
        this.#tripPoints =[...this.#sourcedTripPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointsList();
    this.#renderPoints();
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoints = () => {
    if (this.#tripPoints.length === 0) {
      render(this.#pointsListComponent, new SitePointView(this.#tripPoints), RenderPosition.BEFOREEND);
      return;
    }
    this.#tripPoints.forEach(
      (point) => {
        const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#handlePointChange, this.#handleModeChange);
        pointPresenter.init(point);
        this.#pointPresenter.set(point.id, pointPresenter);
      }
    );
  }

  #renderBoard = () => {
    this.#renderPointsList();
    this.#renderPoints();
  }
}