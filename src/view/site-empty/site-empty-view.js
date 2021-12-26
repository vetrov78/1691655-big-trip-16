import AbstractView from '../abstract-view';
import { createEmptyTemplate } from './site-empty.tpl';

export default class SiteEmptyView extends AbstractView {
  get template() {
    return createEmptyTemplate();
  }
}
