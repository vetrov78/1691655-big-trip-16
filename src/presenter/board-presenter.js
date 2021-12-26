import { render, RenderPosition } from '../utils/render';
import SiteSortView from '../view/site-sort/site-sort-view';

export default class BoardPresenter {
  #boardContainer = null;
  #boardComponent = new SiteSortView();

  #boardEvents = [];

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardEvents) => {
    this.#boardEvents = [...boardEvents];

    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND );
  }
}
