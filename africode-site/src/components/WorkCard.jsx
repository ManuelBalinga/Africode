import { useI18n } from '../i18n/I18nContext'

const statusStyles = {
  live: { bg: 'rgba(37,211,102,.14)', color: '#1f9c4e', dot: '#25D366' },
  soon: { bg: 'rgba(55,138,221,.14)', color: 'var(--blue-strong)', dot: 'var(--blue)' },
  building: { bg: 'rgba(239,159,39,.16)', color: 'var(--amber-strong)', dot: 'var(--amber)' },
}

export default function WorkCard({ project }) {
  const { t } = useI18n()
  const s = statusStyles[project.status]
  const statusLabel = t(`work.${project.status === 'live' ? 'live' : project.status === 'soon' ? 'soon' : 'building'}`)

  return (
    <div style={{
      background: 'var(--surface)', border: '0.5px solid var(--hairline)', borderRadius: 'var(--radius)',
      padding: '26px 26px 22px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21 }}>{project.name}</span>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: '5px 11px', borderRadius: 999,
          display: 'inline-flex', alignItems: 'center', gap: 6, background: s.bg, color: s.color, whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />{statusLabel}
        </span>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 16px', flexGrow: 1 }}>{t(`work.${project.descKey}`)}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
        {project.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: 12, fontWeight: 600, color: 'var(--muted)',
            border: '0.5px solid var(--hairline)', padding: '5px 10px', borderRadius: 7,
          }}>{tag}</span>
        ))}
      </div>
      {project.url ? (
        <a href={project.url} target="_blank" rel="noopener noreferrer" style={{
          fontSize: 14, fontWeight: 600, color: 'var(--blue-strong)',
        }}>{t('work.visit')} ↗</a>
      ) : (
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted-2)' }}>{t('work.comingSoon')}</span>
      )}
    </div>
  )
}
