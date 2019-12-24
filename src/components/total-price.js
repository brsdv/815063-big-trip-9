import AbstractComponent from "./abstract-component.js";

class TotalPrice extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return `<p class="trip-info__cost">
      Total: &euro;&nbsp;
      <span class="trip-info__cost-value">
        ${this._points.length > 0 ? this._getFullPrice(this._points) : `0`}
      </span>
    </p>`.trim();
  }

  _getFullPrice(points) {
    return points.map((item) => {
      let offersPrice = 0;

      if (item.offers.length > 0) {
        offersPrice = item.offers
          .map((it) => it.accepted ? it.price : 0)
          .reduce((sum, current) => sum + current);
      }

      return item.price + offersPrice;
    }).reduce((sum, current) => sum + current);
  }
}

export default TotalPrice;
