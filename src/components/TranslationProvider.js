import React, { useState, useEffect} from 'react'
import { IntlProvider } from 'react-intl'
import commonTranslations from '/i18n/'

export const TranslationProvider = ({ translations = {}, children }) => {
	const [lang, setLang] = useState('en')

	const commonMessages = commonTranslations[lang] || commonTranslations['en']
	const providedMessages = translations[lang] || translations['en']

	useEffect(() => {
		const language = window.localStorage.getItem('language') || 'en'
		const supportedLanguages = ['en', 'ru', 'cn', 'in', 'ir'] // whitelist 

		if (language != 'en' && supportedLanguages.includes(language)) {
			setLang(language)
		}
		console.log('set lang', language)
		window.toggleLanguage = (val) => {
			if (!supportedLanguages.includes(val)) return false
      localStorage.setItem('language', val)
			setLang(val)
		}
	}, [])

	return (
		<IntlProvider
			locale={lang}
			messages={{ ...commonMessages, ...providedMessages }}
		>
			{children}
		</IntlProvider>
	)
}
