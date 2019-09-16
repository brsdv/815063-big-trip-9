import {Point} from '../components/point.js';
import {PointEdit} from '../components/point-edit.js';
import {renderElement, isEscButton} from '../utils.js';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

export class PointController {
  constructor(container, data, dataChangeHandler, changeViewHandler) {
    this._container = container.querySelector(`.trip-events__list`);
    this._data = data;
    this._point = new Point(data);
    this._pointEdit = new PointEdit(data);
    this._dataChangeHandler = dataChangeHandler;
    this._changeViewHandler = changeViewHandler;
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    const cardElement = this._point.getElement();
    const cardEditElement = this._pointEdit.getElement();

    flatpickr(cardEditElement.querySelector(`#event-start-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j.m.Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.date,
    });

    flatpickr(cardEditElement.querySelector(`#event-end-time-1`), {
      altInput: true,
      enableTime: true,
      altFormat: `j.m.Y H:i`,
      dateFormat: `n/j/Y H:i`,
      defaultDate: this._data.date,
    });

    cardElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._changeViewHandler();
      this._container.replaceChild(cardEditElement, cardElement);

      document.addEventListener(`keydown`, this._escKeyDownHandler);
    });

    cardEditElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();

      this._container.replaceChild(cardElement, cardEditElement);
      this._dataChangeHandler(this._getFormData(cardEditElement), this._data);

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    cardEditElement.querySelector(`.event__reset-btn`).addEventListener(`click`, (evt) => {
      evt.preventDefault();

      this._dataChangeHandler(null, this._data);

      document.removeEventListener(`keydown`, this._escKeyDownHandler);
    });

    renderElement(this._container, cardElement);
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

  _getFormData(cardEditElement) {
    const formData = new FormData(cardEditElement.querySelector(`form`));

    const entry = {
      discription: cardEditElement.querySelector(`.event__destination-description`).textContent,
      price: parseInt(formData.get(`event-price`), 10),
      town: formData.get(`event-destination`),
      photos: Array.from(cardEditElement.querySelectorAll(`.event__photos-tape img`)).map((element) => element.src),
      types: [{
        type: formData.get(`event-type`),
        img: cardEditElement.querySelector(`.event__type-btn img`).attributes.src.value,
        title: cardEditElement.querySelector(`.event__type-output`).textContent.trim()
      }],
      date: Date.parse(formData.get(`event-start-time`)),
      offers: Array.from(cardEditElement.querySelectorAll(`.event__offer-selector`)).filter((element) => {
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
