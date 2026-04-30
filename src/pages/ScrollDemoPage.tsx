import { useEffect, useRef, useState } from "react"
import Lenis from "lenis"

const BTB_RED = "#D22630"

const HERO_IMG = "/images/DSC09949-Enhanced-NR.jpeg"
const SCALE_IMG = "/images/DSC03081-2.jpeg"
const PANEL_IMGS = [
  "/images/DSC02783.jpeg",
  "/images/IMG_8844.jpg",
  "/images/kickoff-2024-cover.jpg",
  "/images/IMG_0556_Original.jpg",
]
const STACK_IMGS = [
  "/images/DSC03081-2.jpeg",
  "/images/IMG_4697.jpeg",
  "/images/DSC02783.jpeg",
  "/images/DSC_0875.jpeg",
]
const MARQUEE_IMGS = [
  "/images/DSC09949-Enhanced-NR.jpeg",
  "/images/DSC03081-2.jpeg",
  "/images/IMG_8844.jpg",
  "/images/kickoff-2024-cover.jpg",
  "/images/DSC02783.jpeg",
  "/images/IMG_0556_Original.jpg",
]
const MANIFESTO_IMG = "/images/IMG_8844.jpg"

export function ScrollDemoPage() {
  const [loaded, setLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const [activePanel, setActivePanel] = useState(0)

  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  const heroImgRef = useRef<HTMLDivElement>(null)
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null)

  const scaleSectionRef = useRef<HTMLDivElement>(null)
  const scaleImgRef = useRef<HTMLDivElement>(null)
  const scaleTextRef = useRef<HTMLDivElement>(null)

  const numbersRef = useRef<HTMLElement>(null)
  const paraWordRef = useRef<HTMLDivElement>(null)

  const panelsSectionRef = useRef<HTMLDivElement>(null)
  const panelsTrackRef = useRef<HTMLDivElement>(null)
  const panelDotsWrapRef = useRef<HTMLDivElement>(null)
  const panelImgRefs = useRef<Array<HTMLDivElement | null>>([])

  const stackSectionRef = useRef<HTMLDivElement>(null)
  const stackCardRefs = useRef<Array<HTMLDivElement | null>>([])

  const hTrackRef = useRef<HTMLDivElement>(null)

  const maskSectionRef = useRef<HTMLElement>(null)
  const maskFillRef = useRef<HTMLHeadingElement>(null)

  // Loader
  useEffect(() => {
    let count = 0
    const tick = window.setInterval(() => {
      count += Math.floor(Math.random() * 12) + 4
      if (count >= 100) {
        count = 100
        window.clearInterval(tick)
      }
      setLoadPct(count)
    }, 60)
    const t = window.setTimeout(() => setLoaded(true), 1600)
    return () => {
      window.clearInterval(tick)
      window.clearTimeout(t)
    }
  }, [])

  // Lenis smooth scroll
  useEffect(() => {
    if (!loaded) return
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (isReducedMotion) return
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    })
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [loaded])

  // Custom cursor
  useEffect(() => {
    if (!loaded) return
    const isTouch = window.matchMedia("(hover: none)").matches
    if (isTouch) return
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0
    let raf = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + "px"
        cursorRef.current.style.top = my + "px"
      }
    }
    const loop = () => {
      rx += (mx - rx) * 0.14
      ry += (my - ry) * 0.14
      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = rx + "px"
        cursorRingRef.current.style.top = ry + "px"
      }
      raf = requestAnimationFrame(loop)
    }
    document.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      document.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [loaded])

  // Reveal observers
  useEffect(() => {
    if (!loaded) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            if (e.target.classList.contains("numbers-grid")) {
              e.target.querySelectorAll(".num-card").forEach((c, i) => {
                window.setTimeout(() => c.classList.add("in"), i * 100)
              })
            }
          }
        })
      },
      { threshold: 0.15 }
    )
    document
      .querySelectorAll(
        ".reveal, .numbers-eyebrow, .numbers-grid, .hscroll-label, .hscroll-title, .manifesto-sub, .cta-eyebrow, .cta-title, .cta-btns, .scale-eyebrow, .scale-headline, .scale-body, .stack-eyebrow, .stack-title"
      )
      .forEach((el) => observer.observe(el))

    const manifestoObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.querySelectorAll(".manifesto-word").forEach((w, i) => {
            window.setTimeout(() => w.classList.add("in"), i * 60)
          })
          manifestoObs.unobserve(e.target)
        })
      },
      { threshold: 0.3 }
    )
    document.querySelectorAll(".manifesto-inner").forEach((el) => manifestoObs.observe(el))

    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const el = e.target as HTMLElement
          const target = +(el.dataset.target || "0")
          const suffix = el.dataset.suffix || ""
          const dur = 2000
          const start = performance.now()
          const run = (now: number) => {
            const pct = Math.min((now - start) / dur, 1)
            const ease = 1 - Math.pow(1 - pct, 3)
            el.textContent = Math.floor(ease * target).toString() + suffix
            if (pct < 1) requestAnimationFrame(run)
            else el.textContent = target.toString() + suffix
          }
          requestAnimationFrame(run)
          counterObs.unobserve(el)
        })
      },
      { threshold: 0.5 }
    )
    document.querySelectorAll("[data-target]").forEach((el) => counterObs.observe(el))

    return () => {
      observer.disconnect()
      manifestoObs.disconnect()
      counterObs.disconnect()
    }
  }, [loaded])

  // Scroll-driven effects
  useEffect(() => {
    if (!loaded) return
    const PANEL_COUNT = 4

    const onScroll = () => {
      const sy = window.scrollY

      if (heroImgRef.current) {
        const k = Math.min(sy / window.innerHeight, 1)
        heroImgRef.current.style.transform = `scale(${1 + k * 0.12}) translateY(${k * 60}px)`
      }
      if (heroHeadlineRef.current) {
        const k = Math.min(sy / window.innerHeight, 1)
        heroHeadlineRef.current.style.transform = `translateY(${-k * 80}px)`
        heroHeadlineRef.current.style.opacity = `${1 - k * 0.6}`
      }

      if (paraWordRef.current && numbersRef.current) {
        const rect = numbersRef.current.getBoundingClientRect()
        const pct = -rect.top / numbersRef.current.offsetHeight
        paraWordRef.current.style.transform = `translateY(calc(-50% + ${pct * 100}px))`
      }

      if (scaleSectionRef.current && scaleImgRef.current && scaleTextRef.current) {
        const rect = scaleSectionRef.current.getBoundingClientRect()
        const total = scaleSectionRef.current.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        const pct = Math.max(0, Math.min(1, scrolled / total))
        const scaleK = pct < 0.5 ? pct / 0.5 : 1
        const finalScale = 1 + scaleK * 1.3
        const radius = (1 - scaleK) * 24
        scaleImgRef.current.style.transform = `scale(${finalScale})`
        scaleImgRef.current.style.borderRadius = `${radius}px`
        const textOpacity = pct < 0.5 ? 1 : Math.max(0, 1 - (pct - 0.5) * 2)
        scaleTextRef.current.style.opacity = textOpacity.toString()
        scaleTextRef.current.style.transform = `translateY(${(pct - 0.5) * 60}px)`
      }

      if (panelsSectionRef.current && panelsTrackRef.current && panelDotsWrapRef.current) {
        const rect = panelsSectionRef.current.getBoundingClientRect()
        const total = panelsSectionRef.current.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        if (scrolled < 0 || scrolled > total) {
          panelDotsWrapRef.current.style.opacity = "0"
        } else {
          panelDotsWrapRef.current.style.opacity = "1"
          const pct = scrolled / total
          panelsTrackRef.current.style.transform = `translateX(-${pct * (PANEL_COUNT - 1) * 100}vw)`
          panelImgRefs.current.forEach((img, i) => {
            if (!img) return
            const localPct = pct * (PANEL_COUNT - 1) - i
            img.style.transform = `scale(1.15) translateX(${localPct * -8}vw)`
          })
          setActivePanel(Math.round(pct * (PANEL_COUNT - 1)))
        }
      }

      if (stackSectionRef.current) {
        const rect = stackSectionRef.current.getBoundingClientRect()
        const total = stackSectionRef.current.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        const pct = Math.max(0, Math.min(1, scrolled / total))
        stackCardRefs.current.forEach((card, i) => {
          if (!card) return
          const cardCount = stackCardRefs.current.length
          const cardProgress = pct * cardCount
          const cardLocal = cardProgress - i
          if (cardLocal > 1) {
            const out = Math.min(cardLocal - 1, 1)
            card.style.transform = `translateY(${-out * 60}px) scale(${1 - out * 0.05})`
            card.style.opacity = `${1 - out * 0.4}`
          } else {
            card.style.transform = "translateY(0) scale(1)"
            card.style.opacity = "1"
          }
        })
      }

      if (maskSectionRef.current && maskFillRef.current) {
        const rect = maskSectionRef.current.getBoundingClientRect()
        const vh = window.innerHeight
        const enter = vh - rect.top
        const total = rect.height + vh
        const pct = Math.max(0, Math.min(1, enter / total))
        const k = Math.max(0, Math.min(1, (pct - 0.2) / 0.5))
        maskFillRef.current.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [loaded])

  // Draggable horizontal cards
  useEffect(() => {
    if (!loaded || !hTrackRef.current) return
    const track = hTrackRef.current
    let isDown = false
    let startX = 0
    let scrollLeft = 0
    const onDown = (e: MouseEvent) => {
      isDown = true
      track.classList.add("grabbing")
      startX = e.pageX - track.offsetLeft
      scrollLeft = track.scrollLeft
    }
    const stop = () => {
      isDown = false
      track.classList.remove("grabbing")
    }
    const onMove = (e: MouseEvent) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - track.offsetLeft
      const walk = (x - startX) * 1.5
      track.scrollLeft = scrollLeft - walk
    }
    track.addEventListener("mousedown", onDown)
    track.addEventListener("mouseleave", stop)
    track.addEventListener("mouseup", stop)
    track.addEventListener("mousemove", onMove)
    return () => {
      track.removeEventListener("mousedown", onDown)
      track.removeEventListener("mouseleave", stop)
      track.removeEventListener("mouseup", stop)
      track.removeEventListener("mousemove", onMove)
    }
  }, [loaded])

  // Magnetic buttons
  useEffect(() => {
    if (!loaded) return
    const btns = Array.from(document.querySelectorAll<HTMLButtonElement>(".btn-mag"))
    const handlers: Array<() => void> = []
    btns.forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = (e.clientX - cx) * 0.35
        const dy = (e.clientY - cy) * 0.35
        btn.style.transform = `translate(${dx}px, ${dy}px)`
      }
      const onLeave = () => {
        btn.style.transform = ""
        btn.style.transition = "transform 0.5s cubic-bezier(0.16,1,0.3,1)"
        window.setTimeout(() => (btn.style.transition = ""), 500)
      }
      btn.addEventListener("mousemove", onMove)
      btn.addEventListener("mouseleave", onLeave)
      handlers.push(() => {
        btn.removeEventListener("mousemove", onMove)
        btn.removeEventListener("mouseleave", onLeave)
      })
    })
    return () => handlers.forEach((h) => h())
  }, [loaded])

  return (
    <div className="scroll-demo-root">
      <style>{styles}</style>

      {!loaded && (
        <div id="loader">
          <div className="loader-logo">
            BTB<span style={{ color: BTB_RED }}>.</span>
          </div>
          <div className="loader-bar"><div className="loader-fill" /></div>
          <div className="loader-num">{loadPct}%</div>
        </div>
      )}

      <div ref={cursorRef} id="demo-cursor" />
      <div ref={cursorRingRef} id="demo-cursor-ring" />

      <nav className="demo-nav">
        <div className="nav-logo"><span className="nav-logo-mark">B</span> BTB DEMO</div>
        <div className="nav-links">
          <a href="#hero">Hero</a>
          <a href="#scale">Scale</a>
          <a href="#numbers">Numbers</a>
          <a href="#panels">Panels</a>
          <a href="#stack">Stack</a>
          <a href="#manifesto">Manifesto</a>
        </div>
      </nav>

      <section id="hero" className={loaded ? "hero-section in" : "hero-section"}>
        <div ref={heroImgRef} className="hero-img" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="hero-vignette" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-meta">
            <div className="hero-pill">EST. 2021 · LONG ISLAND, NY</div>
          </div>
          <h1 ref={heroHeadlineRef} className="hero-headline">
            <span className="word"><span>BE</span></span>{" "}
            <span className="word"><span>THE</span></span>{" "}
            <span className="word"><span className="red">BEST</span></span>
            <br />
            <span className="word"><span>LACROSSE</span></span>{" "}
            <span className="word"><span>CLUB</span></span>
          </h1>
          <div className="hero-sub">
            <p>23 Elite Teams · 400+ Players · 40+ Coaches</p>
            <div className="hero-cta">
              <button className="btn-mag"><span>Join The Program ▸</span></button>
              <button className="btn-outline">Explore Academy</button>
            </div>
          </div>
        </div>
        <div className="scroll-hint-wrap">
          <div className="scroll-hint">Scroll to explore</div>
        </div>
      </section>

      <div id="scale" ref={scaleSectionRef} className="scale-section">
        <div className="scale-inner">
          <div className="scale-grid">
            <div ref={scaleTextRef} className="scale-text">
              <div className="scale-eyebrow">▸ The Standard</div>
              <h2 className="scale-headline">
                We don't<br /><span style={{ color: BTB_RED }}>chase</span><br />talent.
              </h2>
              <p className="scale-body">
                We build it. Every player who walks through our doors gets the same thing — a system, a coach, a film room, and a standard. The rest is up to them.
              </p>
            </div>
            <div className="scale-img-wrap">
              <div ref={scaleImgRef} className="scale-img" style={{ backgroundImage: `url(${SCALE_IMG})` }} />
            </div>
          </div>
        </div>
      </div>

      <section id="numbers" ref={numbersRef}>
        <div ref={paraWordRef} className="para-word">BTB</div>
        <div className="numbers-eyebrow">The Numbers</div>
        <div className="numbers-grid">
          <div className="num-card">
            <div className="num-val" data-target="400" data-suffix="+">0</div>
            <div className="num-label">Active Players</div>
            <div className="num-sub">Boys + Girls combined</div>
          </div>
          <div className="num-card">
            <div className="num-val" data-target="23">0</div>
            <div className="num-label">Elite Teams</div>
            <div className="num-sub">Spring 2026 season</div>
          </div>
          <div className="num-card">
            <div className="num-val" data-target="40" data-suffix="+">0</div>
            <div className="num-label">Coaches</div>
            <div className="num-sub">Certified & dedicated</div>
          </div>
          <div className="num-card">
            <div className="num-val" data-target="12">0</div>
            <div className="num-label">D1 Commits</div>
            <div className="num-sub">This season alone</div>
          </div>
        </div>
      </section>

      <section ref={maskSectionRef} className="mask-section">
        <h2 className="mask-base">PRACTICE MAKES PERMANENT.</h2>
        <h2 ref={maskFillRef} className="mask-fill">PRACTICE MAKES PERMANENT.</h2>
      </section>

      <section className="img-marquee-section">
        <div className="img-marquee-wrap">
          <div className="img-marquee-track">
            {[...MARQUEE_IMGS, ...MARQUEE_IMGS].map((src, i) => (
              <div key={`m1-${i}`} className="img-marquee-item" style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        </div>
        <div className="img-marquee-wrap" style={{ marginTop: 16 }}>
          <div className="img-marquee-track reverse">
            {[...MARQUEE_IMGS.slice().reverse(), ...MARQUEE_IMGS.slice().reverse()].map((src, i) => (
              <div key={`m2-${i}`} className="img-marquee-item" style={{ backgroundImage: `url(${src})` }} />
            ))}
          </div>
        </div>
      </section>

      <div id="panels" ref={panelsSectionRef}>
        <div className="panels-spacer" />
        <div className="panels-sticky">
          <div ref={panelsTrackRef} className="panels-track">
            {[
              { num: "01", pill: "Player Development", title: "PLAYER", titleAccent: "IQ", text: "Every elite player has the same edge — they understand the game faster. We build decision-makers, not just athletes.", img: PANEL_IMGS[0] },
              { num: "02", pill: "Film Study", title: "125 HRS", titleAccent: "FILM", text: "Curated clips from D1 programs and the PLL. Every play annotated with coaching intent.", img: PANEL_IMGS[1] },
              { num: "03", pill: "Team Systems", title: "BTB", titleAccent: "SYSTEM", text: "The exact offensive and defensive playbooks our teams run. Position assignments, coaching cues, and repetition drills.", img: PANEL_IMGS[2] },
              { num: "04", pill: "Operations", title: "BTB", titleAccent: "OS", text: "A full operating system — players, parents, coaches, events, tuition, alerts, and analytics. All in one platform.", img: PANEL_IMGS[3] },
            ].map((p, i) => (
              <div key={p.num} className="panel-item">
                <div
                  ref={(el) => {
                    panelImgRefs.current[i] = el
                  }}
                  className="panel-img"
                  style={{ backgroundImage: `url(${p.img})` }}
                />
                <div className="panel-overlay" />
                <div className="panel-num">{p.num}</div>
                <div className="panel-content">
                  <div className="panel-pill">{p.pill}</div>
                  <h2 className="panel-title">{p.title}<br /><span style={{ color: BTB_RED }}>{p.titleAccent}</span></h2>
                  <p className="panel-text">{p.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={panelDotsWrapRef} className="panel-progress">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pp-dot ${i === activePanel ? "active" : ""}`} />
        ))}
      </div>

      <div id="stack" ref={stackSectionRef} className="stack-section">
        <div className="stack-pin">
          <div className="stack-head">
            <div className="stack-eyebrow">▸ Built for Athletes</div>
            <h2 className="stack-title">FOUR<br /><em>PILLARS.</em></h2>
          </div>
          <div className="stack-cards">
            {[
              { t: "Player IQ", d: "Read defenses. Beat slides. Execute under pressure.", img: STACK_IMGS[0] },
              { t: "Film Library", d: "Hours of college and PLL footage. Annotated weekly.", img: STACK_IMGS[1] },
              { t: "Team Systems", d: "The exact playbooks our 23 teams run on the field.", img: STACK_IMGS[2] },
              { t: "BTB OS", d: "Roster, schedule, attendance, tuition — all connected.", img: STACK_IMGS[3] },
            ].map((c, i) => (
              <div
                key={c.t}
                ref={(el) => {
                  stackCardRefs.current[i] = el
                }}
                className="stack-card"
                style={{
                  zIndex: 10 + i,
                  top: `${10 + i * 8}px`,
                }}
              >
                <div className="stack-card-img" style={{ backgroundImage: `url(${c.img})` }} />
                <div className="stack-card-body">
                  <div className="stack-card-num">0{i + 1}</div>
                  <h3 className="stack-card-title">{c.t}</h3>
                  <p className="stack-card-desc">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="hscroll">
        <div className="hscroll-head">
          <div className="hscroll-label">▸ What we offer</div>
          <h2 className="hscroll-title">BUILT FOR<br /><em>ATHLETES</em></h2>
        </div>
        <div ref={hTrackRef} className="hscroll-track">
          {[
            { num: "01", tag: "Boys + Girls", title: "Elite Teams", desc: "23 teams across all age groups.", img: PANEL_IMGS[0] },
            { num: "02", tag: "Digital", title: "Player IQ", desc: "On-demand modules. Read defenses, beat slides.", img: STACK_IMGS[0] },
            { num: "03", tag: "Library", title: "Film Study", desc: "College and PLL footage, annotated weekly.", img: PANEL_IMGS[2] },
            { num: "04", tag: "Staff", title: "Coaching", desc: "40+ coaches. Former D1 players.", img: STACK_IMGS[3] },
            { num: "05", tag: "Recruiting", title: "D1 Pathway", desc: "Recruiting prep, profiles, exposure.", img: STACK_IMGS[1] },
            { num: "06", tag: "Platform", title: "BTB OS", desc: "Operating system for the whole club.", img: PANEL_IMGS[3] },
          ].map((c) => (
            <div className="hcard" key={c.num} style={{ backgroundImage: `url(${c.img})` }}>
              <div className="hcard-overlay" />
              <div className="hcard-num">{c.num}</div>
              <div className="hcard-tag">{c.tag}</div>
              <div className="hcard-body">
                <div className="hcard-title">{c.title}</div>
                <div className="hcard-desc">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="manifesto">
        <div className="manifesto-bg" style={{ backgroundImage: `url(${MANIFESTO_IMG})` }} />
        <div className="manifesto-overlay" />
        <div className="manifesto-inner">
          <div className="manifesto-line">
            <div className="manifesto-word"><span>OUR</span></div>
            <div className="manifesto-word"><span>CULTURE</span></div>
          </div>
          <div className="manifesto-line">
            <div className="manifesto-word"><span className="white">BUILT US.</span></div>
          </div>
          <div className="manifesto-sep" />
          <div className="manifesto-line">
            <div className="manifesto-word"><span>OUR</span></div>
            <div className="manifesto-word"><span>HARD</span></div>
            <div className="manifesto-word"><span className="white">WORK</span></div>
          </div>
          <div className="manifesto-line">
            <div className="manifesto-word"><span className="white">MADE US.</span></div>
          </div>
          <p className="manifesto-sub">
            Every rep. Every film session. Every early morning. This is what separates Long Island lacrosse from everywhere else.
          </p>
        </div>
      </section>

      <section id="marquee-section">
        <div className="marquee-wrap">
          <div className="marquee-track">
            {Array.from({ length: 2 }).flatMap((_, dup) =>
              ["BTB 2028 Black", "BTB 2031 Carnage", "BTB 2033 Renegades", "BTB 2034 Snipers", "BTB 2035 Bombers", "BTB 2030 Tidal Wave", "BTB 2032 Riptide"].map((t, i) => (
                <div key={`${dup}-${i}`} className={`marquee-item ${i % 2 === 1 ? "highlight" : ""}`}>
                  {t}<span className="marquee-dot" />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="marquee-wrap" style={{ marginTop: 16 }}>
          <div className="marquee-track reverse">
            {Array.from({ length: 2 }).flatMap((_, dup) =>
              ["BTB 2031 Cyclones", "BTB 2032 Grizzlies", "BTB 2034 Thunder", "BTB 2036 Dawgs", "BTB 2036 Avalanche", "Boys Futures", "Girls Futures"].map((t, i) => (
                <div key={`${dup}-r-${i}`} className={`marquee-item ${i % 3 === 2 ? "highlight" : ""}`}>
                  {t}<span className="marquee-dot" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section id="cta">
        <div className="cta-bg" />
        <div className="cta-eyebrow">Your Season Starts Now</div>
        <h2 className="cta-title">
          <div className="line"><span>YOU'VE GOT</span></div>
          <div className="line"><span>TWO <span style={{ color: BTB_RED }}>CHOICES.</span></span></div>
          <div className="line"><span>LIFT OR GET LIFTED.</span></div>
        </h2>
        <div className="cta-btns">
          <button className="btn-mag"><span>Join BTB Now ▸</span></button>
          <button className="btn-outline">Explore BTB OS</button>
        </div>
        <div className="cta-tagline">Be The Best Lacrosse Club · Long Island, NY · Est. 2021</div>
      </section>
    </div>
  )
}

const styles = `
.scroll-demo-root { background: #050505; color: #fff; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
.scroll-demo-root * { box-sizing: border-box; }
.scroll-demo-root img { display: block; max-width: 100%; }
.scroll-demo-root a { color: inherit; text-decoration: none; }
.scroll-demo-root :where(button) { font-family: inherit; border: 0; background: transparent; color: inherit; cursor: pointer; }

@media (hover: hover) {
  .scroll-demo-root, .scroll-demo-root :where(a, button, .btn-mag, .btn-outline, .hcard, .hscroll-track) { cursor: none; }
}

#demo-cursor {
  position: fixed; top: 0; left: 0; z-index: 9999;
  width: 12px; height: 12px;
  background: ${BTB_RED};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), background 0.3s;
  mix-blend-mode: difference;
}
#demo-cursor-ring {
  position: fixed; top: 0; left: 0; z-index: 9998;
  width: 40px; height: 40px;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s;
}
@media (hover: none) { #demo-cursor, #demo-cursor-ring { display: none; } }
.scroll-demo-root:has(a:hover) #demo-cursor,
.scroll-demo-root:has(button:hover) #demo-cursor { width: 48px; height: 48px; background: #fff; }
.scroll-demo-root:has(a:hover) #demo-cursor-ring,
.scroll-demo-root:has(button:hover) #demo-cursor-ring { opacity: 0; }

.demo-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 24px 48px;
  display: flex; align-items: center; justify-content: space-between;
  mix-blend-mode: difference;
}
.nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 0.06em; display: flex; align-items: center; gap: 10px; color: #fff; }
.nav-logo-mark { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: ${BTB_RED}; font-size: 16px; transform: skew(-8deg); }
.nav-links { display: flex; gap: 32px; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; }
.nav-links a { opacity: 0.6; transition: opacity 0.2s; }
.nav-links a:hover { opacity: 1; }
@media (max-width: 720px) { .nav-links { display: none; } .demo-nav { padding: 20px 24px; } }

#hero { height: 100vh; min-height: 700px; position: relative; overflow: hidden; background: #000; }
.hero-img {
  position: absolute; inset: -10%;
  background-size: cover; background-position: center;
  filter: brightness(0.5) contrast(1.05);
  will-change: transform;
}
.hero-vignette {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%),
              radial-gradient(ellipse at 30% 70%, rgba(210,38,48,0.25) 0%, transparent 60%);
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 80px 80px;
  -webkit-mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
          mask-image: radial-gradient(ellipse at center, black 20%, transparent 75%);
}
.hero-content {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: flex-end;
  padding: 0 48px 80px;
  z-index: 2;
}
@media (max-width: 720px) { .hero-content { padding: 0 24px 60px; } }
.hero-meta { margin-bottom: 32px; }
.hero-pill {
  display: inline-block;
  padding: 8px 20px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  text-transform: uppercase; color: ${BTB_RED};
  border: 1px solid rgba(210,38,48,0.4);
  background: rgba(210,38,48,0.08);
  backdrop-filter: blur(8px);
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s;
}
#hero.in .hero-pill { opacity: 1; transform: translateY(0); }
.hero-headline {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(80px, 14vw, 220px);
  line-height: 0.85;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  position: relative; z-index: 2;
  will-change: transform, opacity;
}
.hero-headline .word { display: inline-block; overflow: hidden; margin-right: 0.12em; }
.hero-headline .word > span {
  display: inline-block;
  transform: translateY(110%);
  opacity: 0;
  transition: transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.7s ease;
}
.hero-headline .word > span.red { color: ${BTB_RED}; }
#hero.in .hero-headline .word > span { transform: translateY(0); opacity: 1; }
#hero.in .hero-headline .word:nth-child(1) > span { transition-delay: 0.1s; }
#hero.in .hero-headline .word:nth-child(2) > span { transition-delay: 0.2s; }
#hero.in .hero-headline .word:nth-child(3) > span { transition-delay: 0.3s; }
#hero.in .hero-headline .word:nth-child(5) > span { transition-delay: 0.4s; }
#hero.in .hero-headline .word:nth-child(6) > span { transition-delay: 0.5s; }
.hero-sub {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 32px; flex-wrap: wrap; gap: 24px;
}
.hero-sub p {
  font-size: 13px; letter-spacing: 0.25em; color: rgba(255,255,255,0.55);
  text-transform: uppercase; font-weight: 500;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.7s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.7s;
}
#hero.in .hero-sub p { opacity: 1; transform: translateY(0); }
.hero-cta {
  display: flex; gap: 12px; align-items: center;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.9s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.9s;
}
#hero.in .hero-cta { opacity: 1; transform: translateY(0); }

.btn-mag {
  position: relative; overflow: hidden;
  padding: 16px 36px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
  background: ${BTB_RED}; color: #fff;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  transition: background 0.3s;
}
.btn-mag::after {
  content: ''; position: absolute; inset: 0;
  background: #fff; transform: translateY(101%);
  transition: transform 0.3s cubic-bezier(0.16,1,0.3,1);
}
.btn-mag:hover { color: #000; }
.btn-mag:hover::after { transform: translateY(0); }
.btn-mag > span { position: relative; z-index: 1; }

.btn-outline {
  padding: 16px 36px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
  background: transparent; color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.25);
  transition: color 0.3s, border-color 0.3s, background 0.3s;
  backdrop-filter: blur(8px);
}
.btn-outline:hover { color: #fff; border-color: #fff; background: rgba(255,255,255,0.05); }

.scroll-hint-wrap { position: absolute; bottom: 48px; right: 48px; z-index: 3; }
@media (max-width: 720px) { .scroll-hint-wrap { display: none; } }
.scroll-hint { display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: 0.2em; color: rgba(255,255,255,0.5); text-transform: uppercase; }
.scroll-hint::before {
  content: ''; width: 1px; height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.5));
  animation: demoScrollLine 2s ease infinite;
}
@keyframes demoScrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

.scale-section { position: relative; height: 250vh; background: #050505; }
.scale-inner {
  position: sticky; top: 0;
  height: 100vh; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.scale-grid {
  position: relative; z-index: 2;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: center;
  padding: 0 80px; width: 100%; max-width: 1400px;
}
@media (max-width: 960px) { .scale-grid { grid-template-columns: 1fr; gap: 40px; padding: 0 24px; } }
.scale-text { will-change: transform, opacity; }
.scale-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 24px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.scale-eyebrow.in { opacity: 1; transform: translateX(0); }
.scale-headline {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(56px, 8vw, 140px);
  line-height: 0.9; letter-spacing: 0.005em; text-transform: uppercase;
  margin-bottom: 24px;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s;
}
.scale-headline.in { opacity: 1; transform: translateY(0); }
.scale-body {
  font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.55);
  font-weight: 300; max-width: 480px;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s;
}
.scale-body.in { opacity: 1; transform: translateY(0); }
.scale-img-wrap {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  transform-origin: center;
}
.scale-img {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: brightness(0.85) contrast(1.05);
  will-change: transform, border-radius;
  transform-origin: center;
}
@media (max-width: 960px) {
  .scale-section { height: auto; }
  .scale-inner { position: relative; height: auto; padding: 100px 0; }
  .scale-img-wrap { aspect-ratio: 4/3; }
}

#numbers { padding: 160px 48px; position: relative; background: #050505; overflow: hidden; }
@media (max-width: 720px) { #numbers { padding: 100px 24px; } }
.numbers-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 80px;
  display: flex; align-items: center; gap: 12px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.numbers-eyebrow::before { content: ''; width: 32px; height: 2px; background: ${BTB_RED}; }
.numbers-eyebrow.in { opacity: 1; transform: translateX(0); }
.numbers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; position: relative; z-index: 2; }
@media (max-width: 960px) { .numbers-grid { grid-template-columns: repeat(2, 1fr); } }
.num-card {
  padding: 56px 40px;
  border: 1px solid rgba(255,255,255,0.06);
  position: relative; overflow: hidden;
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
}
.num-card.in { opacity: 1; transform: translateY(0); }
.num-card::before {
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0; height: 0;
  background: rgba(210,38,48,0.07);
  transition: height 0.4s cubic-bezier(0.16,1,0.3,1);
}
.num-card:hover::before { height: 100%; }
.num-card:hover { border-color: rgba(210,38,48,0.3); }
.num-val { font-family: 'Bebas Neue', sans-serif; font-size: clamp(64px, 8vw, 112px); color: ${BTB_RED}; line-height: 1; margin-bottom: 8px; letter-spacing: 0.005em; }
.num-label { font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.45); }
.num-sub { font-size: 13px; color: rgba(255,255,255,0.25); margin-top: 8px; font-weight: 300; }
.para-word {
  position: absolute; right: -80px; top: 50%; transform: translateY(-50%);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 32vw; color: rgba(255,255,255,0.018);
  letter-spacing: -0.04em; pointer-events: none; will-change: transform;
}

.mask-section { position: relative; padding: 120px 48px; background: #050505; }
@media (max-width: 720px) { .mask-section { padding: 80px 24px; } }
.mask-base, .mask-fill {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(56px, 11vw, 180px);
  line-height: 0.9; letter-spacing: 0.005em; text-transform: uppercase;
  margin: 0;
}
.mask-base { color: rgba(255,255,255,0.08); }
.mask-fill {
  position: absolute; top: 120px; left: 48px; right: 48px;
  color: #fff;
  clip-path: inset(0 100% 0 0);
  will-change: clip-path;
}
@media (max-width: 720px) { .mask-fill { top: 80px; left: 24px; right: 24px; } }

.img-marquee-section { padding: 60px 0 120px; background: #050505; overflow: hidden; }
.img-marquee-wrap { display: flex; overflow: hidden; }
.img-marquee-track {
  display: flex; gap: 16px; animation: demoMarquee 32s linear infinite;
  white-space: nowrap;
}
.img-marquee-track.reverse { animation-direction: reverse; animation-duration: 38s; }
.img-marquee-item {
  flex-shrink: 0;
  width: 360px; height: 240px;
  background-size: cover; background-position: center;
  filter: grayscale(0.3) brightness(0.85);
  transition: filter 0.4s ease, transform 0.4s ease;
}
.img-marquee-item:hover { filter: grayscale(0) brightness(1); transform: scale(1.02); }
@media (max-width: 720px) { .img-marquee-item { width: 240px; height: 180px; } }
@keyframes demoMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

#panels { position: relative; }
.panels-spacer { height: 400vh; }
.panels-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; margin-top: -400vh; display: flex; align-items: center; }
.panels-track { display: flex; width: 400vw; transition: none; }
.panel-item {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
  padding: 48px;
  flex-shrink: 0;
  position: relative; overflow: hidden;
}
.panel-img {
  position: absolute; inset: -8%;
  background-size: cover; background-position: center;
  will-change: transform;
}
.panel-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, rgba(210,38,48,0.3) 100%);
}
.panel-num { font-family: 'Bebas Neue', sans-serif; font-size: 22vw; color: rgba(255,255,255,0.06); position: absolute; right: -20px; bottom: -40px; line-height: 1; pointer-events: none; z-index: 1; }
.panel-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; }
.panel-pill {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.4);
  background: rgba(0,0,0,0.5); backdrop-filter: blur(8px);
  padding: 8px 20px; color: #fff; margin-bottom: 32px;
}
.panel-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(56px, 10vw, 140px);
  text-transform: uppercase; line-height: 0.9;
  text-align: center; margin-bottom: 24px;
  letter-spacing: 0.005em;
}
.panel-text { max-width: 600px; text-align: center; font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.7); font-weight: 300; }

