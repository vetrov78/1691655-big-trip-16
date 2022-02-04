import AbstractView from '../abstract-view';
import { createPointListTemplate } from './points-list.tpl';

export default class PointsListView extends AbstractView {
  get template() {
    return createPointListTemplate();
  }
}
