import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { WORKS } from './works-data'
import './WorkDetail.css'

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function WorkDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const work = WORKS.find(w => w.slug === slug)

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (!work) {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'var(--green)', fontFamily: 'var(--font-en)', fontSize: 80, fontWeight: 900 }}>404</div>
          <Link to="/" style={{ color: 'var(--white)', fontFamily: 'var(--font-en)', fontSize: 14 }}>← BACK TO HOME</Link>
        </div>
      </div>
    )
  }

  const currentIndex = WORKS.findIndex(w => w.slug === slug)
  const prevWork = WORKS[currentIndex - 1] || null
  const nextWork = WORKS[currentIndex + 1] || null

  return (
    <div className="wd">

      {/* ── NAV ── */}
      <nav className="wd-nav">
        <Link to="/" className="wd-nav-logo">RH.</Link>
        <Link to="/" className="wd-back">← WORKS</Link>
      </nav>

      {/* ── HERO ── */}
      <header className={`wd-hero ${work.color === 'white' ? 'wd-hero-white' : 'wd-hero-black'}`}>
        <motion.div
          className="wd-hero-num"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {work.num}
        </motion.div>
        <div className="wd-hero-content">
          <motion.h1
            className="wd-hero-title"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {work.name}
          </motion.h1>
          <motion.p
            className="wd-hero-tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {work.tagline}
          </motion.p>
          <motion.div
            className="wd-hero-tags"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {work.tags.map(t => <span key={t} className="wd-tag">{t}</span>)}
            <span className={`wd-status ${work.status === 'live' ? 'wd-status-live' : 'wd-status-dev'}`}>
              {work.status === 'live' ? '● LIVE' : '◌ IN DEV'}
            </span>
          </motion.div>
          {work.link && (
            <motion.a
              href={work.link}
              target="_blank"
              rel="noreferrer"
              className="wd-hero-link"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              View App →
            </motion.a>
          )}
        </div>
      </header>

      {/* ── SCREENSHOT PLACEHOLDER ── */}
      <div className="wd-screenshot">
        <div className="wd-screenshot-inner">
          <span>SCREENSHOT / DEMO</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <main className="wd-body">

        {/* 課題 */}
        <FadeUp className="wd-section">
          <div className="wd-section-label">PROBLEM</div>
          <h2 className="wd-section-title">解決した課題</h2>
          <p className="wd-text">{work.problem}</p>
        </FadeUp>

        <div className="wd-rule" />

        {/* 解決策 */}
        <FadeUp className="wd-section">
          <div className="wd-section-label">SOLUTION</div>
          <h2 className="wd-section-title">アプローチ</h2>
          <p className="wd-text">{work.solution}</p>
        </FadeUp>

        <div className="wd-rule" />

        {/* 機能 */}
        <FadeUp className="wd-section">
          <div className="wd-section-label">FEATURES</div>
          <h2 className="wd-section-title">主な機能</h2>
          <div className="wd-features">
            {work.features.map((f, i) => (
              <FadeUp key={i} delay={i * 60} className="wd-feature-card">
                <div className="wd-feature-num">0{i + 1}</div>
                <div className="wd-feature-title">{f.title}</div>
                <p className="wd-feature-body">{f.body}</p>
              </FadeUp>
            ))}
          </div>
        </FadeUp>

        <div className="wd-rule" />

        {/* 技術スタック */}
        <FadeUp className="wd-section">
          <div className="wd-section-label">TECH STACK</div>
          <h2 className="wd-section-title">技術スタック</h2>
          <div className="wd-stack">
            {Object.entries(work.stack).map(([category, items]) => (
              <div key={category} className="wd-stack-group">
                <div className="wd-stack-category">{category}</div>
                <div className="wd-stack-items">
                  {items.map(item => (
                    <span key={item} className="wd-stack-item">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        <div className="wd-rule" />

        {/* 背景 */}
        <FadeUp className="wd-section">
          <div className="wd-section-label">BACKGROUND</div>
          <h2 className="wd-section-title">開発の背景</h2>
          <p className="wd-text">{work.background}</p>
        </FadeUp>

      </main>

      {/* ── NEXT / PREV ── */}
      <div className="wd-nav-works">
        {prevWork ? (
          <Link to={`/works/${prevWork.slug}`} className="wd-nav-work wd-nav-work-prev">
            <span className="wd-nav-work-dir">← PREV</span>
            <span className="wd-nav-work-num">{prevWork.num}</span>
            <span className="wd-nav-work-name">{prevWork.name}</span>
          </Link>
        ) : <div />}
        {nextWork ? (
          <Link to={`/works/${nextWork.slug}`} className="wd-nav-work wd-nav-work-next">
            <span className="wd-nav-work-dir">NEXT →</span>
            <span className="wd-nav-work-num">{nextWork.num}</span>
            <span className="wd-nav-work-name">{nextWork.name}</span>
          </Link>
        ) : <div />}
      </div>

      {/* ── FOOTER ── */}
      <footer className="wd-footer">
        <div className="wd-footer-logo">RH.</div>
        <div className="wd-footer-copy">© 2026 Ryo Hishinuma</div>
        <Link to="/" className="wd-footer-back">Back to Home ↗</Link>
      </footer>

    </div>
  )
}
