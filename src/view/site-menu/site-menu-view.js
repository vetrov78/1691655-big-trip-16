import AbstractView from '../abstract-view.js';
import { createSiteMenuTemplate } from './site-menu.tpl.js';

export default class SiteMenuView extends AbstractView {
  get template() {
    return createSiteMenuTemplate();
  }
}
