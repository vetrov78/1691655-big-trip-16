import SmartView from '../smart-view';
import { createNoPointsTemplate } from './site-no-points.tpl';

export default class SiteNoPointView extends SmartView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoPointsTemplate(this._data);
  }
}
