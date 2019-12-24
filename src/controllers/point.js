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
    this._getButtonName(mode);
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
      this._changeViewHandler();
    }

    const fpStart = flatpickr(pointEditElement.querySelector(`#event-start-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j/m/Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.dateFrom,
      onChange(selectedDates) {
        fpEnd.set(`minDate`, selectedDates[0]);
      }
    });

    const fpEnd = flatpickr(pointEditElement.querySelector(`#event-end-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j/m/Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.dateTo,
      minDate: fpStart.selectedDates[0]
    });

    pointElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._changeViewHandler();
      this._container.replaceChild(pointEditElement, pointElement);

      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    pointEditElement.querySelector(`.event--edit`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      const entry = this._getFormData(pointEditElement);

      this.block(evt);
      setTimeout(this._dataChangeHandler.bind(this,
          mode === Mode.DEFAULT ? `update` : `create`,
          entry,
          () => {
            this.errorHandler(evt);
          }), 1000);

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    pointEditElement.querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this.block(evt);
      if (mode === Mode.DEFAULT) {
        setTimeout(this._dataChangeHandler.bind(this, `delete`, this._data), 1000);
      } else {
        this._container.removeChild(this._currentPoint);
        this._dataChangeHandler(null, this._data);
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

  _getButtonName(mode) {
    if (mode === Mode.ADDING) {
      this._pointEdit.getElement().querySelector(`.event__reset-btn`).innerHTML = `Cancel`;
    }
  }

  block(evt) {
    this._pointEdit.getElement().querySelector(`.event--edit`).style.border = ``;
    this._pointEdit.getElement().querySelector(`.event__save-btn`).disabled = true;
    this._pointEdit.getElement().querySelector(`.event__reset-btn`).disabled = true;

    if (evt.type === `submit`) {
      this._pointEdit.getElement().querySelector(`.event__save-btn`).innerHTML = `Saving...`;
    } else {
      this._pointEdit.getElement().querySelector(`.event__reset-btn`).innerHTML = `Deleting...`;
    }

    const inputs = this._pointEdit.getElement().querySelectorAll(`input`);
    inputs.forEach((item) => {
      item.disabled = true;
    });
  }

  unblock(evt) {
    this._pointEdit.getElement().querySelector(`.event__save-btn`).disabled = false;
    this._pointEdit.getElement().querySelector(`.event__reset-btn`).disabled = false;

    if (evt.type === `submit`) {
      this._pointEdit.getElement().querySelector(`.event__save-btn`).innerHTML = `Save`;
    } else {
      this._pointEdit.getElement().querySelector(`.event__reset-btn`).innerHTML = `Delete`;
    }

    const inputs = this._pointEdit.getElement().querySelectorAll(`input`);
    inputs.forEach((item) => {
      item.disabled = false;
    });
  }

  shake() {
    const ANIMATION_TIMEOUT = 600;
    this._pointEdit.getElement().style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEdit.getElement().style.animation = ``;
    }, ANIMATION_TIMEOUT);
  }

  errorHandler(evt) {
    this.shake();
    this.unblock(evt);
    this._pointEdit.getElement().querySelector(`.event--edit`).style.border = `1px solid red`;
  }
}
