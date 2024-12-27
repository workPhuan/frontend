import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import cn from './cn.json'
import en from './en.json'
import ko from './ko.json'

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	globalInjection: true,
	messages: {cn,zh,en}
});

export default i18n;