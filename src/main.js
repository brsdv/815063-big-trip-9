import {TripInfo} from './components/trip-info.js';
import {Menu} from './components/site-menu.js';
import {Filter} from './components/filter.js';
import {Sorting} from './components/sorting.js';
import {TripBoard} from './components/trip-board.js';
import {Card} from './components/card.js';
import {CardEdit} from './components/card-edit.js';
import {NotPoints} from './components/no-points.js';
import {totalCards, menuNames, filterNames, townsTrip, datesTrip} from './data.js';
import {renderElement, removeNode, isEscButton} from './utils.js';

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
renderMarkup(new TripBoard(), tripEventsElement);

const tripListElement = tripEventsElement.querySelector(`.trip-events__list`);

const renderCard = (element) => {
  const card = new Card(element);
  const cardEdit = new CardEdit(element);
  const cardElement = card.getElement();
  const cardEditElement = cardEdit.getElement();

  const escKeyDownHandler = (evt) => {
    if (isEscButton(evt)) {
      tripListElement.replaceChild(cardElement, cardEditElement);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  const replaceElementHandler = (evt) => {
    if (evt.type === `click`) {
      tripListElement.replaceChild(cardEditElement, cardElement);
      document.addEventListener(`keydown`, escKeyDownHandler);
    } else if (evt.type === `submit`) {
      tripListElement.replaceChild(cardElement, cardEditElement);
      document.removeEventListener(`keydown`, escKeyDownHandler);
    }
  };

  cardElement.querySelector(`.event__rollup-btn`).addEventListener(`click`, replaceElementHandler);
  cardEditElement.querySelector(`form`).addEventListener(`submit`, replaceElementHandler);

  renderElement(tripListElement, cardElement);
};

for (let i = 0; i < totalCards.length; i++) {
  renderCard(totalCards[i]);
}

if (!tripListElement.querySelector(`.trip-events__item`)) {
  const tripSortElement = tripEventsElement.querySelector(`.trip-events__trip-sort`);

  removeNode(tripSortElement);
  renderMarkup(new NotPoints(), tripEventsElement);
}
