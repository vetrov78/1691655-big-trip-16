import { RenderPosition, render } from '../utils/render';
import { updateItem } from '../utils/utils';
import SiteEmptyView from '../view/site-empty/site-empty-view';
import PointsListView from '../view/site-list/site-list-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #sortComponent = new SiteSortView();
  #invitationComponent = new SiteEmptyView();
  #pointsListComponent = new PointsListView();

  #tripPoints = [];
  #pointPresenter = new Map();
  // Для сохранения начального порядка сортировки
  #sourcedTripPoints = [];

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripPoints) => {
    this.#tripPoints = [...tripPoints];
    this.#sourcedTripPoints = [...tripPoints];

    this.#renderSort();
    this.#renderBoard();
    console.log(tripPoints);
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  }

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderSort = () => {
    render(this.#tripContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderInvitation = () => {
    render(this.#tripContainer, this.#invitationComponent, RenderPosition.BEFOREEND);
  }

  #renderPointsList = () => {
    render(this.#tripContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoints = () => {
    this.#tripPoints.forEach(
      (point) => {
        const pointPresenter = new PointPresenter(this.#pointsListComponent, this.#handlePointChange, this.#handleModeChange);
        pointPresenter.init(point);
        this.#pointPresenter.set(point.id, pointPresenter);
      }
    );
  }

  #renderBoard = () => {
    if (this.#tripPoints.length === 0) {
      this.#renderInvitation();
      return;
    }

    this.#renderPointsList();
    this.#renderPoints();
  }
}
