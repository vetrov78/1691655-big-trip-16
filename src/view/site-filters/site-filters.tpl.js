import { FilterType } from '../../const';

const createFilterItemTemplate = (filterType, currentFilter) => (
  `<div class="trip-filters__filter">
      <input
        id="filter-${filterType}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter"
        value="${filterType}"
        ${filterType === currentFilter ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterType}">
        ${filterType}</label>
  </div>`
);


export const createSiteFiltersTemplate = (currentFilter) => {
  let filterItems = '';
  Object.values(FilterType).forEach((item) => {
    filterItems += createFilterItemTemplate(item, currentFilter);
  });

  return `<form class="trip-filters" action="#" method="get">
            ${filterItems}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};
