import PointController from './point.js';
import TripDays from '../components/trip-days.js';
import TripDaysSort from '../components/trip-days-sort.js';
import Sort from '../components/sorting.js';
import Filter from '../components/filter.js';
import NotPoints from '../components/no-points.js';
import {renderElement, removeNode, shortDate, parseSortedDate, Mode, Position, SortType, FilterMenu} from '../utils.js';
import moment from 'moment';

class TripController {
  constructor(container, filterNames, points, dataChangeHandler, destinations, offers) {
    this._container = container;
    this._points = points;
    this._dataChangeMainHandler = dataChangeHandler;
    this._destinations = destinations;
    this._offers = offers;

    this._tripDays = new TripDays(parseSortedDate(this._points));
    this._tripDaysSort = new TripDaysSort();
    this._sort = new Sort();
    this._filter = new Filter(filterNames);
    this._notPoints = new NotPoints();

    this._sortPoints = this._points;
    this._filterPoints = this._points;
    this._subscriptions = [];
    this._creatingPoint = null;
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
    this._init();
  }

  _init() {
    if (this._points.length === 0) {
      renderElement(this._container, this._notPoints.getElement());
      return;
    }

    renderElement(document.querySelector(`.trip-controls`), this._filter.getElement());
    renderElement(this._container.querySelector(`h2`), this._sort.getElement(), Position.AFTEREND);
    renderElement(this._container, this._tripDays.getElement());

    this._points.forEach((element) => this.renderPointsWithDays(this._tripDays.getElement(), element));

    this._filter.getElement().addEventListener(`change`, () => this._filterClickHandler());
    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show(elements) {
    if (elements !== this._points) {
      this._points = elements;
      const filteredPoints = this.getFilteredPoints();
      this._renderContainerDays(filteredPoints);
    }

    this._container.classList.remove(`visually-hidden`);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    if (!this._container.querySelector(`.trip-days`)) {
      removeNode(this._notPoints.getElement());
      this._notPoints.removeElement();
      this._sort.getElement().classList.remove(`visually-hidden`);
      renderElement(this._container, this._tripDays.getElement());
    }

    const defaultPoint = {
      dateFrom: Date.parse(moment()),
      dateTo: Date.parse(moment()),
      destination: {
        description: ``,
        name: ``,
        pictures: []
      },
      price: 0,
      isFavorite: false,
      type: ``,
      offers: []
    };

    this._creatingPoint = new PointController(this._container.querySelector(`.trip-days`), defaultPoint, Mode.ADDING, this._dataChangeHandler, this._changeViewHandler, this._destinations, this._offers);
  }

  _renderPoint(item, element) {
    const pointController = new PointController(item, element, Mode.DEFAULT, this._dataChangeHandler, this._changeViewHandler, this._destinations, this._offers);

    this._subscriptions.push(pointController.setDefaultView.bind(pointController));
  }

  checkedFilter() {
    return Array.from(this._filter.getElement().querySelectorAll(`.trip-filters__filter-input`)).find((input) => input.checked).value;
  }

  checkedSort() {
    return Array.from(this._sort.getElement().querySelectorAll(`.trip-sort__input`)).find((input) => input.checked).dataset.sortType;
  }

  removeTripElements() {
    removeNode(this._tripDays.getElement());
    this._tripDays.removeElement();
    removeNode(this._tripDaysSort.getElement());
    this._tripDaysSort.removeElement();
  }

  visuallySort(item) {
    if (item.classList.contains(`visually-hidden`)) {
      item.classList.remove(`visually-hidden`);
      removeNode(this._notPoints.getElement());
      this._notPoints.removeElement();
    }
  }

  renderPointsWithDays(container, element) {
    container.querySelectorAll(`.trip-days__item`).forEach((item) => {
      const dateItem = item.querySelector(`time`).getAttribute(`datetime`);
      const datePoint = `${shortDate(element.dateFrom)}`;

      if (dateItem === datePoint) {
        this._renderPoint(item, element);
      }
    });
  }

  _renderTripDaysSort(elements) {
    this.removeTripElements();
    renderElement(this._container, this._tripDaysSort.getElement());

    elements.forEach((element) => this._renderPoint(this._tripDaysSort.getElement(), element));
  }

  _renderTripDays(elements) {
    this.removeTripElements();
    this._tripDays = new TripDays(parseSortedDate(elements));
    renderElement(this._container, this._tripDays.getElement());

    elements.forEach((element) => this.renderPointsWithDays(this._tripDays.getElement(), element));
  }

  _renderContainerDays(elements) {
    if (elements.length === 0) {
      this.removeTripElements();
      this._sort.getElement().classList.add(`visually-hidden`);
      renderElement(this._container, this._notPoints.getElement());

      if (this.checkedFilter() === FilterMenu.FUTURE || this.checkedFilter() === FilterMenu.PAST) {
        this._notPoints.getElement().textContent = `Not Found Results`;
      }
      return;
    }

    this.visuallySort(this._sort.getElement());

    switch (this.checkedSort()) {
      case SortType.TIME:
        this._renderTripDaysSort(elements);
        break;
      case SortType.PRICE:
        this._renderTripDaysSort(elements);
        break;
      case SortType.DEFAULT:
        this._renderTripDays(elements);
        break;
    }
  }

  _changeViewHandler() {
    this._subscriptions.forEach((item) => item());
  }

  _dataChangeHandler(actionType, update, errorHandler) {
    this._creatingPoint = null;
    this._dataChangeMainHandler(actionType, update, errorHandler);
  }

  getFilteredPoints() {
    const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
    const tripsFuture = this._points.filter((element) => moment(element.dateFrom).isAfter());
    const tripsPast = this._points.filter((element) => moment(element.dateFrom).isBefore());

    switch (this.checkedFilter()) {
      case FilterMenu.EVER:
        newEventButton.disabled = false;
        this._filterPoints = [...this._points];
        break;
      case FilterMenu.FUTURE:
        newEventButton.disabled = true;
        this._filterPoints = tripsFuture;
        break;
      case FilterMenu.PAST:
        newEventButton.disabled = true;
        this._filterPoints = tripsPast;
        break;
    }

    return this._filterPoints;
  }

  _filterClickHandler() {
    const filteredPoints = this.getFilteredPoints();
    this._renderContainerDays(filteredPoints);
  }

  _sortClickHandler(evt) {
    if (evt.target.localName !== `input`) {
      return;
    }

    this.removeTripElements();

    switch (evt.target.dataset.sortType) {
      case SortType.TIME:
        this._sortPoints = [...this._filterPoints].sort((a, b) => (b.dateTo - b.dateFrom) - (a.dateTo - a.dateFrom));
        break;
      case SortType.PRICE:
        this._sortPoints = [...this._filterPoints].sort((a, b) => b.price - a.price);
        break;
      case SortType.DEFAULT:
        this._sortPoints = [...this._filterPoints];
        break;
    }

    this._renderContainerDays(this._sortPoints);
  }
}

export default TripController;
