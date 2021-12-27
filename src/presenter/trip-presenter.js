import { RenderPosition, render } from '../utils/render';
import SiteEmptyView from '../view/site-empty/site-empty-view';
import PointsListView from '../view/site-list/site-list-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import PointPresenter from './point-presenter';

export default class TripPresenter {
  #tripContainer = null;
  #sortComponent = new SiteSortView();
  #invitationComponent = new SiteEmptyView();
  #pointsListComponent = new PointsListView();

  #tripEvents = [];

  constructor(tripContainer) {
    this.#tripContainer = tripContainer;
  }

  init = (tripEvents) => {
    this.#tripEvents = [...tripEvents];

    this.#renderSort();
    this.#renderBoard();
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
    this.#tripEvents.forEach(
      (point) => {
        const pointPresenter = new PointPresenter(this.#pointsListComponent);
        pointPresenter.init(point);
      }
    );
  }

  #renderBoard = () => {
    if (this.#tripEvents.length === 0) {
      this.#renderInvitation();
      return;
    }

    this.#renderPointsList();
    this.#renderPoints();
  }
}
