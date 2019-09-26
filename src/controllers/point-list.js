import {PointController} from './point.js';
import {isLength, isElementCount, shortDate, Mode} from '../utils.js';
import {getRandomText} from '../data.js';

export class PointListController {
  constructor(container, dataChangeHandler) {
    this._container = container;
    this._dataChangeTripHandler = dataChangeHandler;
    this._points = [];
    this._subscriptions = [];
    this._creatingPoint = null;
    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._changeViewHandler = this._changeViewHandler.bind(this);
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

  renderSort(item, element) {
    this._renderPoint(item, element);
  }

  setPoints(container, elements) {
    this._points = elements;
    this._subscriptions = [];
console.log(elements);
    if (isLength(container) && isElementCount(container)) {
      return elements.forEach((element) => this.renderSort(container, element));
    } else {
      return elements.forEach((element) => this.renderSortDefault(container, element));
    }
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
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

  _changeViewHandler() {
    this._subscriptions.forEach((item) => item());
  }

  _dataChangeHandler(newData, oldData) {
    this._dataChangeTripHandler(newData, oldData);
  }
}
