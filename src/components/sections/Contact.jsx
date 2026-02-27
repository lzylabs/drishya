import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading.jsx'
import { buildWaLink, WHATSAPP_NUMBER } from '../ui/WhatsAppButton.jsx'

const schema = z.object({
  name:         z.string().min(2),
  phone:        z.string().min(10),
  city:         z.string().min(2),
  propertyType: z.string().min(1),
  package:      z.string().optional(),
  message:      z.string().optional(),
})

function sanitise(s = '') {
  return String(s).replace(/[<>&"'`]/g,'').trim().slice(0,400)
}

function buildMsg(data, t) {
  return [
    t('contact.whatsapp_pretext'), '',
    `👤 ${sanitise(data.name)}`,
    `📱 ${sanitise(data.phone)}`,
    `📍 ${sanitise(data.city)}`,
    `🏠 ${sanitise(data.propertyType)}`,
    data.package ? `📦 ${sanitise(data.package)}` : null,
    data.message  ? `💬 ${sanitise(data.message)}`  : null,
  ].filter(Boolean).join('\n')
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="label text-[var(--text-3)]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400/70 font-light mt-1">{error}</p>}
    </div>
  )
}

export default function Contact() {
  const { t } = useTranslation()
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = (data) => {
    window.open(buildWaLink(buildMsg(data, t)), '_blank', 'noopener,noreferrer')
  }

  const types    = t('contact.property_types', { returnObjects: true })
  const packages = t('contact.packages',       { returnObjects: true })

  return (
    <section id="contact" className="section bg-[var(--bg)]">
      <div className="wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — heading + info */}
          <div>
            <SectionHeading titleKey="contact.title" subtitleKey="contact.subtitle" className="mb-0" />
            <p className="text-sm text-[var(--text-2)] font-light leading-relaxed mt-10 max-w-xs">
              {t('contact.submit_note')}
            </p>
            <div className="mt-10">
              <p className="label text-[var(--text-3)] mb-3">{t('contact.direct_cta')}</p>
              <a
                href={buildWaLink(t('contact.whatsapp_pretext'))}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-light text-[var(--text)] hover:text-[var(--text-2)] transition-colors pb-px border-b border-[var(--line-2)] hover:border-[var(--text-2)]"
              >
                {t('contact.direct_number')}
              </a>
            </div>
          </div>

          {/* Right — form */}
          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Field label={t('contact.name_label')} error={errors.name?.message}>
                <input {...register('name')} placeholder={t('contact.name_placeholder')} className="input" autoComplete="name" />
              </Field>
              <Field label={t('contact.phone_label')} error={errors.phone?.message}>
                <input {...register('phone')} placeholder={t('contact.phone_placeholder')} className="input" type="tel" inputMode="tel" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Field label={t('contact.city_label')} error={errors.city?.message}>
                <input {...register('city')} placeholder={t('contact.city_placeholder')} className="input" />
              </Field>
              <Field label={t('contact.property_label')} error={errors.propertyType?.message}>
                <select {...register('propertyType')} className="input" defaultValue="">
                  <option value="" disabled>{t('contact.property_placeholder')}</option>
                  {Array.isArray(types) && types.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </Field>
            </div>
            <Field label={t('contact.package_label')}>
              <select {...register('package')} className="input" defaultValue="">
                <option value="" disabled>{t('contact.package_placeholder')}</option>
                {Array.isArray(packages) && packages.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </Field>
            <Field label={t('contact.message_label')}>
              <textarea {...register('message')} placeholder={t('contact.message_placeholder')} rows={4} className="input resize-none" />
            </Field>

            <button
              type="submit"
              className="self-start flex items-center gap-3 label text-[var(--text)] border-b border-[var(--line-2)] hover:border-[var(--text)] pb-px transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.82.734 5.469 2.018 7.775L0 32l8.476-2.006A15.935 15.935 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm7.28 20.347c-.4-.2-2.363-1.163-2.729-1.296-.367-.133-.634-.2-.9.2-.267.4-1.03 1.296-1.264 1.563-.233.267-.467.3-.867.1-.4-.2-1.69-.623-3.217-1.983-1.19-1.06-1.993-2.37-2.227-2.77-.233-.4-.025-.616.175-.815.18-.18.4-.467.6-.7.2-.233.267-.4.4-.666.133-.267.067-.5-.033-.7-.1-.2-.9-2.163-1.233-2.963-.327-.78-.66-.673-.9-.686l-.767-.013c-.267 0-.7.1-1.067.5s-1.4 1.367-1.4 3.33 1.433 3.863 1.633 4.13c.2.267 2.82 4.3 6.833 6.03.954.41 1.7.654 2.28.837.957.304 1.83.261 2.52.158.768-.114 2.363-.966 2.696-1.9.333-.933.333-1.733.233-1.9-.1-.167-.367-.267-.767-.467z"/>
              </svg>
              {t('contact.submit')}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
