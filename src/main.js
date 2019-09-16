import {TripInfo} from './components/trip-info.js';
import {TotalPrice} from "./components/total-price.js";
import {Menu} from './components/site-menu.js';
import {Filter} from './components/filter.js';
import {Statistic} from "./components/statistic.js";
import {TripController} from './controllers/trip.js';
import {totalPoints, menuNames, filterNames, towns, dates} from './data.js';
import {renderElement, Position, SiteMenu, switchActiveMenu} from './utils.js';

const tripHeaderElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripHeaderElement.querySelector(`.trip-main__trip-info`);
const tripControlsElement = tripHeaderElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const tripInfo = new TripInfo(towns, dates);
const totalPrice = new TotalPrice(totalPoints);
const menu = new Menu(menuNames);
const filter = new Filter(filterNames);
const statistic = new Statistic();

renderElement(tripInfoElement, tripInfo.getElement(), Position.AFTERBEGIN);
renderElement(tripInfoElement, totalPrice.getElement());
renderElement(tripControlsElement.querySelector(`h2`), menu.getElement(), Position.AFTEREND);
renderElement(tripControlsElement, filter.getElement());
renderElement(tripEventsElement, statistic.getElement(), Position.AFTEREND);

const tripController = new TripController(tripEventsElement, totalPoints);
tripController.init();

menu.getElement().addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (evt.target.localName !== `a`) {
    return;
  }

  switch (evt.target.textContent) {
    case SiteMenu.TABLE:
      switchActiveMenu(evt, evt.target.nextElementSibling);
      statistic.getElement().classList.add(`visually-hidden`);
      tripController.show();
      break;
    case SiteMenu.STATISTIC:
      switchActiveMenu(evt, evt.target.previousElementSibling);
      statistic.getElement().classList.remove(`visually-hidden`);
      tripController.hide();
      break;
  }
});
