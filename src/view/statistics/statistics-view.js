import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import _ from 'lodash';
import { getDurationString } from '../../utils/utils';

import SmartView from '../smart-view';
import { createStatisticsTemplate } from './statistics.tpl';

const renderMoneyChart = (moneyCtx, moneyByType) => (
  new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: moneyByType.map((type) => type.type),
      datasets: [{
        data: moneyByType.map((type) => type.money),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);

const renderTypesCountChart = (typeCtx, countByType) => (
  new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: countByType.map((type) => type.type),
      datasets: [{
        data: countByType.map((type) => type.count),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);

const renderTypesTimeChart = (timeCtx, timeByType) => (
  new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: timeByType.map((type) => type.type),
      datasets: [{
        data: timeByType.map((type) => type.time),
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${getDurationString(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  })
);


export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typesChart = null;
  #timesChart = null;

  constructor(points) {
    super();

    this._data = points;
    this.#setCharts();
  }

  get template() {
    return createStatisticsTemplate(this._data);
  }

  #setCharts = () => {
    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    const moneyByType = _(this._data)
      .groupBy('type')
      .map((points, key) => ({
        'type': key,
        'money': _.sumBy(points, 'basePrice')
      }))
      .orderBy('money', 'desc')
      .value();

    const countByType = _(this._data)
      .groupBy('type')
      .map((points, key) => ({
        'type': key,
        'count': points.length,
      }))
      .orderBy('count', 'desc')
      .value();

    const timeByType = _(this._data)
      .groupBy('type')
      .map((points, key) => ({
        'type': key,
        'time': _.sumBy(points, 'duration')
      }))
      .orderBy('time', 'desc')
      .value();

    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * moneyByType.length;
    typeCtx.height = BAR_HEIGHT * countByType.length;
    timeCtx.height = BAR_HEIGHT * timeByType.length;

    this.#moneyChart = renderMoneyChart(moneyCtx, moneyByType);
    this.#typesChart = renderTypesCountChart(typeCtx, countByType);
    this.#timesChart = renderTypesTimeChart(timeCtx, timeByType);
  }
}
