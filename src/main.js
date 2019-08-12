import {getTripInfoTemplate} from './components/trip-info.js';
import {getMenuTemplate} from './components/site-menu.js';
import {getFilterTemplate} from './components/filter.js';
import {getSortingTemplate} from './components/sorting.js';
import {getTripBoardTemplate} from './components/trip-board.js';
import {getCardTemplate} from './components/card.js';
import {getCardEditTemplate} from './components/card-edit.js';

const renderComponents = (container, template, place = `beforeEnd`) => container.insertAdjacentHTML(place, template);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

renderComponents(tripInfoElement, getTripInfoTemplate(), `afterBegin`);
renderComponents(tripControlsElement.querySelector(`h2`), getMenuTemplate(), `afterEnd`);
renderComponents(tripControlsElement, getFilterTemplate());
renderComponents(tripEventsElement, getSortingTemplate());
renderComponents(tripEventsElement, getTripBoardTemplate());

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

renderComponents(tripListElement, getCardEditTemplate());
new Array(3).fill(``).forEach(() => renderComponents(tripListElement, getCardTemplate()));
