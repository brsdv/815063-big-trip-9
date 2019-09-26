import {PointController} from './point.js';
import {TripDays} from '../components/trip-days.js';
import {TripDaysSort} from '../components/trip-days-sort.js';
import {Sort} from '../components/sorting.js';
import {Filter} from '../components/filter.js';
import {NotPoints} from '../components/no-points.js';
import {getRandomText} from '../data.js';
import {renderElement, removeNode, isLength, isElementCount, shortDate, parseSortedDate, Mode, Position, SortType, FilterMenu} from '../utils.js';
import moment from 'moment';

export class TripController {
  constructor(container, filterNames, points, dataChangeHandler) {
    this._container = container;
    this._points = points;
    this._dataChangeMainHandler = dataChangeHandler;

    this._tripDays = new TripDays(parseSortedDate(this._points));
    this._tripDaysSort = new TripDaysSort();
    this._sort = new Sort();
    this._filter = new Filter(filterNames);
    this._notPoints = new NotPoints();

    this._sortPoints = [];
    this._filterPoints = [];
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

    this._renderPoints(this._tripDays.getElement(), this._points);

    this._filter.getElement().addEventListener(`change`, () => this._filterClickHandler());
    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show(elements) {
    if (elements !== this._points) {
      this._tripDays = new TripDays(parseSortedDate(elements));
      renderElement(this._container, this._tripDays.getElement());

      this._points = elements;
      this._renderContainerDays(this._container.querySelector(`.trip-days`), elements);
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
      type: {
        type: `taxi`,
        img: `img/icons/taxi.png`,
        title: `Taxi to`,
        placeholder: `to`
      },
      town: ``,
      photos: new Array(3).fill(``).map(() => `http://picsum.photos/300/150?r=${Math.random()}`),
      discription: getRandomText(Math.ceil(Math.random() * 3)),
      date: Date.parse(`${shortDate(Date.now())} 10:00`),
      price: 10,
      offers: []
    };

    this._creatingPoint = new PointController(this._container.querySelector(`.trip-days`), defaultPoint, Mode.ADDING, this._dataChangeHandler, this._changeViewHandler);
  }

  _renderPoint(item, element) {
    const pointController = new PointController(item, element, Mode.DEFAULT, this._dataChangeHandler, this._changeViewHandler);

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

    this._renderPoints(item, elements);
  }

  _changeViewHandler() {
    this._subscriptions.forEach((item) => item());
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
        this._sortPoints = this._points.slice().sort((a, b) => a.date - b.date);
        this._renderContainerDays(this._tripDaysSort.getElement(), this._sortPoints);
        break;
      case SortType.PRICE:
        this._sortPoints = this._points.slice().sort((a, b) => a.price - b.price);
        this._renderContainerDays(this._tripDaysSort.getElement(), this._sortPoints);
        break;
      case SortType.DEFAULT:
        this._sortPoints = this._points.slice(); // копировать можно так [...this._points]
        this._renderContainerDays(this._tripDays.getElement(), this._sortPoints);
        break;
    }
  }
}
