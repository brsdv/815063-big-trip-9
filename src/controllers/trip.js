import {Card} from '../components/card.js';
import {CardEdit} from '../components/card-edit.js';
import {NotPoints} from '../components/no-points.js';
import {renderElement, removeNode, isEscButton} from '../utils.js';

export class TripController {
  constructor(container, events) {
    this._container = container;
    this._events = events;
    this._notPoints = new NotPoints();
  }

  init() {
    for (let i = 0; i < this._events.length; i++) {
      this._renderCard(this._events[i]);
    }

    if (!this._container.querySelector(`.trip-events__item`)) {
      removeNode(this._container.querySelector(`.trip-events__trip-sort`));
      renderElement(this._container, this._notPoints.getElement());
    }
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
}
