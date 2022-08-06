import dayjs, { Dayjs } from 'dayjs';
import { StringKeyObject } from '@/ts-tokens/bootstrap';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(weekday);
// 设置国际化
dayjs.extend(localeData);
// 获取某个日期在年中第几周
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
// 让dayjs().format API 以支持更多模版
dayjs.extend(advancedFormat);

const localeMap: StringKeyObject = {
  // ar_EG:
  // az_AZ:
  // bg_BG:
  bn_BD: 'bn-bd',
  by_BY: 'be',
  // ca_ES:
  // cs_CZ:
  // da_DK:
  // de_DE:
  // el_GR:
  en_GB: 'en-gb',
  en_US: 'en',
  // es_ES:
  // et_EE:
  // fa_IR:
  // fi_FI:
  fr_BE: 'fr', // todo: dayjs has no fr_BE locale, use fr at present
  fr_CA: 'fr-ca',
  // fr_FR:
  // ga_IE:
  // gl_ES:
  // he_IL:
  // hi_IN:
  // hr_HR:
  // hu_HU:
  hy_AM: 'hy-am',
  // id_ID:
  // is_IS:
  // it_IT:
  // ja_JP:
  // ka_GE:
  // kk_KZ:
  // km_KH:
  kmr_IQ: 'ku',
  // kn_IN:
  // ko_KR:
  // ku_IQ: // previous ku in antd
  // lt_LT:
  // lv_LV:
  // mk_MK:
  // ml_IN:
  // mn_MN:
  // ms_MY:
  // nb_NO:
  // ne_NP:
  nl_BE: 'nl-be',
  // nl_NL:
  // pl_PL:
  pt_BR: 'pt-br',
  // pt_PT:
  // ro_RO:
  // ru_RU:
  // sk_SK:
  // sl_SI:
  // sr_RS:
  // sv_SE:
  // ta_IN:
  // th_TH:
  // tr_TR:
  // uk_UA:
  // ur_PK:
  // vi_VN:
  zh_CN: 'zh-cn',
  zh_HK: 'zh-hk',
  zh_TW: 'zh-tw'
};

const getLocale = (locale?: string) => {
  if (!locale) {
    return 'en';
  }
  const mapLocale = localeMap[locale];
  return mapLocale || locale.split('_')[0];
};

export const dayjsUtil = {
  addYear: (dayIns: Dayjs, diff: number) => dayIns.add(diff, 'year'),
  addMonth: (dayIns: Dayjs, diff: number) => dayIns.add(diff, 'month'),
  addDate: (dayIns: Dayjs, diff: number) => dayIns.add(diff, 'day'),
  setYear: (dayIns: Dayjs, year: number) => dayIns.year(year),
  setMonth: (dayIns: Dayjs, month: number) => dayIns.month(month),
  setDate: (dayIns: Dayjs, date: number) => dayIns.date(date),
  /**
   * 是否为闰年
   * @param year 年份
   */
  isLeapYear (year: number): boolean {
    let res = false;
    if (year % 100 == 0) {
      res = year % 400 == 0;
    } else {
      res = year % 4 == 0;
    }
    return res;
  },
  /**
   * 获取月份对应的天数
   * @param year 年份
   * @param month 月份（需加1）
   */
  getMonthDays (year: number, month: number): number {
    // 2月份如果是闰年则需要多加1天
    let month2 = 28 + (dayjsUtil.isLeapYear(year) ? 1 : 0);
    const monthDays = [31, month2, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return monthDays[month];
  },
  // get
  locale: {
    /**
     * 根据国籍语言获取该国星期的第一天，如中国：1，美国：0
     * @param lang
     */
    firstDayOfWeek (lang?: string): number {
      return dayjs().locale(getLocale(lang)).localeData().firstDayOfWeek();
    },
    /**
     * 根据国籍语言获取该国的星期名称，如中国：['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
     * @param lang
     */
    weekdays (lang?: string): string[] {
      return dayjs().locale(getLocale(lang)).localeData().weekdays();
    },
    /**
     * 根据国籍语言获取该国的星期名称极简简称，如中国：['日', '一', '二', '三', '四', '五', '六']
     * @param lang
     */
    weekdaysMin (lang?: string): string[] {
      console.log('wekkdaysMin', dayjs().locale(getLocale(lang)).locale(), getLocale(lang), lang);
      return dayjs().locale(getLocale(lang)).localeData().weekdaysMin();
    },
    /**
     * 根据国籍语言获取该国的月份名称，如中国：['一月', '二月', '三月', ...]
     * @param lang
     */
    months (lang: string): string[] {
      return dayjs().locale(getLocale(lang)).localeData().months();
    }
  }
};
