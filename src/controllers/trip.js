import {PointController} from "./point.js";
import {TripDays} from '../components/trip-days.js';
import {TripDaysSort} from '../components/trip-days-sort.js';
import {Sort} from '../components/sorting.js';
import {NotPoints} from '../components/no-points.js';
import {renderElement, removeNode, isLength, isElementCount, shortDate, parseSortedDate} from '../utils.js';

export class TripController {
  constructor(container, points) {
    this._container = container;
    this._points = points;
    this._sortPoints = points;
    this._dates = parseSortedDate(this._sortPoints);
    this._tripDays = new TripDays(this._dates);
    this._tripDaysSort = new TripDaysSort();
    this._sort = new Sort();
    this._notPoints = new NotPoints();
    this._subscriptions = [];
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
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
    const pointController = new PointController(item, element, this._dataChangeHandler, this._changeViewHandler);
    pointController.init();
    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  renderSortDefault(container, element) {
    const tripDaysItems = container.querySelectorAll(`.trip-days__item`);

    tripDaysItems.forEach((item) => {
      const dateItem = item.querySelector(`time`).getAttribute(`datetime`);
      const datePoint = `${shortDate(element.date)}`;

      if (dateItem === datePoint) {
        this._renderPoint(item, element);
      }
    });
  }

  renderSort(element) {
    this._renderPoint(this._tripDaysSort.getElement(), element);
  }

  _renderPoints(container, elements) {
    if (isLength(container) && isElementCount(container)) {
      return elements.forEach((element) => this.renderSort(element));
    } else {
      return elements.forEach((element) => this.renderSortDefault(container, element));
    }
  }

  _removeContainerDays() {
    removeNode(this._tripDays.getElement());
    this._tripDays.removeElement();
    removeNode(this._tripDaysSort.getElement());
    this._tripDaysSort.removeElement();
  }

  _renderContainerDays(container, elements) {
    if (isLength(container) && isElementCount(container)) {
      this._removeContainerDays();
      container = this._tripDaysSort.getElement();
      renderElement(this._container, container);
    } else {
      this._removeContainerDays();
      const dates = parseSortedDate(elements);
      this._tripDays = new TripDays(dates);
      container = this._tripDays.getElement();
      renderElement(this._container, container);
    }

    this._renderPoints(container, elements);
  }

  _changeViewHandler() {
    this._subscriptions.forEach((item) => item());
  }

  _dataChangeHandler(newData, oldData) {
    this._points[this._points.findIndex((element) => element === oldData)] = newData;
    this._sortPoints[this._sortPoints.findIndex((element) => element === oldData)] = newData;
    this._renderContainerDays(this._container.querySelector(`.trip-days`), this._sortPoints);
  }

  _sortClickHandler(evt) {
    if (evt.target.localName !== `label`) {
      return;
    }

    this._removeContainerDays();

    switch (evt.target.dataset.sortType) {
      case `time`:
        this._sortPoints = this._points.slice().sort((a, b) => a.date - b.date);
        renderElement(this._container, this._tripDaysSort.getElement());
        this._renderPoints(this._tripDaysSort.getElement(), this._sortPoints);
        break;
      case `price`:
        this._sortPoints = this._points.slice().sort((a, b) => a.price - b.price);
        renderElement(this._container, this._tripDaysSort.getElement());
        this._renderPoints(this._tripDaysSort.getElement(), this._sortPoints);
        break;
      case `default`:
        this._sortPoints = this._points.slice();
        renderElement(this._container, this._tripDays.getElement());
        this._renderPoints(this._tripDays.getElement(), this._sortPoints);
        break;
    }
  }
}
