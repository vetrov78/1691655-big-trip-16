import SitePointView from '../view/site-point/site-point-view';
import EditPointView from '../view/site-point-edit/site-point-edit-view';

import { isEscPressed, isDatesEqualInMinutes } from '../utils/utils';
import { RenderPosition, render, replace, remove } from '../utils/render';
import { UpdateType, UserAction } from '../consts';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #point = null;
  #pointTypes = null;
  #destinations = null;

  #pointsListContainer = null;
  #changeData = null;
  #changeMode = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #mode = Mode.DEFAULT;

  constructor(point, pointsListContainer, changeData, changeMode, pointTypes, destinations) {
    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
    this.#changeMode = changeMode;
    this.#pointTypes = pointTypes;
    this.#destinations = destinations;

    this.init(point);
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditComponent = this.#pointEditComponent;

    this.#pointComponent = new SitePointView(this.#point);
    this.#pointEditComponent = new EditPointView(this.#pointTypes, this.#destinations, this.#point);

    this.#pointComponent.setOpenEditHandler(this.#handleOpenEditCLick);
    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmitClick);
    this.#pointEditComponent.setCloseClickHandler(this.#handleCloseEditClick);
    this.#pointEditComponent.setFormDeleteClickHandler(this.#handleFormDeleteClick);

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#pointsListContainer, this.#pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceEditPointToPoint();
    }
  }

  #onEscKeyDownHandler = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditPointToPoint();
    }
  };

  #replacePointToEditPoint = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#onEscKeyDownHandler);
    this.#changeMode();
    this.#mode = Mode.EDITING;
  };

  #replaceEditPointToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#onEscKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #handleOpenEditCLick = () => {
    this.#replacePointToEditPoint();
  };

  #handleCloseEditClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditPointToPoint();
  };

  #handleFavoriteClick = () => {
    this.#changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite},
    );
  };

  #handleFormSubmitClick = (update) => {
    const isAnyDateChanged = !(isDatesEqualInMinutes(update.dateTo, this.#point.dateTo) && isDatesEqualInMinutes(update.dateFrom, this.#point.dateFrom));
    const isPriceChanged = (this.#point.price === update.price);

    this.#changeData(
      UserAction.UPDATE_POINT,
      (isAnyDateChanged || isPriceChanged) ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );

    this.#replaceEditPointToPoint();
  };

  #handleFormDeleteClick = (point) => {
    this.#changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point
    );
  };
}
