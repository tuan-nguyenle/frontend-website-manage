import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const locales = [
  { code: 'gb-en', name: 'English', flag: '/public/images/flags/gb.svg' },
  { code: 'vi-vn', name: 'Vietnamese', flag: '/public/images/flags/vn.svg' },
  // { code: 'fr-fr', name: 'French', flag: '/public/images/flags/fr.svg' },
  // { code: 'de-de', name: 'German', flag: '/public/images/flags/de.svg' },
  // { code: 'es-es', name: 'Spanish', flag: '/public/images/flags/es.svg' },
]

const savedLocale = localStorage.getItem('locale')
const currentLocaleCode = ref(savedLocale || 'gb-en')

export function useLocale() {
  const { locale, availableLocales } = useI18n()
  const currentLocale = computed(
    () => locales.find((l) => l.code === currentLocaleCode.value) || locales[0],
  )

  const setLocale = (code: string) => {
    if (locales.some((l) => l.code === code)) {
      currentLocaleCode.value = code
      localStorage.setItem('locale', code)
      locale.value = availableLocales.includes(code) ? code : 'gb-en' // Fallback if locale unsupported
    }
  }

  return {
    locales,
    currentLocaleCode,
    currentLocale,
    setLocale,
  }
}
