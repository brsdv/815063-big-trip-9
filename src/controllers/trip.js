import {PointListController} from './point-list.js';
import {TripDays} from '../components/trip-days.js';
import {TripDaysSort} from '../components/trip-days-sort.js';
import {Sort} from '../components/sorting.js';
import {Filter} from '../components/filter.js';
import {NotPoints} from '../components/no-points.js';
import {renderElement, removeNode, isLength, isElementCount, parseSortedDate, Position, SortType, FilterMenu} from '../utils.js';
import moment from 'moment';

export class TripController {
  constructor(container, filterNames, dataChangeHandler) {
    this._container = container;
    this._dataChangeMainHandler = dataChangeHandler;
    this._points = [];
    this._sortPoints = [];
    this._filterPoints = [];

    this._tripDays = null;
    this._tripDaysSort = new TripDaysSort();
    this._sort = new Sort();
    this._filter = new Filter(filterNames);
    this._notPoints = new NotPoints();
    this._pointListController = new PointListController(this._container, this._dataChangeHandler.bind(this));

    this._init();
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show(elements) {
    if (elements !== this._points) {
      this._tripDays = new TripDays(parseSortedDate(elements));
      renderElement(this._container, this._tripDays.getElement());

      this._points = elements;
      this._setPoints(elements);
    }

    this._container.classList.remove(`visually-hidden`);
  }

  createPoint() {
    if (!this._container.querySelector(`.trip-days`)) {
      removeNode(this._notPoints.getElement());
      this._notPoints.removeElement();
      this._sort.getElement().classList.remove(`visually-hidden`);
      renderElement(this._container, this._tripDays.getElement());
    }

    this._pointListController.createPoint();
  }

  _init() {
    renderElement(document.querySelector(`.trip-controls`), this._filter.getElement());
    renderElement(this._container.querySelector(`h2`), this._sort.getElement(), Position.AFTEREND);

    this._filter.getElement().addEventListener(`change`, () => this._filterClickHandler());
    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  _removeTripElements() {
    removeNode(this._tripDays.getElement());
    this._tripDays.removeElement();
    removeNode(this._tripDaysSort.getElement());
    this._tripDaysSort.removeElement();
  }

  _renderContainerDays(item, elements) {
    console.log(`test`, elements);
    if (elements.length === 0) {
      this._removeTripElements();
      this._sort.getElement().classList.add(`visually-hidden`);
      renderElement(this._container, this._notPoints.getElement());
      return;
    } else if (!item) {
      this._tripDays = new TripDays(parseSortedDate(elements));
      renderElement(this._container, this._tripDays.getElement());
    } else if (isLength(item) && isElementCount(item)) {
      this._removeTripElements();
      item = this._tripDaysSort.getElement();
      renderElement(this._container, item);
    } else {
      this._removeTripElements();
      const dates = parseSortedDate(elements);
      this._tripDays = new TripDays(dates);
      item = this._tripDays.getElement();
      renderElement(this._container, item);
    }

    this._pointListController.setPoints(item, elements);
  }

  _setPoints(elements) {
    this._renderContainerDays(this._container.querySelector(`.trip-days`), elements);
  }

  _dataChangeHandler(newData, oldData) {
    const index = this._points.findIndex((element) => element === oldData);

    if (newData === null) {
      this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];
    } else if (oldData === null) {
      this._creatingPoint = null;
      this._points = [newData, ...this._points];
    } else {
      this._creatingPoint = null;
      this._points[index] = newData;
    }

    const points = this.getFilteredPoints();
    this._dataChangeMainHandler(this._points);
    this._renderContainerDays(this._container.querySelector(`.trip-days`), points);
  }

  getFilteredPoints() {
    const currentFilterValue = Array.from(document.querySelectorAll(`.trip-filters__filter-input`)).find((input) => input.checked).value;

    const tripsFuture = this._points.filter((element) => moment(element.date).isAfter(new Date(Date.now())));
    const tripsPast = this._points.filter((element) => moment(element.date).isBefore(new Date(Date.now())));

    switch (currentFilterValue) {
      case FilterMenu.EVER:
        this._filterPoints = [...this._points];
        break;
      case FilterMenu.FUTURE:
        this._filterPoints = tripsFuture;
        break;
      case FilterMenu.PAST:
        this._filterPoints = tripsPast;
        break;
    }

    return this._filterPoints;
  }

  _filterClickHandler() {
    const points = this.getFilteredPoints();

    this._renderContainerDays(this._container.querySelector(`.trip-days`), points);
  }

  _sortClickHandler(evt) {
    if (evt.target.localName !== `label`) {
      return;
    }

    this._removeTripElements();

    switch (evt.target.dataset.sortType) {
      case SortType.TIME:
        this._sortPoints = [...this._points].sort((a, b) => a.date - b.date);
        this._renderContainerDays(this._tripDaysSort.getElement(), this._sortPoints);
        break;
      case SortType.PRICE:
        this._sortPoints = this._points.slice().sort((a, b) => a.price - b.price);
        this._renderContainerDays(this._tripDaysSort.getElement(), this._sortPoints);
        break;
      case SortType.DEFAULT:
        this._sortPoints = this._points.slice();
        this._renderContainerDays(this._tripDays.getElement(), this._sortPoints);
        break;
    }
  }
}
