import { createI18n } from 'vue-i18n';
import chsLocale from './chs';
import enLocale from './en';
import { getLanguage } from '../utils';

const messages = {
	en: enLocale,
	chs: chsLocale
};

export const i18n = createI18n({
	legacy: false,
	locale: getLanguage() || 'chs', // set locale
	fallbackLocale: 'en', // set fallback locale
	messages
});

export default i18n;