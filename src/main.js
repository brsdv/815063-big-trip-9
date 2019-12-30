import Menu from './components/menu.js';
import TripController from './controllers/trip.js';
import TripInfoController from './controllers/trip-info.js';
import StatsController from './controllers/statistic.js';
import {renderElement, Position, SiteMenu, setDisabledValue, switchActiveMenu} from './utils.js';
import API from './api.js';
import Store from './store.js';

const MENU_NAMES = [`Table`, `Stats`];
const FILTER_NAMES = [`Everything`, `Future`, `Past`];

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
        store.setPoints(points);
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
          store.setPoints(points);
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
          store.setPoints(points);
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
          store.setPoints(points);
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

const store = new Store();

let tripController;
let tripInfoController = new TripInfoController();
const statsController = new StatsController(tripEventsElement);
const menu = new Menu(MENU_NAMES);

const api = new API(END_POINT, AUTHORIZATION);

api.getData({url: `destinations`}).then((destinations) => {
  store.setDestinations(destinations);
});

api.getData({url: `offers`}).then((offers) => {
  store.setOffers(offers);
});

api.getPoints()
  .then((points) => {
    store.setPoints(points);
  })
  .then(() => {
    tripInfoController.updateHeader(store.getPoints());
    tripController = new TripController(tripEventsElement, FILTER_NAMES, store.getPoints(), dataChangeHandler, store.getDestinations(), store.getOffers());
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
      tripController.show(store.getPoints());
      setDisabledValue(document.querySelectorAll(`.trip-filters__filter-input`), false);
      break;
    case SiteMenu.STATISTIC:
      switchActiveMenu(evt, evt.target.previousElementSibling);
      statsController.show(store.getPoints());
      tripController.hide();
      setDisabledValue(document.querySelectorAll(`.trip-filters__filter-input`), true);
      break;
  }
});

tripEventsButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  statsController.hide();
  tripController.show(store.getPoints());
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
