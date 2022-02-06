import { UpdateType, UserAction } from '../consts';
import { remove, render, RenderPosition } from '../utils/render';
import { isEscPressed } from '../utils/utils';
import EditPointView from '../view/edit-point/edit-point-view';

export default class PointNewPresenter {
  #pointTypes = null;
  #destinations = null;

  #pointsListContainer = null;
  #changeData = null;
  #pointEditComponent = null;

  #destroyCallback = null;

  constructor(pointsListContainer, changeData, pointTypes, destinations) {
    this.#pointTypes = pointTypes;
    this.#destinations = destinations;

    this.#pointsListContainer = pointsListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new EditPointView(this.#pointTypes, this.#destinations, true);
    this.#pointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#pointEditComponent.setCloseClickHandler(this.#handleDeleteClick);

    render(this.#pointsListContainer, this.#pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy = () => {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting = () => {
    const resetFormState = () => {
      this.#pointEditComponent.updateData ({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  #handleDeleteClick = () => {
    this.destroy();
  }

  #escKeyDownHandler = (evt) => {
    if (isEscPressed(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
