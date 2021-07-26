import format from 'date-fns/format';
import DateFnsUtils from '@date-io/date-fns';

export default class DateFnsLocal extends DateFnsUtils {
  getCalendarHeaderText(date: any) {
    return format(date, 'yyyy MMM', { locale: this.locale });
  }
  getDatePickerHeaderText(date: any) {
    return format(date, 'MMMd日', { locale: this.locale });
  }
}