.panel-progress {
  position: fixed; bottom: 48px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 8px; z-index: 50;
  opacity: 0; transition: opacity 0.3s ease;
}
.pp-dot { width: 24px; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.4s ease, width 0.4s cubic-bezier(0.16,1,0.3,1); }
.pp-dot.active { background: ${BTB_RED}; width: 48px; }

.stack-section { position: relative; height: 350vh; background: #050505; }
.stack-pin {
  position: sticky; top: 0;
  height: 100vh; overflow: hidden;
  padding: 80px 48px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: center;
}
@media (max-width: 960px) {
  .stack-section { height: auto; }
  .stack-pin { position: relative; height: auto; grid-template-columns: 1fr; padding: 80px 24px; gap: 40px; }
}
.stack-head { position: relative; z-index: 2; }
.stack-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 24px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.stack-eyebrow.in { opacity: 1; transform: translateX(0); }
.stack-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(56px, 10vw, 160px);
  line-height: 0.9; letter-spacing: 0.005em; text-transform: uppercase;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s;
}
.stack-title.in { opacity: 1; transform: translateY(0); }
.stack-title em { color: ${BTB_RED}; font-style: normal; }
.stack-cards {
  position: relative;
  height: 70vh;
  min-height: 480px;
}
@media (max-width: 960px) { .stack-cards { display: flex; flex-direction: column; gap: 16px; height: auto; min-height: 0; } }
.stack-card {
  position: absolute; left: 0; right: 0;
  height: 70vh; min-height: 480px;
  background: #0a0a0a;
  border: 1px solid rgba(255,255,255,0.08);
  display: grid; grid-template-rows: 60% 1fr;
  overflow: hidden;
  will-change: transform, opacity;
  transition: none;
  box-shadow: 0 40px 80px rgba(0,0,0,0.5);
}
@media (max-width: 960px) { .stack-card { position: relative; height: auto; min-height: 0; } }
.stack-card-img {
  background-size: cover; background-position: center;
  filter: brightness(0.9);
}
@media (max-width: 960px) { .stack-card-img { aspect-ratio: 16/9; } }
.stack-card-body { padding: 32px; display: flex; flex-direction: column; justify-content: flex-end; position: relative; }
.stack-card-num { position: absolute; top: 24px; right: 32px; font-family: 'Bebas Neue', sans-serif; font-size: 14px; letter-spacing: 0.3em; color: ${BTB_RED}; }
.stack-card-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(32px, 4vw, 56px); text-transform: uppercase; letter-spacing: 0.005em; line-height: 1; margin-bottom: 12px; }
.stack-card-desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.6; max-width: 460px; }

