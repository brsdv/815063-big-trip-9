import {TripInfo} from './components/trip-info.js';
import {TotalPrice} from "./components/total-price.js";
import {Menu} from './components/site-menu.js';
import {Filter} from './components/filter.js';
import {TripController} from './controllers/trip.js';
import {totalPoints, menuNames, filterNames, towns, dates} from './data.js';
import {renderElement} from './utils.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const render = (container, object, place) => {
  renderElement(container, object.getElement(), place);
};

render(tripInfoElement, new TripInfo(towns, dates), `afterbegin`);
render(tripInfoElement, new TotalPrice(totalPoints));
render(tripControlsElement.querySelector(`h2`), new Menu(menuNames), `afterend`);
render(tripControlsElement, new Filter(filterNames));

const tripController = new TripController(tripEventsElement, totalPoints);
tripController.init();
