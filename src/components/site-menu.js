import {createElement} from '../utils.js';

export class Menu {
  constructor(menuNames) {
    this._menuNames = menuNames;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${this._menuNames.map((element) => `<a class="trip-tabs__btn ${element === `Table` ? `trip-tabs__btn--active` : ``}" href="#">${element}</a>`).join(``)}
    </nav>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
