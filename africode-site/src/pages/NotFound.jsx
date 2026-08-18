import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="band">
      <div className="wrap" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1 style={{ fontSize: 64, margin: '0 0 12px' }}>404</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>That page doesn’t exist.</p>
        <Link to="/" className="btn btn-amber">Back home</Link>
      </div>
    </section>
  )
}
