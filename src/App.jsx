import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import './App.css'

/* ─── Data ─── */
const WORKS = [
  { id: 1, num: '01', name: 'カルテAI', desc: '音声録音・問診からAIがカルテを自動生成する医療向けWebアプリ。整形外科クリニックの診察を効率化。', tags: ['React', 'Claude AI', 'Supabase'], link: 'https://karte-ai-app.netlify.app' },
  { id: 2, num: '02', name: 'SOAP AI', desc: '音声入力からSOAP記録を自動生成するツール。理学療法士の記録業務を大幅に削減する。', tags: ['Python', 'LLM', '音声処理'], link: null },
  { id: 3, num: '03', name: 'X線角度計測', desc: 'X線画像から関節角度を自動計測するコンピュータービジョンツール。整形外科の診断補助として開発。', tags: ['Python', 'OpenCV', '医療画像'], link: null },
  { id: 4, num: '04', name: 'YOLO Training', desc: '医療画像のYOLOv8トレーニング環境。骨・関節のセグメンテーションモデルを構築。', tags: ['Python', 'YOLOv8', 'ML'], link: null },
  { id: 5, num: '05', name: 'DiffusionXray', desc: 'Few-Shot学習とDiffusionモデルによるX線ランドマーク検出。少ない学習データで高精度を実現。', tags: ['Python', 'Diffusion', 'CV'], link: null },
  { id: 6, num: '06', name: 'RTR App', desc: '理学療法士向け臨床評価・患者管理ツール。評価結果の記録と分析を効率化。', tags: ['React', 'Firebase'], link: null },
]

const SKILLS = [
  {
    title: 'AI / ML',
    items: ['Python', 'PyTorch', 'YOLOv8', 'Diffusion Models', 'scikit-learn', 'Claude API'],
  },
  {
    title: 'Medical Domain',
    items: ['整形外科 PT（10年）', 'X線・医療画像解析', '医療AI設計・実装', '臨床研究', '歩行分析'],
  },
  {
    title: 'Web / API',
    items: ['React / Next.js', 'FastAPI', 'Supabase', 'Firebase', 'Vite'],
  },
]

/* ─── Intro typewriter lines ─── */
// null = 空行（改行のみ）
// { text, marker } = テキストセグメント
const INTRO_LINES = [
  [{ text: 'すべては、' }],
  null,
  [{ text: '医療現場を変えるために', marker: true }, { text: '。' }],
  null,
  [{ text: 'AIで、' }, { text: 'カルテ作成', marker: true }, { text: 'の無駄をなくす。' }],
  [{ text: 'AIで、' }, { text: '診断支援', marker: true }, { text: 'を一瞬で構築する。' }],
  [{ text: 'AIで、' }, { text: '医師の時間', marker: true }, { text: 'を患者に返す。' }],
  null,
  [{ text: '菱沼 遼', marker: true }],
  [{ text: 'それは、あなたが会ったことのない、' }],
  [{ text: '医療AI エンジニア', marker: true }, { text: '。' }],
]

const WORKS_MARQUEE = '[Python]  [React]  [PyTorch]  [YOLOv8]  [FastAPI]  [Next.js]  [Supabase]  [Claude AI]  [医療AI]  [理学療法]  '
const SKILLS_MARQUEE = 'PT歴 10年+   /   AIプロジェクト 5+   /   医療AI実装 3件   /   論文 週10本   /   患者 1000人以上   '
const HERO_MARQUEE = '医療×AI  最前線のエンジニア  理学療法士  ×  AI開発  Ryo Hishinuma  PT × Dev  医療現場を変える  '
const HERO_BOTTOM = '無駄な医療書類にさようなら  →  AI for Medical  →  PT × Engineer  →  '

