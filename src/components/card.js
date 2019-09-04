import {AbstractComponent} from "./abstract-component.js";

export class Point extends AbstractComponent {
  constructor({types, town, time, price, offers}) {
    super();
    this._types = types;
    this._town = town;
    this._time = time;
    this._price = price;
    this._offers = offers;
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${this._types.map((element) => element.img)}" alt="Event type icon">
      </div>
      <h3 class="event__title">${this._types.map((element) => element.title)} ${this._town}</h3>
    
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${new Date(this._time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`})}">${this._time.hour}:${this._time.minute}</time>
          &mdash;
          <time class="event__end-time" datetime="${new Date(this._time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`})}">${this._time.hour + 1}:${this._time.minute}</time>
        </p>
        <p class="event__duration">${(this._time.hour + 1) - this._time.hour}H</p>
      </div>
    
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>
    
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${this._offers.map((element) => (this._offers.length > 0) ? `<li class="event__offer">
        <span class="event__offer-title">${element.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${element.price}</span>
       </li>` : ``).join(``)}
      </ul>
    
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>`.trim();
  }
}
