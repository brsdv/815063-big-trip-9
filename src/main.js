import {TripInfo} from './components/trip-info.js';
import {TotalPrice} from './components/total-price.js';
import {Menu} from './components/site-menu.js';
import {TripController} from './controllers/trip.js';
import {StatsController} from './controllers/statistic.js';
import {totalPoints, menuNames, filterNames, towns, dates} from './data.js';
import {renderElement, Position, SiteMenu, switchActiveMenu} from './utils.js';

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripEventsElement = document.querySelector(`.trip-events`);
const tripInfoElement = tripHeaderElement.querySelector(`.trip-main__trip-info`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripEventsButton = tripHeaderElement.querySelector(`.trip-main__event-add-btn`);

let pointsMock = totalPoints;

const dataChangeHandler = (points) => {
  pointsMock = points;
};

const tripInfo = new TripInfo(towns, dates);
const totalPrice = new TotalPrice(pointsMock);
const menu = new Menu(menuNames);

renderElement(tripInfoElement, tripInfo.getElement(), Position.AFTERBEGIN);
renderElement(tripInfoElement, totalPrice.getElement());
renderElement(tripControlsElement.querySelector(`h2`), menu.getElement(), Position.AFTEREND);

const statsController = new StatsController(tripEventsElement);
const tripController = new TripController(tripEventsElement, filterNames, pointsMock, dataChangeHandler);

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.localName !== `a`) {
    return;
  }

  switch (evt.target.textContent) {
    case SiteMenu.TABLE:
      switchActiveMenu(evt, evt.target.nextElementSibling);
      statsController.hide();
      tripController.show(pointsMock);
      break;
    case SiteMenu.STATISTIC:
      switchActiveMenu(evt, evt.target.previousElementSibling);
      statsController.show(pointsMock);
      tripController.hide();
      break;
  }
});

tripEventsButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  statsController.hide();
  tripController.show(pointsMock);

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
