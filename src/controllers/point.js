import {Point} from '../components/point.js';
import {PointEdit} from '../components/point-edit.js';
import {renderElement, isEscButton, Position, Mode} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export class PointController {
  constructor(container, data, mode, dataChangeHandler, changeViewHandler, destinations, offers) {
    this._container = container.querySelector(`.trip-events__list`);
    this._data = data;
    this._point = new Point(data);
    this._pointEdit = new PointEdit(data, destinations, offers);
    this._dataChangeHandler = dataChangeHandler;
    this._changeViewHandler = changeViewHandler;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._currentPoint = this._point;
    this.init(mode);
  }

  init(mode) {
    const pointElement = this._point.getElement();
    const pointEditElement = this._pointEdit.getElement();

    let currentPosition = Position.BEFOREEND;
    this._currentPoint = pointElement;

    if (mode === Mode.ADDING) {
      currentPosition = Position.AFTERBEGIN;
      this._currentPoint = pointEditElement;
    }

    flatpickr(pointEditElement.querySelector(`#event-start-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j.m.Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.dateFrom,
    });

    flatpickr(pointEditElement.querySelector(`#event-end-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j.m.Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.dateTo,
    });

    pointElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._changeViewHandler();
      this._container.replaceChild(pointEditElement, pointElement);

      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    pointEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      this._dataChangeHandler(mode === Mode.DEFAULT ? `update` : `create`, this._getFormData(pointEditElement));

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    pointEditElement.querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (mode === Mode.DEFAULT) {
        this._dataChangeHandler(`delete`, this._data);
      } else {
        this._container.removeChild(this._currentPoint);
        this._dataChangeHandler(this._getFormData(pointEditElement), this._data);
      }

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    renderElement(this._container, this._currentPoint, currentPosition);
  }

  setDefaultView() {
    if (this._container.contains(this._pointEdit.getElement())) {
      this._container.replaceChild(this._point.getElement(), this._pointEdit.getElement());
    }
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscButton(evt)) {
      this._container.replaceChild(this._point.getElement(), this._pointEdit.getElement());
      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    }
  }

  _getFormData(pointEditElement) {
    const formData = new FormData(pointEditElement.querySelector(`form`));

    const entry = {
      id: this._data.id,
      dateFrom: Date.parse(formData.get(`event-start-time`)),
      dateTo: Date.parse(formData.get(`event-end-time`)),
      destination: {
        description: pointEditElement.querySelector(`.event__destination-description`).textContent,
        name: formData.get(`event-destination`),
        pictures: Array.from(pointEditElement.querySelectorAll(`.event__photos-tape img`))
          .map((element) => {
            return {
              description: element.alt,
              src: element.src
            };
          })
      },
      price: parseInt(formData.get(`event-price`), 10),
      isFavorite: formData.get(`event-favorite`) === `on` ? true : false,
      type: formData.get(`event-type`),
      offers: Array.from(pointEditElement.querySelectorAll(`.event__offer-selector`))
        .map((element) => {
          return {
            title: element.querySelector(`.event__offer-title`).textContent,
            price: parseInt(element.querySelector(`.event__offer-price`).textContent, 10),
            accepted: element.firstElementChild.checked
          };
        }),
      toRAW() {
        return {
          'id': this.id,
          'base_price': this.price,
          'date_from': this.dateFrom,
          'date_to': this.dateTo,
          'destination': this.destination,
          'is_favorite': this.isFavorite,
          'type': this.type,
          'offers': this.offers
        };
      }
    };

    return entry;
  }
}
