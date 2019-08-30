import {TripDays} from '../components/trip-days.js';
import {Sort} from '../components/sorting.js';
import {Card} from '../components/card.js';
import {CardEdit} from '../components/card-edit.js';
import {NotPoints} from '../components/no-points.js';
import {renderElement, removeNode, isEscButton} from '../utils.js';
import {datesTrip} from '../data.js';

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._tripDays = new TripDays(datesTrip);
    this._sort = new Sort();
    this._notPoints = new NotPoints();
  }

  init() {
    renderElement(this._container, this._tripDays.getElement());
    renderElement(this._container.querySelector(`h2`), this._sort.getElement(), `afterend`);

    for (let i = 0; i < this._events.length; i++) {
      this._renderCard(this._events[i]);
    }

    if (!this._container.querySelector(`.trip-events__item`)) {
      removeNode(this._container.querySelector(`.trip-events__trip-sort`));
      renderElement(this._container, this._notPoints.getElement());
    }

    this._sort.getElement().addEventListener(`click`, (evt) => this._sortClickHandler(evt));
  }

  _renderCard(element) {
    const cardComponent = new Card(element);
    const cardEditComponent = new CardEdit(element);
    const cardElement = cardComponent.getElement();
    const cardEditElement = cardEditComponent.getElement();
    const tripDaysItems = this._container.querySelectorAll(`.trip-days__item`);

    tripDaysItems.forEach((item) => {
      const dateItem = item.querySelector(`time`).getAttribute(`datetime`);
      const dateEvent = new Date(element.time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`});
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

      if (dateItem === dateEvent) {
        renderElement(tripListElement, cardElement);
        cardElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, replaceElementHandler);
        cardEditElement.querySelector(`form`).addEventListener(`submit`, replaceElementHandler);
      }
    });
  }

  _renderCards(elements) {
    return elements.forEach((element) => this._renderCard(element));
  }

  _sortClickHandler(evt) {
    if (evt.target.localName !== `label`) {
      return;
    }

    removeNode(this._tripDays.getElement());
    this._tripDays.removeElement();

    renderElement(this._container, this._tripDays.getElement());

    switch (evt.target.dataset.sortType) {
      case `default`:
        this._renderCards(this._events);
        break;
      case `time`:
        const sortedTimeCards = this._events.slice().sort((a, b) => a.time.hour - b.time.hour);
        this._renderCards(sortedTimeCards);
        break;
      case `price`:
        const sortedPriceCards = this._events.slice().sort((a, b) => a.price - b.price);
        this._renderCards(sortedPriceCards);
        break;
    }
  }
}
