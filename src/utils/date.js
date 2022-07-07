import moment from "moment";
import { fixedZero } from "./string";

// time 为时间戳或者带时区的字符串 2022-01-09 14:17:39+08:00
export const formatToUTC0 = (time, format) => {
  return moment(time).utcOffset(0).format(format);
};

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === "today") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === "week") {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;
    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  const year = now.getFullYear();

  if (type === "month") {
    const month = now.getMonth();
    const nextDate = moment(now).add(1, "months");
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();
    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      ),
    ];
  }

  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}
