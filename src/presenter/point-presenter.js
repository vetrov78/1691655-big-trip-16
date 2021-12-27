import SitePointView from '../view/site-point/site-point-view';
import EditPointView from '../view/site-point-edit/site-point-edit-view';

import { isEscPressed } from '../utils/utils';
import { RenderPosition, render, replace } from '../utils/render';

const mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #point = null;

  #pointsListContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #mode = mode.DEFAULT;

  constructor(pointsListContainer) {
    this.#pointsListContainer = pointsListContainer;
  }

  init = (point) => {
    this.#point = point;

    this.#pointComponent = new SitePointView(point);
    this.#pointEditComponent = new EditPointView(point);

    this.#pointComponent.setOpenEditHandler(this.#handleOpenEditCLick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmitClick);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseEditClick);

    render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
  }

  #onEscKeyDownHandler = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.#replaceEditPointToPoint();
    }
  };

  #replacePointToEditPoint = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDownHandler);
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
  };

  #handleOpenEditCLick = () => {
    this.#replacePointToEditPoint();
  };

  #handleCloseEditClick = () => {
    this.#replaceEditPointToPoint();
  };

  #handleFormSubmitClick = () => {
    this.#replaceEditPointToPoint();
  };
}
