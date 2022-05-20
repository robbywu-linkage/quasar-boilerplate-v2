import { boot } from 'quasar/wrappers';
import { LocalStorage } from 'quasar';
import { createI18n } from 'vue-i18n';

import messages from 'src/i18n';

export const LANGUAGE = 'language';

/**
 * 可用於 vue file 判斷當前語系是哪個
 */
export const i18nKeys = { enUS: 'en-US', zhHK: 'zh-HK' };

const locale: string = LocalStorage.getItem(LANGUAGE) ?? i18nKeys.zhHK;

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  warnHtmlMessage: false,
  locale,
  messages: messages as any,
});

export default boot(({ app }) => {
  // Save to current locale
  LocalStorage.set(LANGUAGE, locale);

  // Set i18n instance on app
  app.use(i18n as any);
});
