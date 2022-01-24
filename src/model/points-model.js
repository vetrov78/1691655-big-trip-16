import camelcaseKeys from 'camelcase-keys';
import dayjs from 'dayjs';
import { UpdateType } from '../const';

import AbstractObservable from '../utils/abstract-observable';

export default class PointsModel extends AbstractObservable {
  #apiService = null;
  #points = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;

    this.init();
  }

  get points() {
    return this.#points;
  }

  init = async () => {
    try {
      const points = await this.#apiService.points;
      this.#points = camelcaseKeys(points).map((point) => ({
        ...point,
        duration: dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'm'),
      }));
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  updatePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw Error ('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addPoint = (updateType, update) => {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  };

  deletePoint = (updateType, update) => {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw Error ('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}

