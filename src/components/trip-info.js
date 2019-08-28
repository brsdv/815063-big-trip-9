import {AbstractComponent} from "./abstract-component.js";

export class TripInfo extends AbstractComponent {
  constructor(totalCards, townsTrip, datesTrip) {
    super();
    this._totalCards = totalCards;
    this._townsTrip = townsTrip;
    this._datesTrip = datesTrip;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this._townsTrip.length > 3 ? `${this._townsTrip[0]} &mdash; ... &mdash; ${this._townsTrip[this._townsTrip.length - 1]}` : `${this._townsTrip[0]} &mdash; ${this._townsTrip[1]} ${this._townsTrip[2] ? `&mdash; ${this._townsTrip[2]}` : ``}`}</h1>
    
    <p class="trip-info__dates">AUG ${new Date(this._datesTrip[0]).getDate()}&nbsp;&mdash;&nbsp;${new Date(this._datesTrip[this._datesTrip.length - 1]).getDate()}</p>
    </div>
    <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._totalCards.map((element) => element.price).reduce((sum, current) => sum + current)}</span>
    </p>`.trim();
  }
}
