import {AbstractComponent} from "./abstract-component.js";

export class TotalPrice extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._points.length > 0 ? this._points.map((element) => element.price).reduce((sum, current) => sum + current) : `0`}</span>
    </p>`.trim();
  }
}
