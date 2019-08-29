import {AbstractComponent} from "./abstract-component.js";

export class TripInfo extends AbstractComponent {
  constructor(cards, towns, dates) {
    super();
    this._cards = cards;
    this._towns = towns;
    this._dates = dates;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._towns.length > 3 ? `${this._towns[0]} &mdash; ... &mdash; ${this._towns[this._towns.length - 1]}` : `${this._towns[0]} &mdash; ${this._towns[1]} ${this._towns[2] ? `&mdash; ${this._towns[2]}` : ``}`}</h1>
    <p class="trip-info__dates">${new Date(this._dates[0]).toLocaleString(`en`, {day: `numeric`, month: `short`})}&nbsp;&mdash;&nbsp;${new Date(this._dates[this._dates.length - 1]).getDate()}</p>
    </div>
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cards.map((element) => element.price).reduce((sum, current) => sum + current)}</span>
    </p>`.trim();
  }
}
