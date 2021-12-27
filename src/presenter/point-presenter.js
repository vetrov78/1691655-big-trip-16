import SitePointView from '../view/site-point/site-point-view';
import EditPointView from '../view/site-point-edit/site-point-edit-view';

import { isEscPressed } from '../utils/utils';
import { RenderPosition, render, replace, remove } from '../utils/render';

const mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #point = null;

  #pointsListContainer = null;
  #changeData = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #mode = mode.DEFAULT;

  constructor(pointsListContainer, changeData) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#pointEditComponent;

    this.#pointComponent = new SitePointView(point);
    this.#pointEditComponent = new EditPointView(point);

    this.#pointComponent.setOpenEditHandler(this.#handleOpenEditCLick);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmitClick);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseEditClick);
    //Добавляет обработчик кликов на FAVORITE
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#pointsListContainer.element.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointsListContainer.element.contains(prevEditComponent.element)) {
      replace(this.#pointEditComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
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

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, is_favorite: !this.#point.is_favorite});
  };

  #handleCloseEditClick = () => {
    this.#replaceEditPointToPoint();
  };

  #handleFormSubmitClick = () => {
    this.#replaceEditPointToPoint();
  };
}
