import {Statistic} from '../components/statistic.js';
import {renderElement, Position} from '../utils.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export class StatsController {
  constructor(container) {
    this._container = container;
    this._statistic = new Statistic();
    this.init();
  }

  init() {
    renderElement(this._container, this._statistic.getElement(), Position.AFTEREND);
  }

  show() {
    this._statistic.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);
  }
}
