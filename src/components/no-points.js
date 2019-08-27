import {createElement} from '../utils.js';

export class NotPoints {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`.trim();
  }

  getElement() {
    return createElement(this.getTemplate());
  }
}
