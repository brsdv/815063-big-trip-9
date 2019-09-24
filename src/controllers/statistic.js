import {Statistic} from '../components/statistic.js';
import {renderElement, Position} from '../utils.js';
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export class StatsController {
  constructor(container) {
    this._container = container;
    this._points = [];
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._statistic = new Statistic();
    this._init();
  }

  _init() {
    renderElement(this._container, this._statistic.getElement(), Position.AFTEREND);
  }

  hide() {
    this._statistic.getElement().classList.add(`visually-hidden`);
    this._removeChart(this._moneyChart, this._transportChart, this._timeChart);
  }

  show(points) {
    this._points = points;
    this._statistic.getElement().classList.remove(`visually-hidden`);

    Chart.defaults.global.defaultFontColor = `#000000`;
    Chart.defaults.global.defaultFontStyle = `bold`;
    this._createMoney();
    this._createTransport();
    this._createTimeSpend();
  }

  _removeChart(...charts) {
    charts.forEach((element) => {
      if (element) {
        element.destroy();
      }
    });
  }

  _createChart(ctx, labels, data, text) {
    return new Chart(ctx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `#ffffff`
        }]
      },
      options: {
        title: {
          display: true,
          text,
          position: `left`,
          fontSize: 30,
          padding: 30,
        },
        plugins: {
          datalabels: {
            display: true,
            anchor: `end`,
            align: `start`,
            padding: 15,
            formatter(value) {
              switch (text) {
                case `TRANSPORT`:
                  return `${value}x`;
                case `TIME SPEND`:
                  return `${value}H`;
              }

              return `€ ${value}`;
            }
          }
        },
        scales: {
          yAxes: [{
            barPercentage: 0.9,
            maxBarThickness: 55,
            ticks: {
              fontSize: `14`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            minBarLength: 50,
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            top: 10,
          }
        },
        tooltips: {
          enabled: false
        },
      }
    });
  }

  _createMoney() {
    const ctx = this._statistic.getElement().querySelector(`.statistics__chart--money`);
    const typeLabels = this._uniqueItems(this._points.map(({type: {type}}) => type.toUpperCase()));

    const typeData = typeLabels.reduce((acc, item) => {
      const typeDataLabel = this._points.filter(({type: {type}}) => type.toUpperCase() === item);
      const typeDataPrice = typeDataLabel.reduce((accum, {price}) => accum + price, 0);

      acc.push(typeDataPrice);
      return acc;
    }, []);

    this._moneyChart = this._createChart(ctx, typeLabels, typeData, `MONEY`);
  }

  _createTransport() {
    const ctx = this._statistic.getElement().querySelector(`.statistics__chart--transport`);
    const transportData = this._points.filter(({type: {placeholder}}) => placeholder === `to`);
    const transportLabels = this._uniqueItems(transportData.map(({type: {type}}) => type.toUpperCase()));

    const typeData = transportLabels.reduce((acc, item) => {
      const transportCount = transportData.filter(({type: {type}}) => type.toUpperCase() === item).length;

      acc.push(transportCount);
      return acc;
    }, []);

    this._transportChart = this._createChart(ctx, transportLabels, typeData, `TRANSPORT`);
  }

  _createTimeSpend() {
    const ctx = this._statistic.getElement().querySelector(`.statistics__chart--time`);
    const timeLabels = this._uniqueItems(this._points.map(({type: {type}}) => type.toUpperCase()));

    const typeData = timeLabels.reduce((acc, item) => {
      const timeCount = this._points.filter(({type: {type}}) => type.toUpperCase() === item).length;

      acc.push(timeCount);
      return acc;
    }, []);

    this._timeChart = this._createChart(ctx, timeLabels, typeData, `TIME SPEND`);
  }

  _uniqueItems(elements) {
    const uniqueItems = new Set(elements);

    return [...uniqueItems];
  }
}
