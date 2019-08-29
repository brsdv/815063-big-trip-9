import {AbstractComponent} from "./abstract-component.js";

export class TotalPrice extends AbstractComponent {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cards.map((element) => element.price).reduce((sum, current) => sum + current)}</span>
    </p>`.trim();
  }
}
