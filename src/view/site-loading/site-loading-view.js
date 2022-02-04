import AbstractView from '../abstract-view';

export default class SiteLoadingView extends AbstractView {
  get template() {
    return '<p class="trip-events__msg">Loading...</p>';
  }
}
