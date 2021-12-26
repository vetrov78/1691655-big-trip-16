import { RenderPosition, render, replace } from '../utils/render';
import { isEscPressed } from '../utils/utils';
import SiteEmptyView from '../view/site-empty/site-empty-view';
import PointsListView from '../view/site-list/site-list-view';
import SiteSortView from '../view/site-sort/site-sort-view';
import SitePointView from '../view/site-points/site-point-view';
import EditPointView from '../view/site-edit/site-edit-view';

export default class BoardPresenter {
  #boardContainer = null;
  #sortComponent = new SiteSortView();
  #invitationComponent = new SiteEmptyView();
  #pointsListComponent = new PointsListView();

  #boardEvents = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardEvents) => {
    this.#boardEvents = [...boardEvents];

    this.#renderSort();
    this.#renderBoard();
  }

  #renderSort = () => {
    render(this.#boardContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderInvitation = () => {
    render(this.#boardContainer, this.#invitationComponent, RenderPosition.BEFOREEND);
  }

  #renderPointsList = () => {
    render(this.#boardContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #renderPoints = () => {
    this.#boardEvents.forEach(
      (event) => {
        const pointComponent = new SitePointView(event);
        const pointEditComponent = new EditPointView(event);

        const replacePointToEditPoint = () => {
          replace(pointEditComponent, pointComponent);
        };

        const replaceEditPointToPoint = () => {
          replace(pointComponent, pointEditComponent);
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

        render(this.#pointsListComponent, pointComponent, RenderPosition.BEFOREEND);
      }
    );
  }

  #renderBoard = () => {
    if (this.#boardEvents.length === 0) {
      this.#renderInvitation();
      return;
    }

    this.#renderPointsList();
    this.#renderPoints();
  }
}
