import {PointController} from "./point.js";
import {TripDays} from '../components/trip-days.js';
import {TripDaysSort} from '../components/trip-days-sort.js';
import {Sort} from '../components/sorting.js';
import {NotPoints} from '../components/no-points.js';
import {renderElement, removeNode} from '../utils.js';
import {dates} from '../data.js';

export class TripController {
  constructor(container, points) {
    this._container = container;
    this._points = points;
    this._tripDays = new TripDays(dates);
    this._tripDaysSort = new TripDaysSort();
    this._sort = new Sort();
    this._notPoints = new NotPoints();
  }

  init() {
    if (this._points.length === 0) {
      renderElement(this._container, this._notPoints.getElement());
      return;
    }

    renderElement(this._container.querySelector(`h2`), this._sort.getElement(), `afterend`);
    renderElement(this._container, this._tripDays.getElement());

    this._renderPoints(this._tripDays.getElement(), this._points);

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  _renderPoint(item, element) {
    const pointController = new PointController(item, element);
    pointController.init();
  }

  _renderPoints(container, elements) {
    if (container.children.length === 1) {
      return elements.forEach((element) => this.renderSort(element));
    } else {
      return elements.forEach((element) => this.renderSortDefault(element));
    }
  }

  renderSortDefault(element) {
    const tripDaysItems = this._container.querySelectorAll(`.trip-days__item`);

    tripDaysItems.forEach((item) => {
      const dateItem = item.querySelector(`time`).getAttribute(`datetime`);
      const datePoint = new Date(element.time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`});

      if (dateItem === datePoint) {
        this._renderPoint(item, element);
      }
    });
  }

  renderSort(element) {
    this._renderPoint(this._tripDaysSort.getElement(), element);
  }

  _sortClickHandler(evt) {
    if (evt.target.localName !== `label`) {
      return;
    }

    removeNode(this._tripDays.getElement());
    this._tripDays.removeElement();
    removeNode(this._tripDaysSort.getElement());
    this._tripDaysSort.removeElement();

    switch (evt.target.dataset.sortType) {
      case `time`:
        const sortedTimeCards = this._points.slice().sort((a, b) => a.time.hour - b.time.hour);
        renderElement(this._container, this._tripDaysSort.getElement());
        this._renderPoints(this._tripDaysSort.getElement(), sortedTimeCards);
        break;
      case `price`:
        const sortedPriceCards = this._points.slice().sort((a, b) => a.price - b.price);
        renderElement(this._container, this._tripDaysSort.getElement());
        this._renderPoints(this._tripDaysSort.getElement(), sortedPriceCards);
        break;
      case `default`:
        renderElement(this._container, this._tripDays.getElement());
        this._renderPoints(this._tripDays.getElement(), this._points);
        break;
    }
  }
}
