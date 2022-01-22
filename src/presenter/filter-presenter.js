import { FilterType, UpdateType } from '../const';
import { render, replace, remove, RenderPosition} from '../utils/render';
import SiteFilterView from '../view/site-filters/site-filters-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.init();
  }

  init = () => {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new SiteFilterView(this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  destroy = () => {
    remove(this.#filterComponent);
    this.#filterComponent = null;

    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#pointsModel.removeObserver(this.#handleModelEvent);

    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MINOR, filterType);
  };
}
