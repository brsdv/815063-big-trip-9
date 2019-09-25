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
    if (elements.length === 0) {
      this._removeTripElements();
      this._sort.getElement().classList.add(`visually-hidden`);
      renderElement(this._container, this._notPoints.getElement());
      return;
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
    this._points = elements;

    this._renderContainerDays(this._container.querySelector(`.trip-days`), elements);
  }

  _dataChangeHandler(elements) {
    this._points = elements;

    this._dataChangeMainHandler(this._points);
    this._renderContainerDays(this._container.querySelector(`.trip-days`), elements);
  }

  _filterClickHandler() {
    this._filterPoints = this._points;
    const currentFilterValue = Array.from(document.querySelectorAll(`.trip-filters__filter-input`)).find((input) => input.checked).value;

    const tripsEverything = this._points;
    const tripsFuture = this._filterPoints.filter((element) => moment(element.date).isAfter(new Date(Date.now())));
    const tripsPast = this._filterPoints.filter((element) => moment(element.date).isBefore(new Date(Date.now())));

    switch (currentFilterValue) {
      case FilterMenu.EVER:
        this._filterPoints = tripsEverything;
        break;
      case FilterMenu.FUTURE:
        this._filterPoints = tripsFuture;
        break;
      case FilterMenu.PAST:
        this._filterPoints = tripsPast;
        break;
    }

    this._renderContainerDays(this._container.querySelector(`.trip-days`), this._filterPoints);
  }

  _sortClickHandler(evt) {
    if (evt.target.localName !== `label`) {
      return;
    }

    this._removeTripElements();

    switch (evt.target.dataset.sortType) {
      case SortType.TIME:
        this._sortPoints = this._points.slice().sort((a, b) => a.date - b.date);
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