/* ─── Marquee ─── */
function Marquee({ text, className = '', itemClass = 'marquee-item-green', reverse = false }) {
  const doubled = text + text
  return (
    <div className="marquee-wrap">
      <div className={`marquee-track ${reverse ? 'marquee-track-reverse' : ''} ${className}`}>
        {[doubled, doubled].map((t, i) => (
          <span key={i} className={`marquee-item ${itemClass}`}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/* ─── FadeUp ─── */
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Marker text ─── */
function M({ children }) {
  return <span className="marker">{children}</span>
}

/* ─── Typewriter hook ─── */
function useTypewriterLines(lines, speed = 40) {
  // 全セグメントを flatten して累積文字位置を計算
  const segments = []
  let total = 0
  for (const line of lines) {
    if (!line) { total += 1; continue } // 空行 = 1カウント
    for (const seg of line) {
      segments.push({ ...seg, start: total })
      total += seg.text.length
    }
  }

  const [count, setCount] = useState(0)
  const [active, setActive] = useState(false)

  // IntersectionObserver でビューに入ったら開始
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!active || count >= total) return
    const t = setTimeout(() => setCount(c => c + 1), speed)
    return () => clearTimeout(t)
  }, [active, count, total, speed])

  // レンダリング用に lines を可視状態で返す
  let pos = 0
  const rendered = lines.map((line, li) => {
    if (!line) {
      const visible = count > pos
      pos += 1
      return { empty: true, visible, key: `empty-${li}` }
    }
    const segs = line.map((seg, si) => {
      const start = pos
      const end = pos + seg.text.length
      const chars = Math.max(0, Math.min(count - start, seg.text.length))
      pos += seg.text.length
      return { ...seg, visible: seg.text.slice(0, chars), key: `${li}-${si}` }
    })
    return { empty: false, segs, key: `line-${li}` }
  })

  const showCursor = count < total
  return { rendered, showCursor, ref }
}

/* ─── Nav ─── */
function Nav() {
  return (
    <nav className="nav">
      <div className="nav-logo">RH.</div>
      <div className="nav-links">
        <a href="#intro">About</a>
        <a href="#works">Works</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </div>
      <a href="#contact" className="nav-cta">お問い合わせ</a>
    </nav>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="hero">
      {/* 上部マーキーバー */}
      <div className="hero-top-bar">
        <Marquee text={HERO_MARQUEE} itemClass="marquee-item-green" />
      </div>

      {/* 斜めスライスエリア */}
      <div className="hero-slice">
        {/* 黒い三角（右下） */}
        <div className="hero-black-slice" />

        {/* 名前 — 左上（緑エリア） */}
        <motion.div
          className="hero-name"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <span className="hero-name-first">RYO</span>
          <span className="hero-name-last">HISHINUMA.</span>
        </motion.div>

        {/* 役割テキスト — 右下（黒エリア） */}
        <motion.div
          className="hero-role"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        >
          <p className="hero-role-title">理学療法士</p>
          <p className="hero-role-title">× AIエンジニア</p>
          <p className="hero-role-sub">医療現場の課題を<br />エンジニアリングで解決する</p>
          <a href="#intro" className="hero-role-cta">詳しく見る →</a>
        </motion.div>
      </div>

      {/* 下部バー */}
      <div className="hero-bottom-bar">
        <span className="hero-bottom-left">© 2026 Ryo Hishinuma</span>
        <div className="hero-bottom-right">
          <Marquee text={HERO_BOTTOM} itemClass="marquee-item-white" reverse />
        </div>
      </div>
    </section>
  )
}

/* ─── Intro ─── */
function Intro() {
  const { rendered, showCursor, ref } = useTypewriterLines(INTRO_LINES, 42)

  return (
    <section id="intro" className="intro" ref={ref}>
      <div className="intro-grid">
        <div className="intro-left">
          {rendered.map(line => {
            if (line.empty) return line.visible ? <br key={line.key} /> : null
            return (
              <p key={line.key}>
                {line.segs.map(seg =>
                  seg.marker
                    ? <M key={seg.key}>{seg.visible}</M>
                    : <span key={seg.key}>{seg.visible}</span>
                )}
                {/* カーソルを最後のセグメントが表示中の行に出す */}
                {showCursor && line.segs.some(s => s.visible.length > 0 && s.visible.length < s.text.length) && (
                  <span className="tw-cursor">|</span>
                )}
              </p>
            )
          })}
          {showCursor && (
            <span className="tw-cursor">|</span>
          )}
        </div>
        <FadeUp delay={200} className="intro-right">
          <p>整形外科クリニックで理学療法士として10年。</p>
          <p>リハビリ科の立ち上げから運営まで携わりながら、医療×テクノロジーのプロダクトを開発しています。</p>
          <p>臨床現場の課題をエンジニアリングで解決する。それが私のミッションです。</p>
        </FadeUp>
      </div>
    </section>
  )
}

/* ─── Works ─── */
function Works() {
  return (
    <section id="works" className="works">
      <div className="works-title">WORKS</div>

      <div className="works-grid">
        {WORKS.map((w, i) => {
          const isBlack = i % 2 === 0
          return (
            <FadeUp key={w.id} delay={i * 60}>
              <div className={`work-card ${isBlack ? 'work-card-black' : 'work-card-white'}`}>
                <div className="work-num">{w.num}</div>
                <div className="work-name">{w.name}</div>
                <p className="work-desc">{w.desc}</p>
                <div className="work-tags">
                  {w.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                {w.link
                  ? <a href={w.link} target="_blank" rel="noreferrer" className="work-link">View App →</a>
                  : <span className="work-link" style={{ opacity: 0.4 }}>開発中</span>
                }
              </div>
            </FadeUp>
          )
        })}
      </div>

      <div className="works-marquee-bar">
        <Marquee text={WORKS_MARQUEE} itemClass="marquee-item-green" />
      </div>
    </section>
  )
}

/* ─── Skills ─── */
function SkillCircle({ skill, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <motion.div
      ref={ref}
      className="skill-circle"
      initial={{ scale: 0, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="skill-circle-title">{skill.title}</div>
      {skill.items.map(item => (
        <div key={item} className="skill-circle-item">{item}</div>
      ))}
    </motion.div>
  )
}

function Skills() {
  return (
    <section id="skills" className="skills">
      <div className="skills-title">SKILLS</div>

      <div className="skills-circles">
        {SKILLS.map((s, i) => (
          <SkillCircle key={s.title} skill={s} delay={i * 0.15} />
        ))}
      </div>

      <div className="skills-marquee-bar">
        <Marquee text={SKILLS_MARQUEE} itemClass="marquee-item-green" />
      </div>
    </section>
  )
}

/* ─── Contact ─── */
function Contact() {
  const [status, setStatus] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('送信しました。ありがとうございます！')
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-title">LET&apos;S</div>
      <div className="contact-title">WORK</div>
      <div className="contact-title">TOGETHER.</div>

      <div className="contact-form-wrap">
        <p className="contact-lead">
          医療AIの開発・導入をお考えの方、<br />
          受託開発・コラボレーション・取材など、<br />
          お気軽にご連絡ください。
        </p>

        <div className="contact-box">
          {status ? (
            <p style={{ color: 'var(--green)', fontFamily: 'var(--font-ja)', fontSize: '16px' }}>{status}</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">お名前 *</label>
                <input className="form-input" type="text" required placeholder="山田 太郎" />
              </div>
              <div className="form-group">
                <label className="form-label">メールアドレス *</label>
                <input className="form-input" type="email" required placeholder="example@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">ご相談内容 *</label>
                <textarea className="form-textarea" required placeholder="医療AIの導入について相談したい..." />
              </div>
              <button type="submit" className="form-submit">送信する →</button>
            </form>
          )}
        </div>
      </div>

      <div className="contact-sns">
        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a href="https://x.com/footshake" target="_blank" rel="noreferrer">X (Twitter) ↗</a>
        <a href="https://note.com" target="_blank" rel="noreferrer">note ↗</a>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">RH.</div>
      <div className="footer-copy">© 2026 Ryo Hishinuma. All rights reserved.</div>
      <div className="footer-links">
        <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://x.com/footshake" target="_blank" rel="noreferrer">X</a>
        <a href="https://note.com" target="_blank" rel="noreferrer">note</a>
      </div>
    </footer>
  )
}

/* ─── Sticky CTA ─── */
function StickyCTA() {
  return (
    <div className="sticky-cta">
      <a href="#works" className="sticky-btn-black">実績を見る</a>
      <a href="#contact" className="sticky-btn-white">お問い合わせ</a>
    </div>
  )
}

/* ─── Section Nav Labels ─── */
function SectionNav() {
  const [section, setSection] = useState('HERO')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const sections = [
      { id: 'hero-sentinel', label: 'HERO', dark: false },
      { id: 'intro', label: 'ABOUT', dark: true },
      { id: 'works', label: 'WORKS', dark: false },
      { id: 'skills', label: 'SKILLS', dark: true },
      { id: 'contact', label: 'CONTACT', dark: false },
    ]

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const found = sections.find(s => s.id === entry.target.id)
            if (found) {
              setSection(found.label)
              setIsDark(found.dark)
            }
          }
        }
      },
      { threshold: 0.4 }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className={`section-nav ${isDark ? 'section-nav-dark' : 'section-nav-light'}`}>
      <span>RYO HISHINUMA</span>
      <span>{section}</span>
      <span>2026</span>
    </div>
  )
}

/* ─── App ─── */
export default function App() {
  return (
    <>
      <Nav />
      <div id="hero-sentinel" />
      <Hero />
      <Intro />
      <Works />
      <Skills />
      <Contact />
      <Footer />
      <StickyCTA />
      <SectionNav />
    </>
  )
}
