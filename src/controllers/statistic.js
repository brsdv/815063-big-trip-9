import Statistic from '../components/statistic.js';
import NotStats from '../components/no-stats.js';
import {renderElement, removeNode, Position, StatChart} from '../utils.js';
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

class StatsController {
  constructor(container) {
    this._container = container;
    this._points = [];
    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._statistic = new Statistic();
    this._notStats = new NotStats();
    this._ctxMoneyChart = this._statistic.getElement().querySelector(`.statistics__chart--money`);
    this._ctxTransportChart = this._statistic.getElement().querySelector(`.statistics__chart--transport`);
    this._ctxTimeChart = this._statistic.getElement().querySelector(`.statistics__chart--time`);
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
    this._statistic.getElement().classList.remove(`visually-hidden`);

    if (points.length === 0) {
      this._hideCanvas(this._ctxMoneyChart, this._ctxTransportChart, this._ctxTimeChart);
      renderElement(this._statistic.getElement(), this._notStats.getElement(), Position.BEFOREEND);
      return;
    } else {
      this._showCanvas(this._ctxMoneyChart, this._ctxTransportChart, this._ctxTimeChart);
      removeNode(this._notStats.getElement());
      this._notStats.removeElement();
    }

    this._points = points;

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
    const typeLabels = this._uniqueItems(this._points.map(({type}) => type.toUpperCase()));

    const typeData = typeLabels.reduce((acc, item) => {
      const typeDataLabel = this._points.filter(({type}) => type.toUpperCase() === item);
      const typeDataPrice = typeDataLabel.reduce((accum, {price}) => accum + price, 0);

      acc.push(typeDataPrice);
      return acc;
    }, []);

    this._moneyChart = this._createChart(this._ctxMoneyChart, typeLabels, typeData, StatChart.MONEY);
  }

  _createTransport() {
    const array = [`check-in`, `restaurant`, `sightseeing`];
    const transportData = this._points.filter(({type}) => array.every((item) => item !== type));
    const transportLabels = this._uniqueItems(transportData.map(({type}) => type.toUpperCase()));

    const typeData = transportLabels.reduce((acc, item) => {
      const transportCount = transportData.filter(({type}) => type.toUpperCase() === item).length;

      acc.push(transportCount);
      return acc;
    }, []);

    this._transportChart = this._createChart(this._ctxTransportChart, transportLabels, typeData, StatChart.TRANSPORT);
  }

  _createTimeSpend() {
    const timeLabels = this._uniqueItems(this._points.map(({type}) => type.toUpperCase()));

    const typeData = timeLabels.reduce((acc, item) => {
      const timeCount = this._points.filter(({type}) => type.toUpperCase() === item).length;

      acc.push(timeCount);
      return acc;
    }, []);

    this._timeChart = this._createChart(this._ctxTimeChart, timeLabels, typeData, StatChart.TIME_SPEND);
  }

  _uniqueItems(elements) {
    const uniqueItems = new Set(elements);
    return [...uniqueItems];
  }

  _hideCanvas(...ctx) {
    ctx.forEach((element) => element.classList.add(`visually-hidden`));
  }

  _showCanvas(...ctx) {
    ctx.forEach((element) => element.classList.remove(`visually-hidden`));
  }
}

export default StatsController;
