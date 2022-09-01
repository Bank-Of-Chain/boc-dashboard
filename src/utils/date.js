import moment from 'moment'

export const formatToUTC0 = (time, format) => {
  return moment(time).utcOffset(0).format(format)
}
