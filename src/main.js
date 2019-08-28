import {TripInfo} from './components/trip-info.js';
import {Menu} from './components/site-menu.js';
import {Filter} from './components/filter.js';
import {Sorting} from './components/sorting.js';
import {TripDays} from './components/trip-days.js';
import {TripController} from './controllers/trip.js';
import {totalCards, menuNames, filterNames, townsTrip, datesTrip} from './data.js';
import {renderElement} from './utils.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const renderMarkup = (elementClass, container, place) => {
  renderElement(container, elementClass.getElement(), place);
};

renderMarkup(new TripInfo(totalCards, townsTrip, datesTrip), tripInfoElement, `afterbegin`);
renderMarkup(new Menu(menuNames), tripControlsElement.querySelector(`h2`), `afterend`);
renderMarkup(new Filter(filterNames), tripControlsElement);
renderMarkup(new Sorting(), tripEventsElement);
renderMarkup(new TripDays(), tripEventsElement);

const tripController = new TripController(tripEventsElement, totalCards);
tripController.init();
