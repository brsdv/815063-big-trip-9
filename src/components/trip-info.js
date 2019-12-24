import AbstractComponent from "./abstract-component.js";
import moment from 'moment';

class TripInfo extends AbstractComponent {
  constructor(towns, dates) {
    super();
    this._towns = towns;
    this._dates = dates;
  }

  getTemplate() {
    return `<div class="trip-info__main">
    <h1 class="trip-info__title">${this.getTitle(this._towns)}</h1>
    <p class="trip-info__dates">${this.getDates(this._dates)}</p>
    </div>`.trim();
  }

  getTitle(towns) {
    switch (towns.length) {
      case 0:
        return `Start City`;
      case 1:
        return `${towns[0]}`;
      case 2:
        return `${towns[0]} &mdash; ${towns[1]}`;
      case 3:
        return `${towns[0]} &mdash; ${towns[1]} &mdash; ${towns[2]}`;
      default:
        return `${towns[0]} &mdash; ... &mdash; ${towns[towns.length - 1]}`;
    }
  }

  getDates(dates) {
    switch (dates.length) {
      case 0:
        return `${moment().format(`MMM DD`)}`;
      case 1:
        return `${moment(dates[0]).format(`MMM DD`)}`;
      default:
        return `${moment(dates[0]).format(`MMM DD`)}&nbsp;&mdash;&nbsp;${moment(dates[dates.length - 1]).format(`MMM DD`)}`;
    }
  }
}

export default TripInfo;
