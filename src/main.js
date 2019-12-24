import Menu from './components/menu.js';
import TripController from './controllers/trip.js';
import TripInfoController from './controllers/trip-info.js';
import StatsController from './controllers/statistic.js';
import {renderElement, Position, SiteMenu, setDisabledValue, switchActiveMenu} from './utils.js';
import API from './api.js';

const menus = [`Table`, `Stats`];
const filters = [`Everything`, `Future`, `Past`];

const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=${Math.random()}`;
const END_POINT = `https://htmlacademy-es-9.appspot.com/big-trip/`;

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripEventsButton = tripHeaderElement.querySelector(`.trip-main__event-add-btn`);

const dataChangeHandler = (actionType, update, errorHandler) => {
  if (actionType === null) {
    api.getPoints()
      .then((points) => {
        AllData = points;
        tripController.show(points);
      });
    return;
  }

  switch (actionType) {
    case `create`:
      api.createPoint({
        data: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          AllData = points;
          tripController.show(points);
          tripInfoController.updateHeader(points);
        })
        .catch(() => {
          errorHandler();
        });
      break;
    case `update`:
      api.updatePoint({
        id: update.id,
        data: update.toRAW()
      })
        .then(() => api.getPoints())
        .then((points) => {
          AllData = points;
          tripController.show(points);
          tripInfoController.updateHeader(points);
        })
        .catch(() => {
          errorHandler();
        });
      break;
    case `delete`:
      api.deletePoint({
        id: update.id
      })
        .then(() => api.getPoints())
        .then((points) => {
          AllData = points;
          tripController.show(points);
          tripInfoController.updateHeader(points);
        })
        .catch(() => {
          errorHandler();
        });
      break;
    default:
      throw new Error(`Wrong actionType`);
  }
};

let AllData = null;
let AllDestinations = null;
let AllOffers = null;
let tripController = null;

let tripInfoController = new TripInfoController();
const menu = new Menu(menus);
const statsController = new StatsController(tripEventsElement);
const api = new API(END_POINT, AUTHORIZATION);

api.getData({url: `destinations`}).then((data) => {
  AllDestinations = data;
});

api.getData({url: `offers`}).then((data) => {
  AllOffers = data;
});

api.getPoints()
  .then((points) => {
    AllData = points;
  })
  .then(() => {
    tripInfoController.updateHeader(AllData);
    tripController = new TripController(tripEventsElement, filters, AllData, dataChangeHandler, AllDestinations, AllOffers);
  });

renderElement(tripControlsElement.querySelector(`h2`), menu.getElement(), Position.AFTEREND);

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.localName !== `a`) {
    return;
  }

  switch (evt.target.textContent) {
    case SiteMenu.TABLE:
      switchActiveMenu(evt, evt.target.nextElementSibling);
      statsController.hide();
      tripController.show(AllData);
      setDisabledValue(document.querySelectorAll(`.trip-filters__filter-input`), false);
      break;
    case SiteMenu.STATISTIC:
      switchActiveMenu(evt, evt.target.previousElementSibling);
      statsController.show(AllData);
      tripController.hide();
      setDisabledValue(document.querySelectorAll(`.trip-filters__filter-input`), true);
      break;
  }
});

tripEventsButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  statsController.hide();
  tripController.show(AllData);
  setDisabledValue(document.querySelectorAll(`.trip-filters__filter-input`), false);

  menu.getElement().querySelectorAll(`a`).forEach((element) => {
    switch (element.textContent) {
      case SiteMenu.TABLE:
        element.classList.add(`trip-tabs__btn--active`);
        break;
      case SiteMenu.STATISTIC:
        element.classList.remove(`trip-tabs__btn--active`);
        break;
    }
  });

  tripController.createPoint();
});
