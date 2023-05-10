// === Utils === //
import moment from 'moment'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

export const appendDate = (array = [], valueKey = 'value', limit = 7) => {
  if (isEmpty(array)) return array
  const data = []
  for (let i = 0; i < limit; i++) {
    // Time ended yesterday
    const lastestMoment = array[0] ? moment(array[0].date) : moment().utcOffset(0).subtract(1, 'days')
    const date = lastestMoment.subtract(i, 'days').format('YYYY-MM-DD')
    const item = find(array, item => item.date === date) || {
      date,
      [valueKey]: undefined
    }
    data.push(item)
  }
  return data
}
