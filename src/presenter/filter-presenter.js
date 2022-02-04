import { FilterType, UpdateType } from '../consts';
import { render, replace, remove, RenderPosition} from '../utils/render';
import SiteFiltersView from '../view/site-filters/site-filters-view';
import { filter } from '../utils/filter';

const FiltersStatus = {
  EVERYTHING: true,
  FUTURE: true,
  PAST: true,
};

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;
  #filterStatus = null;

  constructor(filterContainer, filterModel, pointsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterStatus = FiltersStatus;

    this.init();
  }

  init = () => {

    const prevFilterComponent = this.#filterComponent;

    Object.keys(FiltersStatus).map(
      (key) => {
        this.#filterStatus[key] = filter[FilterType[key]](this.#pointsModel.points).length > 0;
      }
    );

    this.#filterComponent = new SiteFiltersView(this.#filterModel.filter, this.#filterStatus);
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
