import { boot } from 'quasar/wrappers';
import { date } from 'quasar';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: typeof filters;
  }
}

const filters = {
  //#region String Filter

  /**
   * Convert String To Upper Case
   * @param {string} str - Target string
   * @example hello | ToUpperCase => HELLO
   * @example Mr | ToUpperCase => MR
   */
  ToUpperCase(str: string) {
    return str.trim().toUpperCase();
  },

  /**
   * Convert String To Proper Case
   * @param {string} str - Target string
   * @example hello | ToProperCase => Hello
   * @example MR | ToProperCase => Mr
   */
  ToProperCase(str: string) {
    return str
      .trim()
      .toLowerCase()
      .replace(/\w\S*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
  },

  /**
   * Fomrat Date String
   * @param {string|number|Date} value - Target datetime
   * @param {string} format - Format string
   * @example "2020/04/10 00:00:00" | FormatDate('DD, MMM YYYY HH:ss') => 10, Apr 2020 00:00
   */
  FormatDate(value: string | number | Date, format: string) {
    return date.formatDate(value, format);
  },

  //#endregion

  //#region Number Filter

  /**
   * Convert Number to Digit
   * @param {number} value - Target number
   * @example 1000 | ToDigitNumber => 1,000
   * @example 10000 | ToDigitNumber => 10,000
   */
  ToDigitNumber(value: number) {
    return value.toLocaleString();
  },

  //#endregion

  /**
   * Convert Number to Price
   * @param {number} value - Target number
   * @example 1000 | ToDigitNumber => 1,000.00
   * @example 10000 | ToDigitNumber => 10,000.00
   */
  NumberToPrice(value: number, format = 2) {
    new Intl.NumberFormat('en-HK', {
      minimumFractionDigits: format,
      maximumFractionDigits: format,
    }).format(value);
  },
};

export default boot(({ app }) => {
  app.config.globalProperties.$filters = filters;
});
