'use client'

export default function Logo({ light = false, size = 34 }) {
  const box = size
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <span
        style={{
          width: box, height: box, borderRadius: box * 0.29,
          background: 'var(--amber)', color: 'var(--charcoal)',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: box * 0.58, display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}
      >A</span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
        letterSpacing: '-0.01em', color: light ? '#fff' : 'var(--ink)',
      }}>Africode&nbsp;Studios</span>
    </span>
  )
}
