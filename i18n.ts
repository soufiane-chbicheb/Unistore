import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ar from './resources/js/translations/ar/common.json'
import fr from './resources/js/translations/fr/common.json'
import en from './resources/js/translations/en/common.json'
i18n.use(initReactI18next).init({
  resources: {
    fr: { common: fr },
    ar: { common: ar },
  },
   debug: false, 
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

export default i18n