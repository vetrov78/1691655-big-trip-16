import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import SmartView from '../smart-view';
import { createStatisticsTemplate } from './site-statistics.tpl';

const renderMoneyChart = (moneyCtx) => new Chart(moneyCtx, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: ['TAXI', 'BUS', 'TRAIN', 'SHIP', 'FLIGHT', 'DRIVE'],
    datasets: [{
      data: [400, 300, 200, 160, 150, 100],
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
        formatter: () => '€ 15',
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
});

export default class StatisticsView extends SmartView {
  #moneyChart = null;

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
    // const typeCtx = document.querySelector('#type');
    // const timeCtx = document.querySelector('#time');

    // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * 5;
    // typeCtx.height = BAR_HEIGHT * 5;
    // timeCtx.height = BAR_HEIGHT * 5;

    this.#moneyChart = renderMoneyChart(moneyCtx);
  }
}
