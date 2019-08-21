export const getCardTemplate = ({types, town, time, price, offers}) => `<li class="trip-events__item">
<div class="event">
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="${types.map((element) => element.img)}" alt="Event type icon">
  </div>
  <h3 class="event__title">${types.map((element) => element.title)} ${town}</h3>

  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${new Date(time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`})}">${time.hour}:${time.minute}</time>
      &mdash;
      <time class="event__end-time" datetime="${new Date(time.date).toLocaleString(`en`, {day: `numeric`, month: `numeric`, year: `numeric`})}">${time.hour + 1}:${time.minute}</time>
    </p>
    <p class="event__duration">${(time.hour + 1) - time.hour}H</p>
  </div>

  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${price}</span>
  </p>

  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map((element) => (offers.length > 0) ? `<li class="event__offer">
    <span class="event__offer-title">${element.title}</span>
    &plus;
    &euro;&nbsp;<span class="event__offer-price">${element.price}</span>
   </li>` : ``).join(``)}
  </ul>

  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;
