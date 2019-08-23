import {getTripInfoTemplate} from './components/trip-info.js';
import {getMenuTemplate} from './components/site-menu.js';
import {getFilterTemplate} from './components/filter.js';
import {getSortingTemplate} from './components/sorting.js';
import {getTripBoardTemplate} from './components/trip-board.js';
import {getCardTemplate} from './components/card.js';
import {getCardEditTemplate} from './components/card-edit.js';
import {totalCards, menuNames, filterNames, townsTrip, datesTrip} from './data.js';

const CARD_COUNT = 4;

const renderComponents = (container, template, place = `beforeEnd`) => container.insertAdjacentHTML(place, template);

const tripMainElement = document.querySelector(`.trip-main`);
const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

renderComponents(tripInfoElement, getTripInfoTemplate(totalCards, townsTrip, datesTrip), `afterBegin`);
renderComponents(tripControlsElement.querySelector(`h2`), getMenuTemplate(menuNames), `afterEnd`);
renderComponents(tripControlsElement, getFilterTemplate(filterNames));
renderComponents(tripEventsElement, getSortingTemplate());
renderComponents(tripEventsElement, getTripBoardTemplate());

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

renderComponents(tripListElement, getCardEditTemplate(totalCards[0]));

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

const fragment = document.createDocumentFragment();

for (let i = 1; i < CARD_COUNT; i++) {
  const markupElement = createElement(getCardTemplate(totalCards[i]));
  fragment.appendChild(markupElement);
}

tripListElement.appendChild(fragment);
