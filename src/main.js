import {TripInfo} from './components/trip-info.js';
import {Menu} from './components/site-menu.js';
import {Filter} from './components/filter.js';
import {Sorting} from './components/sorting.js';
import {TripDays} from './components/trip-days.js';
import {TripController} from './controllers/trip.js';
import {totalCards, menuNames, filterNames, townsTrip, datesTrip} from './data.js';
import {renderElement} from './utils.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-main__trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

const render = (container, object, place) => {
  renderElement(container, object.getElement(), place);
};

render(tripInfoElement, new TripInfo(totalCards, townsTrip, datesTrip), `afterbegin`);
render(tripControlsElement.querySelector(`h2`), new Menu(menuNames), `afterend`);
render(tripControlsElement, new Filter(filterNames));
render(tripEventsElement, new Sorting());
render(tripEventsElement, new TripDays(datesTrip));

const tripController = new TripController(tripEventsElement, totalCards);
tripController.init();
