import { useI18n } from '../i18n/I18nContext'
import { waLink } from '../lib/whatsapp'

export default function WhatsAppFab() {
  const { t } = useI18n()
  return (
    <a
      href={waLink(t('common.whatsappMsg'))}
      target="_blank"
      rel="noopener"
      aria-label="WhatsApp"
      style={{
        position: 'fixed', right: 20, bottom: 20, zIndex: 50,
        width: 56, height: 56, borderRadius: '50%', background: 'var(--wa)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 26px rgba(37,211,102,.4)', color: '#fff',
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.94 1.34-.5.05-1.13.07-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-2.99 0-1.42.75-2.12 1.01-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.33.07.12.07.68-.17 1.36z"/>
      </svg>
    </a>
  )
}
