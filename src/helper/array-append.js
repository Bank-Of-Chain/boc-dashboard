import moment from 'moment';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import { map } from 'lodash';

export const arrayAppendOfDay = (array = [], size, key = 'id', valueKey = 'value') => {
  const offset = 86400;
  const firstSecondToday = moment().startOf('day').valueOf() / 1000;
  const rs = [];
  for (var i = size - 1; i >= 0; i--) {
    const firstSecond = firstSecondToday - i * offset;
    const firstSecondNextDay = firstSecondToday - (i - 1) * offset;
    const todayItem = find(array, (item) => {
      return firstSecond < 1 * item[key] && 1 * item[key] < firstSecondNextDay;
    });

    if (isEmpty(todayItem)) {
      rs.push({
        [key]: firstSecond,
        [valueKey]: last(array)[valueKey],
      });
    } else {
      rs.push({
        ...todayItem,
        id: firstSecond,
      });
    }
  }
  return rs;
};

export const arrayAppendOfHour = (array = [], size, key = 'id', valueKey = 'value') => {
  const offset = 3600;
  const firstSecondToday = moment().startOf('hour').valueOf() / 1000;
  const rs = [];
  for (var i = size - 1; i >= 0; i--) {
    const firstSecond = firstSecondToday - i * offset;
    const firstSecondNextDay = firstSecondToday - (i - 1) * offset;
    const todayItem = find(array, (item) => {
      return firstSecond < 1 * item[key] && 1 * item[key] < firstSecondNextDay;
    });

    if (isEmpty(todayItem)) {
      rs.push({
        [key]: firstSecond,
        [valueKey]: last(array)[valueKey],
      });
    } else {
      rs.push({
        ...todayItem,
        id: firstSecond,
      });
    }
  }
  return rs;
};

export const usePreValue = (array, valueKey = 'value') => {
  let preValue = '';
  return map(array, (item) => {
    const value = item[valueKey];
    if (!value) {
      return {
        ...item,
        [valueKey]: preValue,
      };
    } else {
      preValue = value;
      return item;
    }
  });
};
