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
    const tripListElement = this._container.querySelector(`.trip-events__list`);

    const escKeyDownHandler = (evt) => {
      if (isEscButton(evt)) {
        tripListElement.replaceChild(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    const replaceElementHandler = (evt) => {
      if (evt.type === `click`) {
        tripListElement.replaceChild(cardEditElement, cardElement);
        document.addEventListener(`keydown`, escKeyDownHandler);
      } else if (evt.type === `submit`) {
        tripListElement.replaceChild(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    cardElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, replaceElementHandler);
    cardEditElement.querySelector(`form`).addEventListener(`submit`, replaceElementHandler);

    renderElement(tripListElement, cardElement);
  }
}