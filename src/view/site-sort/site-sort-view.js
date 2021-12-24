import { createSiteSortTemplate } from './site-sort.tpl';

import AbstractView from '../abstract-view';

export default class SiteSortView extends AbstractView {
  get template() {
    return createSiteSortTemplate();
  }
}
