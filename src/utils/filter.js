import { FilterType } from '../const';
import dayjs from 'dayjs';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(dayjs())),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isBefore(dayjs())),
};
