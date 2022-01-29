import AbstractView from '../abstract-view';
import { createTripInfoTemplate } from './site-trip-info.tpl';

export default class SiteTripInfoView extends AbstractView {
  #info = null;

  constructor (info) {
    super();
    this.#info = info;
  }

  get template() {
    return createTripInfoTemplate(this.#info);
  }
}
