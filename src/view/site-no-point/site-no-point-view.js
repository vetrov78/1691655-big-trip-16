import AbstractView from '../abstract-view';
import { createNoPointsTemplate } from './site-no-points.tpl';

export default class SiteNoPointView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoPointsTemplate(this._data);
  }
}
