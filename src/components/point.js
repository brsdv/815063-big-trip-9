import {AbstractComponent} from './abstract-component.js';
import {pointTypes} from '../utils.js';
import moment from 'moment';

export class Point extends AbstractComponent {
  constructor({type, destination, dateFrom, dateTo, price, offers}) {
    super();
    this._type = type;
    this._town = destination.name;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._price = price;
    this._offers = offers;
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${pointTypes.find((pointType) => pointType.type === this._type).title} ${this._town}</h3>
    
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${moment(this._dateFrom).format(`M.D.YYYY H:mm`)}">${moment(this._dateFrom).format(`HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${moment(this._dateTo).format(`M.D.YYYY H:mm`)}">${moment(this._dateTo).format(`HH:mm`)}</time>
        </p>
        <p class="event__duration">${this._getDifferenceTime(this._dateFrom, this._dateTo)}</p>
      </div>
    
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${this._price}</span>
      </p>
    
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${this._getOffers(this._offers)}
      </ul>
    
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
    </li>`.trim();
  }

  _getDifferenceTime(from, to) {
    const dateFrom = moment(from);
    const dateTo = moment(to);
    const format = `DD.MM.YYYY HH:mm`;

    const difference = moment(dateTo, format).diff(moment(dateFrom, format));
    const duration = moment.duration(difference);

    const day = duration.days() > 0 ? `${duration.days()}D` : ``;
    const hour = duration.hours() > 0 ? `${duration.hours()}H` : ``;

    return `${day} ${hour} ${duration.minutes()}M`;
  }

  _getOffers(offers) {
    if (offers.length > 0) {
      return offers.filter((offer) => offer.accepted).map((offer, index) => {
        if (index > 2) {
          return ``;
        }
        return `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`;
      }).join(``);
    } else {
      return ``;
    }
  }
}
