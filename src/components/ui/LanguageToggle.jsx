import { useTranslation } from 'react-i18next'
import useStore from '../../store/useStore.js'

export default function LanguageToggle({ className = '' }) {
  const { language, setLanguage } = useStore()
  const { i18n } = useTranslation()

  const toggle = (lang) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {[{ code: 'en', label: 'EN' }, { code: 'te', label: 'తె' }].map(({ code, label }) => (
        <button
          key={code}
          onClick={() => toggle(code)}
          aria-pressed={language === code}
          className={`label transition-colors cursor-pointer ${
            language === code ? 'text-[var(--text)]' : 'text-[var(--text-3)] hover:text-[var(--text-2)]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
