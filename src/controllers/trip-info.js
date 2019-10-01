import {TripInfo} from '../components/trip-info.js';
import {TotalPrice} from '../components/total-price.js';
import {renderElement, removeNode, Position} from '../utils.js';

export class TripInfoController {
  constructor(tripInfo, totalPrice) {
    this._tripInfoElement = document.querySelector(`.trip-main__trip-info`);
    this._tripInfo = tripInfo;
    this._totalPrice = totalPrice;
  }

  updateHeader(points) {
    const towns = Array.from(new Set(points.map((element) => element.town)));
    const dates = Array.from(new Set(points.map((element) => element.date))).sort();

    this.removeHeader();

    this._tripInfo = new TripInfo(towns, dates);
    this._totalPrice = new TotalPrice(points);

    renderElement(this._tripInfoElement, this._tripInfo.getElement(), Position.AFTERBEGIN);
    renderElement(this._tripInfoElement, this._totalPrice.getElement());
  }

  removeHeader() {
    removeNode(this._tripInfo.getElement());
    this._tripInfo.removeElement();
    removeNode(this._totalPrice.getElement());
    this._totalPrice.removeElement();
  }
}
