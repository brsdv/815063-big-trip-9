import {TripDays} from '../components/trip-days.js';
import {TripDaysSort} from '../components/trip-days-sort.js';
import {Sort} from '../components/sorting.js';
import {Point} from '../components/point.js';
import {PointEdit} from '../components/point-edit.js';
import {NotPoints} from '../components/no-points.js';
import {renderElement, removeNode, isEscButton} from '../utils.js';
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

    this._renderPoints(this._points, this._tripDays.getElement());

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  _renderPoint(element, item) {
    const cardComponent = new Point(element);
    const cardEditComponent = new PointEdit(element);
    const cardElement = cardComponent.getElement();
    const cardEditElement = cardEditComponent.getElement();
    const tripListElement = item.querySelector(`.trip-events__list`);

    const escKeyDownHandler = (evt) => {
      if (isEscButton(evt)) {
        tripListElement.replaceChild(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    const replaceElementHandler = (evt) => {
      switch (evt.type) {
        case `click`:
          tripListElement.replaceChild(cardEditElement, cardElement);
          document.addEventListener(`keydown`, escKeyDownHandler);
          break;
        case `submit`:
          tripListElement.replaceChild(cardElement, cardEditElement);
          document.removeEventListener(`keydown`, escKeyDownHandler);
          break;
      }
    };

    renderElement(tripListElement, cardElement);

    cardElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, replaceElementHandler);
    cardEditElement.querySelector(`form`).addEventListener(`submit`, replaceElementHandler);
  }

  renderSortDefault(element) {
    const tripDaysItems = this._container.querySelectorAll(`.trip-days__item`);

    tripDaysItems.forEach((item) => {
      const dateItem = item.querySelector(`time`).getAttribute(`datetime`);
      const datePoint = new Date(element.time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`});

      if (dateItem === datePoint) {
        this._renderPoint(element, item);
      }
    });
  }

  renderSort(element) {
    this._renderPoint(element, this._tripDaysSort.getElement());
  }

  _renderPoints(elements, container) {
    if (container.children.length === 1) {
      return elements.forEach((element) => this.renderSort(element));
    } else {
      return elements.forEach((element) => this.renderSortDefault(element));
    }
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
        this._renderPoints(sortedTimeCards, this._tripDaysSort.getElement());
        break;
      case `price`:
        const sortedPriceCards = this._points.slice().sort((a, b) => a.price - b.price);
        renderElement(this._container, this._tripDaysSort.getElement());
        this._renderPoints(sortedPriceCards, this._tripDaysSort.getElement());
        break;
      case `default`:
        renderElement(this._container, this._tripDays.getElement());
        this._renderPoints(this._points, this._tripDays.getElement());
        break;
    }
  }
}
