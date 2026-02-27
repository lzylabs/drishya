import { useTranslation } from 'react-i18next'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-2)]">
      <div className="wrap py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-display font-light text-xl text-[var(--text)] mb-2">Drishya</p>
            <p className="text-xs text-[var(--text-3)] font-light leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-[var(--text-3)]">{t('footer.services_title')}</h4>
            <ul className="flex flex-col gap-2">
              {['services.3d_title','services.vr_title','services.video_title'].map((k) => (
                <li key={k}>
                  <a href="#services" className="text-xs font-light text-[var(--text-2)] hover:text-[var(--text)] transition-colors">{t(k)}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-[var(--text-3)]">{t('footer.company_title')}</h4>
            <ul className="flex flex-col gap-2">
              {[['nav.portfolio','#portfolio'],['nav.process','#process'],['nav.pricing','#pricing'],['nav.contact','#contact']].map(([k,h]) => (
                <li key={k}>
                  <a href={h} className="text-xs font-light text-[var(--text-2)] hover:text-[var(--text)] transition-colors">{t(k)}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-[var(--text-3)]">{t('nav.contact')}</h4>
            <a
              href={buildWaLink(t('contact.whatsapp_pretext'))}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-light text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
            >
              {t('contact.direct_number')}
            </a>
            <p className="text-xs text-[var(--text-3)] font-light mt-2">India · Serving nationwide</p>
          </div>
        </div>

        <div className="rule mb-6" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-3)] font-light">© {year} Drishya. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors font-light">{t('footer.privacy')}</a>
            <a href="#" className="text-xs text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors font-light">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
