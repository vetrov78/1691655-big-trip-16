import { FilterType } from '../../consts';

const createFilterItemTemplate = (filterType, filterStatus, currentFilter) => (
  `<div class="trip-filters__filter">
      <input
        id="filter-${filterType}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter"
        value="${filterType}"
        ${filterType === currentFilter ? 'checked' : ''}
        ${!filterStatus ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filterType}">
        ${filterType}</label>
  </div>`
);


export const createSiteFiltersTemplate = (currentFilter, filterStatus) => {
  let filterItems = '';

  Object.keys(FilterType).forEach(
    (key) => {
      filterItems += createFilterItemTemplate(FilterType[key], filterStatus[key], currentFilter);
    },
  );

  return `<form class="trip-filters" action="#" method="get">
            ${filterItems}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};
