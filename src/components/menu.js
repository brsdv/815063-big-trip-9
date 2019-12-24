import AbstractComponent from "./abstract-component.js";

class Menu extends AbstractComponent {
  constructor(names) {
    super();
    this._names = names;
  }

  getTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${this._names.map((element) => `<a class="trip-tabs__btn ${element === `Table` ? `trip-tabs__btn--active` : ``}" href="#">${element}</a>`).join(``)}
    </nav>`.trim();
  }
}

export default Menu;
