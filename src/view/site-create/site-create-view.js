import AbstractView from '../abstract-view';
import { createSiteCreatePointTemplate } from './site-create.tpl';

export default class SiteCreatePointView extends AbstractView {
  #event = null;

  constructor (event) {
    super();
    this.#event = event;
  }

  get template() {
    return createSiteCreatePointTemplate(this.#event);
  }
}
