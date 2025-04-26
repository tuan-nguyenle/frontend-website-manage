import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const locales = [
  { code: 'gb-en', name: 'English', flag: '/images/flags/gb.svg' },
  { code: 'vi-vn', name: 'Vietnamese', flag: '/images/flags/vn.svg' },
  // { code: 'fr-fr', name: 'French', flag: '/images/flags/fr.svg' },
  // { code: 'de-de', name: 'German', flag: '/images/flags/de.svg' },
  // { code: 'es-es', name: 'Spanish', flag: '/images/flags/es.svg' },
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