#hscroll { padding: 160px 0 0; position: relative; overflow: hidden; background: #050505; }
.hscroll-head { padding: 0 48px 80px; }
@media (max-width: 720px) { .hscroll-head { padding: 0 24px 60px; } #hscroll { padding-top: 100px; } }
.hscroll-label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 16px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.hscroll-label.in { opacity: 1; transform: translateX(0); }
.hscroll-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 9vw, 120px);
  text-transform: uppercase; line-height: 0.9;
  letter-spacing: 0.005em;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s;
}
.hscroll-title.in { opacity: 1; transform: translateY(0); }
.hscroll-title em { color: ${BTB_RED}; font-style: normal; }
.hscroll-track {
  display: flex; gap: 24px;
  padding: 0 48px 120px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
@media (max-width: 720px) { .hscroll-track { padding: 0 24px 80px; } }
.hscroll-track::-webkit-scrollbar { display: none; }
.hscroll-track.grabbing { cursor: grabbing; }
.hcard {
  flex-shrink: 0;
  width: clamp(280px, 28vw, 400px);
  aspect-ratio: 3/4;
  background-size: cover; background-position: center;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 32px;
  display: flex; flex-direction: column; justify-content: flex-end;
  position: relative; overflow: hidden;
  scroll-snap-align: start;
  transition: border-color 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1);
}
.hcard:hover { border-color: rgba(210,38,48,0.4); transform: translateY(-8px); }
.hcard-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%);
  transition: opacity 0.4s ease;
}
.hcard:hover .hcard-overlay { background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(210,38,48,0.4) 50%, rgba(0,0,0,0.2) 100%); }
.hcard-num { position: absolute; top: 24px; left: 32px; font-family: 'Bebas Neue', sans-serif; font-size: 11px; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); z-index: 2; }
.hcard-tag {
  position: absolute; top: 24px; right: 24px; z-index: 2;
  padding: 4px 12px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  background: rgba(210,38,48,0.8); color: #fff;
  backdrop-filter: blur(8px);
}
.hcard-body { position: relative; z-index: 2; }
.hcard-title { font-family: 'Bebas Neue', sans-serif; font-size: 32px; text-transform: uppercase; line-height: 1; margin-bottom: 8px; letter-spacing: 0.005em; }
.hcard-desc { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.6; }

