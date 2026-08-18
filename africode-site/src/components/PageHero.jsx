export default function PageHero({ kicker, title, intro }) {
  return (
    <section style={{ background: 'var(--hero)', color: '#fff' }}>
      <div className="wrap" style={{ padding: '56px 24px 52px' }}>
        {kicker && <p style={{ color: 'var(--blue)', fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 12px' }}>{kicker}</p>}
        <h1 style={{ fontWeight: 800, fontSize: 'clamp(32px,5vw,52px)', margin: 0, color: '#fff', maxWidth: '18ch' }}>{title}</h1>
        {intro && <p style={{ color: 'var(--dark-muted)', fontSize: 'clamp(16px,2vw,19px)', maxWidth: '58ch', margin: '16px 0 0' }}>{intro}</p>}
      </div>
    </section>
  )
}
