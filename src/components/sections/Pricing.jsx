import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'
import { buildWaLink } from '../ui/WhatsAppButton.jsx'

const packages = [
  {
    nameKey:    'pricing.sparsha_name',
    meaningKey: 'pricing.sparsha_meaning',
    priceKey:   'pricing.sparsha_price',
    usdKey:     'pricing.sparsha_usd',
    perKey:     'pricing.per_property',
    features:   [1,2,3,4,5].map((n) => `pricing.sparsha_f${n}`),
    featured:   false,
  },
  {
    nameKey:    'pricing.darshana_name',
    meaningKey: 'pricing.darshana_meaning',
    priceKey:   'pricing.darshana_price',
    usdKey:     'pricing.darshana_usd',
    perKey:     'pricing.per_property',
    features:   [1,2,3,4,5,6,7].map((n) => `pricing.darshana_f${n}`),
    featured:   true,
  },
  {
    nameKey:    'pricing.sampurna_name',
    meaningKey: 'pricing.sampurna_meaning',
    priceKey:   'pricing.sampurna_price',
    usdKey:     'pricing.sampurna_usd',
    perKey:     'pricing.per_project',
    features:   [1,2,3,4,5,6,7].map((n) => `pricing.sampurna_f${n}`),
    featured:   false,
  },
]

export default function Pricing() {
  const { t } = useTranslation()

  return (
    <section id="pricing" className="section bg-[var(--bg-2)]">
      <div className="wrap">
        <SectionHeading titleKey="pricing.title" subtitleKey="pricing.subtitle" />
        <p className="label text-[var(--text-3)] mb-12">{t('pricing.currency_note')}</p>

        {/* Editorial price list */}
        <div className="flex flex-col">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.nameKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, delay: i * 0.1 }}
              className="group"
            >
              {/* Main row */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-4 md:gap-16 py-10 border-b border-[var(--line)] hover:border-[var(--line-2)] transition-colors cursor-default">
                <div>
                  <div className="flex items-baseline gap-4 mb-2">
                    <h3 className="text-d3 font-display font-light text-[var(--text)]">
                      {t(pkg.nameKey)}
                    </h3>
                    <span className="label text-[var(--text-3)]">{t(pkg.meaningKey)}</span>
                    {pkg.featured && (
                      <span className="label text-[var(--text-2)] border-b border-[var(--line-2)]">
                        {t('pricing.most_popular')}
                      </span>
                    )}
                  </div>
                  {/* Features in a flowing inline list */}
                  <p className="text-xs text-[var(--text-3)] font-light leading-relaxed max-w-lg">
                    {pkg.features.map((fk) => t(fk)).join('  ·  ')}
                  </p>
                </div>

                <div className="flex items-end gap-4">
                  <div className="text-right">
                    <p className="font-display font-light text-3xl md:text-4xl text-[var(--text)] leading-none">
                      {t(pkg.priceKey)}
                    </p>
                    <p className="label text-[var(--text-3)] mt-1">
                      {t(pkg.usdKey)} · {t(pkg.perKey)}
                    </p>
                  </div>
                  <a
                    href={buildWaLink(`${t('contact.whatsapp_pretext')} I'm interested in the ${t(pkg.nameKey)} package.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label text-[var(--text-2)] hover:text-[var(--text)] transition-colors pb-px border-b border-[var(--line-2)] hover:border-[var(--text)] whitespace-nowrap"
                  >
                    {t('pricing.cta_start')} →
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-ons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-3"
        >
          <p className="label text-[var(--text-2)] col-span-full mb-2">{t('pricing.addons_title')}</p>
          {[1,2,3,4].map((n) => (
            <p key={n} className="text-xs text-[var(--text-3)] font-light flex items-start gap-3">
              <span className="text-[var(--text-3)] mt-0.5">—</span>
              {t(`pricing.addon${n}`)}
            </p>
          ))}
          <p className="col-span-full mt-6 text-xs text-[var(--text-3)] font-light">
            {t('pricing.custom_note')}{' '}
            <a
              href={buildWaLink(t('contact.whatsapp_pretext'))}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-2)] hover:text-[var(--text)] transition-colors"
            >
              {t('nav.contact')} →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
