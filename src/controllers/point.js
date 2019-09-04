import {Point} from '../components/point.js';
import {PointEdit} from '../components/point-edit.js';
import {renderElement, isEscButton} from '../utils.js';

export class PointController {
  constructor(container, data) {
    this._container = container;
    this._data = data;
    this._point = new Point(data);
    this._pointEdit = new PointEdit(data);
  }

  init() {
    const cardElement = this._point.getElement();
    const cardEditElement = this._pointEdit.getElement();
    const tripListElement = this._container.querySelector(`.trip-events__list`);

    const escKeyDownHandler = (evt) => {
      if (isEscButton(evt)) {
        tripListElement.replaceChild(cardElement, cardEditElement);
        document.removeEventListener(`keydown`, escKeyDownHandler);
      }
    };

    cardElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      tripListElement.replaceChild(cardEditElement, cardElement);
      document.addEventListener(`keydown`, escKeyDownHandler);
    });

    cardEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      tripListElement.replaceChild(cardElement, cardEditElement);

      const formData = new FormData(cardEditElement.querySelector(`form`));

      const entry = {
        discription: cardEditElement.querySelector(`.event__destination-description`).textContent,
        price: parseInt(formData.get(`event-price`), 10),
        town: formData.get(`event-destination`),
        photos: Array.from(cardEditElement.querySelector(`.event__photos-tape`).querySelector(`.event__photo`)).map((element) => element.src),
        types: [{
          type: formData.get(`event-type`),
          img: cardEditElement.querySelector(`.event__type-btn img`).src,
          title: cardEditElement.querySelector(`.event__type-output`).innerText
        }],
      };
      console.log(entry);

      document.removeEventListener(`keydown`, escKeyDownHandler);
    });

    renderElement(tripListElement, cardElement);
  }
}
