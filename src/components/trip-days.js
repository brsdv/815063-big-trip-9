import {AbstractComponent} from "./abstract-component.js";

export class TripDays extends AbstractComponent {
  constructor(dates) {
    super();
    this._dates = dates;
  }

  getTemplate() {
    return `<ul class="trip-days">
    ${this._dates.map((element, index) => `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${index + 1}</span>
        <time class="day__date" datetime="${new Date(element).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`})}">${new Date(element).toLocaleString(`en`, {day: `numeric`, month: `short`})}</time>
      </div>
    
      <ul class="trip-events__list">
      <!-- Cобытия -->
      </ul>
      </li>`).join(``)}
    </ul>`.trim();
  }
}
