import AbstractView from '../abstract-view';
import { createSiteFiltersTemplate } from './site-filters.tpl';

export default class SiteFilterView extends AbstractView {
  get template() {
    return createSiteFiltersTemplate();
  }
}
