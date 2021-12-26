import AbstractView from '../abstract-view';
import { createPointListTemplate } from './site-list.tpl';

export default class PointsListView extends AbstractView {
  get template() {
    return createPointListTemplate();
  }
}
