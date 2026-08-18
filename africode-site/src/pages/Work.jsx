import PageHero from '../components/PageHero'
import WorkCard from '../components/WorkCard'
import { useI18n } from '../i18n/I18nContext'
import { usePageMeta } from '../lib/usePageMeta'
import { projects } from '../data/projects'

export default function Work() {
  const { t } = useI18n()
  usePageMeta(t('seo.work.t'), t('seo.work.d'))
  return (
    <>
      <PageHero kicker={t('home.workKicker')} title={t('home.workH2')} intro={t('home.workIntro')} />
      <section className="band">
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }} className="work-grid">
            {projects.map((p) => <WorkCard key={p.name} project={p} />)}
          </div>
        </div>
      </section>
      <style>{`@media (max-width:860px){.work-grid{grid-template-columns:1fr!important;}}`}</style>
    </>
  )
}
