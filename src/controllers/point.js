import {Point} from '../components/point.js';
import {PointEdit} from '../components/point-edit.js';
import {renderElement, isEscButton, Position, Mode} from '../utils.js';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export class PointController {
  constructor(container, data, mode, dataChangeHandler, changeViewHandler) {
    this._container = container.querySelector(`.trip-events__list`);
    this._data = data;
    this._point = new Point(data);
    this._pointEdit = new PointEdit(data);
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
      defaultDate: this._data.date,
    });

    flatpickr(pointEditElement.querySelector(`#event-end-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j.m.Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.date,
    });

    pointElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._changeViewHandler();
      this._container.replaceChild(pointEditElement, pointElement);

      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    pointEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      this._dataChangeHandler(this._getFormData(pointEditElement), mode === Mode.DEFAULT ? this._data : null);

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    pointEditElement.querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (mode === Mode.DEFAULT) {
        this._dataChangeHandler(null, this._data);
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
      discription: pointEditElement.querySelector(`.event__destination-description`).textContent,
      price: parseInt(formData.get(`event-price`), 10),
      town: formData.get(`event-destination`),
      photos: Array.from(pointEditElement.querySelectorAll(`.event__photos-tape img`)).map((element) => element.src),
      types: [{
        type: formData.get(`event-type`),
        img: pointEditElement.querySelector(`.event__type-btn img`).attributes.src.value,
        title: pointEditElement.querySelector(`.event__type-output`).textContent.trim()
      }],
      date: Date.parse(formData.get(`event-start-time`)),
      offers: Array.from(pointEditElement.querySelectorAll(`.event__offer-selector`)).filter((element) => {
        return element.firstElementChild.checked;
      }).map((element) => {
        return {
          title: element.querySelector(`.event__offer-title`).textContent,
          price: parseInt(element.querySelector(`.event__offer-price`).textContent, 10),
          isActive: element.firstElementChild.checked
        };
      })
    };

    return entry;
  }
}