#manifesto { padding: 200px 48px; position: relative; overflow: hidden; }
@media (max-width: 720px) { #manifesto { padding: 120px 24px; } }
.manifesto-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  filter: grayscale(0.5) brightness(0.4);
}
.manifesto-overlay { position: absolute; inset: 0; background: ${BTB_RED}; mix-blend-mode: multiply; }
.manifesto-inner { position: relative; z-index: 2; max-width: 1100px; }
.manifesto-line {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 9vw, 120px);
  text-transform: uppercase; line-height: 0.95;
  display: flex; flex-wrap: wrap; gap: 0.15em;
  letter-spacing: 0.005em;
}
.manifesto-word { display: inline-block; overflow: hidden; }
.manifesto-word > span {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
  color: rgba(0,0,0,0.85);
}
.manifesto-word > span.white { color: #fff; }
.manifesto-word.in > span { transform: translateY(0); }
.manifesto-sep { width: 100%; height: 1px; background: rgba(0,0,0,0.25); margin: 40px 0; }
.manifesto-sub {
  font-size: 16px; color: rgba(0,0,0,0.7);
  max-width: 480px; line-height: 1.7; font-weight: 300;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s;
}
.manifesto-sub.in { opacity: 1; transform: translateY(0); }

#marquee-section { padding: 120px 0; background: #050505; overflow: hidden; }
.marquee-wrap { position: relative; display: flex; overflow: hidden; }
.marquee-track {
  display: flex; gap: 0;
  animation: demoMarquee 22s linear infinite;
  white-space: nowrap;
}
.marquee-track.reverse { animation-direction: reverse; animation-duration: 27s; }
.marquee-item {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 0 40px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(28px, 4vw, 56px);
  letter-spacing: 0.02em; text-transform: uppercase;
  color: rgba(255,255,255,0.08);
}
.marquee-item.highlight { color: rgba(255,255,255,0.7); }
.marquee-dot { width: 8px; height: 8px; border-radius: 50%; background: ${BTB_RED}; flex-shrink: 0; }

#cta {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; text-align: center; padding: 48px;
  background: #050505; position: relative; overflow: hidden;
}
.cta-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(210,38,48,0.18) 0%, transparent 65%);
  animation: demoBreathe 4s ease infinite;
}
@keyframes demoBreathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.18); }
}
.cta-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.4em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 32px;
  position: relative; z-index: 1;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1);
}
.cta-eyebrow.in { opacity: 1; transform: translateY(0); }
.cta-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(64px, 13vw, 200px);
  text-transform: uppercase; line-height: 0.87;
  position: relative; z-index: 1; margin-bottom: 48px;
  letter-spacing: 0.005em;
}
.cta-title .line { display: flex; justify-content: center; overflow: hidden; }
.cta-title .line > span { display: block; transform: translateY(110%); transition: transform 1s cubic-bezier(0.16,1,0.3,1); }
.cta-title.in .line:nth-child(1) > span { transform: translateY(0); transition-delay: 0s; }
.cta-title.in .line:nth-child(2) > span { transform: translateY(0); transition-delay: 0.1s; }
.cta-title.in .line:nth-child(3) > span { transform: translateY(0); transition-delay: 0.2s; }
.cta-btns {
  display: flex; gap: 16px; position: relative; z-index: 1;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s;
  flex-wrap: wrap; justify-content: center;
}
.cta-btns.in { opacity: 1; transform: translateY(0); }
.cta-tagline { position: absolute; bottom: 48px; left: 0; right: 0; text-align: center; font-size: 11px; letter-spacing: 0.3em; color: rgba(255,255,255,0.15); text-transform: uppercase; }

#loader {
  position: fixed; inset: 0; background: #000; z-index: 9997;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 24px;
  animation: demoLoaderOut 0.6s cubic-bezier(0.16,1,0.3,1) 1.6s forwards;
}
@keyframes demoLoaderOut { to { opacity: 0; pointer-events: none; visibility: hidden; } }
.loader-logo { font-family: 'Bebas Neue', sans-serif; font-size: 72px; color: #fff; letter-spacing: 0.04em; }
.loader-bar { width: 200px; height: 2px; background: rgba(255,255,255,0.1); overflow: hidden; }
.loader-fill { height: 100%; background: ${BTB_RED}; animation: demoFill 1.4s cubic-bezier(0.16,1,0.3,1) forwards; }
@keyframes demoFill { from { width: 0%; } to { width: 100%; } }
.loader-num { font-family: 'Bebas Neue', sans-serif; font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 0.2em; }
`
