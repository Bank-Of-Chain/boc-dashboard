import moment from 'moment'

// time 为时间戳或者带时区的字符串 2022-01-09 14:17:39+08:00
export const formatToUTC0 = (time, format) => {
  return moment(time).utcOffset(0).format(format)
}
