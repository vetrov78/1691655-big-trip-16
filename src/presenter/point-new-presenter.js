import { UpdateType, UserAction } from '../const';
import { remove, render, RenderPosition } from '../utils/render';
import { isEscPressed } from '../utils/utils';
import EditPointView from '../view/site-point-edit/site-point-edit-view';

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

    this.#pointEditComponent = new EditPointView(this.#pointTypes, this.#destinations);
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

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      {id: 'added_point', ...point},
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
