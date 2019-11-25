import {AbstractComponent} from "./abstract-component.js";
import {pointTypes} from '../utils.js';
import moment from 'moment';

export class PointEdit extends AbstractComponent {
  constructor({type, destination, dateFrom, dateTo, price, offers, isFavorite}, destinations, offersType) {
    super();
    this._type = type;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._price = price;
    this._isFavorite = isFavorite;
    this._town = destination.name;
    this._photos = destination.pictures;
    this._description = destination.description;
    this._offers = offers;
    this._destinations = destinations;
    this._offersType = offersType;
    this._setNumber();
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
    
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>

              ${this._getTransferType(this._offersType, `Transfer`)}
            </fieldset>
    
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
    
              ${this._getTransferType(this._offersType, `Activity`)}
            </fieldset>
          </div>
        </div>
    
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${pointTypes.find((pointType) => pointType.type === this._type).title}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._town}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${this._destinations.map((item) => `<option value="${item.name}"></option>`).join(``)}
          </datalist>
        </div>
    
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._dateFrom).format(`DD.MM.YYYY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._dateTo).format(`DD.MM.YYYY HH:mm`)}">
        </div>
    
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
        </div>
    
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
    
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
    
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
    
      <section class="event__details">
    
        ${this._getOffers(this._offers)}
    
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._description}</p>
    
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${this._photos.map((element) => `<img class="event__photo" src="${element.src}" alt="${element.description}">`).join(``)}
            </div>
          </div>
        </section>
      </section>
    </form>
    </li>`.trim();
  }

  _getOfferId(title) {
    return title.split(` `).join(`-`).toLowerCase();
  }

  _getOffers(offers) {
    if (offers.length > 0) {
      return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map(({title, price, accepted}) => `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${this._getOfferId(title)}-1" type="checkbox" name="event-offer-${this._getOfferId(title)}" ${accepted ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${this._getOfferId(title)}-1">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
          </label>
        </div>`).join(``)}

      </div>
    </section>`;
    } else {
      return ``;
    }
  }

  _getTransferType(types, flag) {
    const array = [`check-in`, `restaurant`, `sightseeing`];
    let newTypes = null;

    if (flag === `Transfer`) {
      newTypes = types.filter(({type}) => array.every((it) => it !== type));
    } else {
      newTypes = types.filter(({type}) => array.some((it) => it === type));
    }

    return newTypes.map(({type}) => `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${this._type === type ? `checked` : ``}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
      </div>`).join(``);
  }

  _setNumber() {
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, (evt) => {
      evt.target.value = evt.target.value.replace(/[^\d]/g, ``);
    });
  }
}
