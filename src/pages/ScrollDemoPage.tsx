import { useEffect, useRef, useState } from "react"

const BTB_RED = "#D22630"
const BTB_RED_DIM = "#a01e26"

export function ScrollDemoPage() {
  const [loaded, setLoaded] = useState(false)
  const [loadPct, setLoadPct] = useState(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const paraWordRef = useRef<HTMLDivElement>(null)
  const numbersRef = useRef<HTMLElement>(null)
  const panelsTrackRef = useRef<HTMLDivElement>(null)
  const panelsSectionRef = useRef<HTMLDivElement>(null)
  const panelDotsWrapRef = useRef<HTMLDivElement>(null)
  const hTrackRef = useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = useState(0)

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
    const t = window.setTimeout(() => setLoaded(true), 1400)
    return () => {
      window.clearInterval(tick)
      window.clearTimeout(t)
    }
  }, [])

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
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
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
      { threshold: 0.2 }
    )
    document
      .querySelectorAll(
        ".numbers-eyebrow, .numbers-grid, .hscroll-label, .hscroll-title, .manifesto-sub, .cta-eyebrow, .cta-title, .cta-btns"
      )
      .forEach((el) => observer.observe(el))

    const manifestoObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const words = e.target.querySelectorAll(".manifesto-word")
          words.forEach((w, i) => {
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
          const dur = 1800
          const start = performance.now()
          const run = (now: number) => {
            const pct = Math.min((now - start) / dur, 1)
            const ease = 1 - Math.pow(1 - pct, 3)
            el.textContent = Math.floor(ease * target).toString()
            if (pct < 1) requestAnimationFrame(run)
            else el.textContent = target.toString()
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

  useEffect(() => {
    if (!loaded) return
    const PANEL_COUNT = 4
    const onScroll = () => {
      if (paraWordRef.current && numbersRef.current) {
        const rect = numbersRef.current.getBoundingClientRect()
        const pct = -rect.top / numbersRef.current.offsetHeight
        paraWordRef.current.style.transform = `translateY(calc(-50% + ${pct * 80}px))`
      }
      if (panelsSectionRef.current && panelsTrackRef.current && panelDotsWrapRef.current) {
        const rect = panelsSectionRef.current.getBoundingClientRect()
        const total = panelsSectionRef.current.offsetHeight - window.innerHeight
        const scrolled = -rect.top
        if (scrolled < 0 || scrolled > total) {
          panelDotsWrapRef.current.style.opacity = "0"
          return
        }
        panelDotsWrapRef.current.style.opacity = "1"
        const pct = scrolled / total
        panelsTrackRef.current.style.transform = `translateX(-${pct * (PANEL_COUNT - 1) * 100}vw)`
        panelsTrackRef.current.style.transition = "none"
        setActivePanel(Math.round(pct * (PANEL_COUNT - 1)))
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [loaded])

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
    const onUpLeave = () => {
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
    track.addEventListener("mouseleave", onUpLeave)
    track.addEventListener("mouseup", onUpLeave)
    track.addEventListener("mousemove", onMove)
    return () => {
      track.removeEventListener("mousedown", onDown)
      track.removeEventListener("mouseleave", onUpLeave)
      track.removeEventListener("mouseup", onUpLeave)
      track.removeEventListener("mousemove", onMove)
    }
  }, [loaded])

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
          <div className="loader-bar">
            <div className="loader-fill" />
          </div>
          <div className="loader-num">{loadPct}%</div>
        </div>
      )}

      <div ref={cursorRef} id="demo-cursor" />
      <div ref={cursorRingRef} id="demo-cursor-ring" />

      <nav className="demo-nav">
        <div className="nav-logo">
          <span className="nav-logo-mark">B</span> BTB DEMO
        </div>
        <div className="nav-links">
          <a href="#hero">Hero</a>
          <a href="#numbers">Numbers</a>
          <a href="#panels">Panels</a>
          <a href="#hscroll">Cards</a>
          <a href="#manifesto">Manifesto</a>
          <a href="#cta">CTA</a>
        </div>
      </nav>

      <section id="hero" className={loaded ? "hero-section in" : "hero-section"}>
        <div className="hero-bg" />
        <div className="hero-grid" />
        <h1 className="hero-headline">
          <span className="word"><span>BE</span></span>{" "}
          <span className="word"><span>THE</span></span>{" "}
          <span className="word"><span className="red">BEST</span></span>
          <br />
          <span className="word"><span>LACROSSE</span></span>
          <br />
          <span className="word"><span>CLUB</span></span>
        </h1>
        <div className="hero-sub">
          <p>Long Island, NY · Est. 2021 · 23 Teams · 400+ Players</p>
          <div className="hero-cta">
            <button className="btn-mag"><span>Join The Program ▸</span></button>
            <button className="btn-outline">Explore Academy</button>
          </div>
        </div>
        <div className="scroll-hint-wrap">
          <div className="scroll-hint">Scroll to explore</div>
        </div>
      </section>

      <section id="numbers" ref={numbersRef}>
        <div className="para-word" ref={paraWordRef}>BTB</div>
        <div className="numbers-eyebrow">The Numbers</div>
        <div className="numbers-grid">
          <div className="num-card">
            <div className="num-val" data-target="400">0</div>
            <div className="num-label">Active Players</div>
            <div className="num-sub">Boys + Girls combined</div>
          </div>
          <div className="num-card">
            <div className="num-val" data-target="23">0</div>
            <div className="num-label">Elite Teams</div>
            <div className="num-sub">Spring 2026 season</div>
          </div>
          <div className="num-card">
            <div className="num-val" data-target="40">0</div>
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

      <div id="panels" ref={panelsSectionRef}>
        <div className="panels-spacer" />
        <div className="panels-sticky">
          <div className="panels-track" ref={panelsTrackRef}>
            <div className="panel-item" style={{ background: "#000" }}>
              <div className="panel-num">01</div>
              <div className="panel-pill">Player Development</div>
              <h2 className="panel-title">PLAYER<br /><span style={{ color: BTB_RED }}>IQ</span></h2>
              <p className="panel-text">Every elite player has the same edge — they understand the game faster. We build decision-makers, not just athletes.</p>
            </div>
            <div className="panel-item" style={{ background: "#080808" }}>
              <div className="panel-num">02</div>
              <div className="panel-pill">Film Study</div>
              <h2 className="panel-title">125 HRS<br /><span style={{ color: BTB_RED }}>FILM</span></h2>
              <p className="panel-text">Curated clips from D1 programs and the PLL. Every play annotated with coaching intent.</p>
            </div>
            <div className="panel-item" style={{ background: "#0d0000" }}>
              <div className="panel-num">03</div>
              <div className="panel-pill">Team Systems</div>
              <h2 className="panel-title">BTB<br /><span style={{ color: BTB_RED }}>SYSTEM</span></h2>
              <p className="panel-text">The exact offensive and defensive playbooks our teams run. Position assignments, coaching cues, and repetition drills.</p>
            </div>
            <div className="panel-item" style={{ background: "#0a0000" }}>
              <div className="panel-num">04</div>
              <div className="panel-pill">Operations</div>
              <h2 className="panel-title">BTB<br /><span style={{ color: BTB_RED }}>OS</span></h2>
              <p className="panel-text">A full operating system — players, parents, coaches, events, tuition, alerts, and analytics. All in one platform.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-progress" ref={panelDotsWrapRef}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`pp-dot ${i === activePanel ? "active" : ""}`} />
        ))}
      </div>

      <section id="hscroll">
        <div className="hscroll-head">
          <div className="hscroll-label">What we offer</div>
          <h2 className="hscroll-title">BUILT FOR<br /><em>ATHLETES</em></h2>
        </div>
        <div className="hscroll-track" ref={hTrackRef}>
          {[
            { num: "01", tag: "Boys + Girls", icon: "🥍", title: "Elite Teams", desc: "23 teams across all age groups. Competitive travel lacrosse for serious players." },
            { num: "02", tag: "Digital", icon: "🧠", title: "Player IQ", desc: "On-demand modules. Learn to read defenses, beat slides, and execute under pressure." },
            { num: "03", tag: "Library", icon: "🎥", title: "Film Study", desc: "Hours of college and PLL footage. Annotated, searchable, updated weekly." },
            { num: "04", tag: "Staff", icon: "🏆", title: "Coaching Staff", desc: "40+ dedicated coaches across all programs. Former D1 players and certified instructors." },
            { num: "05", tag: "Recruiting", icon: "🎓", title: "D1 Pathway", desc: "Recruiting prep modules, profile building, showcase strategy, and coach exposure." },
            { num: "06", tag: "Platform", icon: "⚡", title: "BTB OS", desc: "Our proprietary operating system. Attendance, tuition, alerts, scheduling — all connected." },
          ].map((c) => (
            <div className="hcard" key={c.num}>
              <div className="hcard-num">{c.num}</div>
              <div className="hcard-tag">{c.tag}</div>
              <div className="hcard-icon">{c.icon}</div>
              <div className="hcard-title">{c.title}</div>
              <div className="hcard-desc">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="manifesto">
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
              [
                "BTB 2028 Black",
                "BTB 2031 Carnage",
                "BTB 2033 Renegades",
                "BTB 2034 Snipers",
                "BTB 2035 Bombers",
                "BTB 2030 Tidal Wave",
                "BTB 2032 Riptide",
              ].map((t, i) => (
                <div key={`${dup}-${i}`} className={`marquee-item ${i % 2 === 1 ? "highlight" : ""}`}>
                  {t}
                  <span className="marquee-dot" />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="marquee-wrap" style={{ marginTop: 16 }}>
          <div className="marquee-track reverse">
            {Array.from({ length: 2 }).flatMap((_, dup) =>
              [
                "BTB 2031 Cyclones",
                "BTB 2032 Grizzlies",
                "BTB 2034 Thunder",
                "BTB 2036 Dawgs",
                "BTB 2036 Avalanche",
                "Boys Futures",
                "Girls Futures",
              ].map((t, i) => (
                <div key={`${dup}-r-${i}`} className={`marquee-item ${i % 3 === 2 ? "highlight" : ""}`}>
                  {t}
                  <span className="marquee-dot" />
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
          <div className="line">
            <span>
              TWO <span style={{ color: BTB_RED }}>CHOICES.</span>
            </span>
          </div>
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
.scroll-demo-root { background: #000; color: #fff; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
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
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s;
  mix-blend-mode: difference;
}
#demo-cursor-ring {
  position: fixed; top: 0; left: 0; z-index: 9998;
  width: 40px; height: 40px;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
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
.nav-logo {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 22px; letter-spacing: 0.06em;
  display: flex; align-items: center; gap: 10px;
  color: #fff;
}
.nav-logo-mark {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  background: ${BTB_RED};
  font-size: 16px;
  transform: skew(-8deg);
}
.nav-links { display: flex; gap: 32px; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #fff; }
.nav-links a { opacity: 0.6; transition: opacity 0.2s; }
.nav-links a:hover { opacity: 1; }
@media (max-width: 720px) { .nav-links { display: none; } .demo-nav { padding: 20px 24px; } }

#hero {
  height: 100vh;
  display: flex; flex-direction: column;
  justify-content: flex-end; padding: 0 48px 80px;
  position: relative; overflow: hidden;
  background: #000;
}
@media (max-width: 720px) { #hero { padding: 0 24px 60px; } }
.hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 30% 60%, rgba(210,38,48,0.18) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 20%, rgba(210,38,48,0.08) 0%, transparent 40%);
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
}
.hero-headline {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(80px, 14vw, 200px);
  line-height: 0.88;
  letter-spacing: 0.005em;
  text-transform: uppercase;
  position: relative; z-index: 2;
}
.hero-headline .word {
  display: inline-block;
  overflow: hidden;
  margin-right: 0.12em;
}
.hero-headline .word > span {
  display: inline-block;
  transform: translateY(110%);
  opacity: 0;
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
}
.hero-headline .word > span.red { color: ${BTB_RED}; }
#hero.in .hero-headline .word > span { transform: translateY(0); opacity: 1; }
#hero.in .hero-headline .word:nth-child(1) > span { transition-delay: 0s; }
#hero.in .hero-headline .word:nth-child(2) > span { transition-delay: 0.09s; }
#hero.in .hero-headline .word:nth-child(3) > span { transition-delay: 0.18s; }
#hero.in .hero-headline .word:nth-child(5) > span { transition-delay: 0.27s; }
#hero.in .hero-headline .word:nth-child(7) > span { transition-delay: 0.36s; }

.hero-sub {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 32px; position: relative; z-index: 2;
  flex-wrap: wrap; gap: 24px;
}
.hero-sub p {
  font-size: 14px; letter-spacing: 0.2em; color: rgba(255,255,255,0.5);
  text-transform: uppercase; font-weight: 500;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.6s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s;
}
#hero.in .hero-sub p { opacity: 1; transform: translateY(0); }
.hero-cta {
  display: flex; gap: 12px; align-items: center;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.8s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
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
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.btn-mag:hover { color: #000; }
.btn-mag:hover::after { transform: translateY(0); }
.btn-mag > span { position: relative; z-index: 1; }

.btn-outline {
  padding: 16px 36px;
  font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
  background: transparent; color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.2);
  transition: color 0.3s, border-color 0.3s;
}
.btn-outline:hover { color: #fff; border-color: #fff; }

.scroll-hint-wrap { position: absolute; bottom: 48px; left: 48px; }
.scroll-hint { display: flex; align-items: center; gap: 8px; font-size: 11px; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); text-transform: uppercase; }
.scroll-hint::before { content: ''; width: 1px; height: 40px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3)); animation: demoScrollLine 2s ease infinite; }
@keyframes demoScrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

#numbers { padding: 160px 48px; position: relative; background: #000; overflow: hidden; }
@media (max-width: 720px) { #numbers { padding: 100px 24px; } }
.numbers-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 80px;
  display: flex; align-items: center; gap: 12px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.numbers-eyebrow::before { content: ''; width: 32px; height: 2px; background: ${BTB_RED}; }
.numbers-eyebrow.in { opacity: 1; transform: translateX(0); }

.numbers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
@media (max-width: 960px) { .numbers-grid { grid-template-columns: repeat(2, 1fr); } }
.num-card {
  padding: 56px 40px;
  border: 1px solid rgba(255,255,255,0.06);
  position: relative; overflow: hidden;
  opacity: 0; transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
}
.num-card.in { opacity: 1; transform: translateY(0); }
.num-card::before {
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0; height: 0;
  background: rgba(210,38,48,0.07);
  transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.num-card:hover::before { height: 100%; }
.num-card:hover { border-color: rgba(210,38,48,0.3); }
.num-val { font-family: 'Bebas Neue', sans-serif; font-size: clamp(56px, 7vw, 96px); color: ${BTB_RED}; line-height: 1; margin-bottom: 8px; letter-spacing: 0.005em; }
.num-label { font-size: 11px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
.num-sub { font-size: 13px; color: rgba(255,255,255,0.2); margin-top: 8px; font-weight: 300; }

.para-word {
  position: absolute; right: -80px; top: 50%; transform: translateY(-50%);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 30vw; color: rgba(255,255,255,0.015);
  letter-spacing: -0.04em; pointer-events: none; will-change: transform;
}

#panels { position: relative; }
.panels-spacer { height: 300vh; }
.panels-sticky {
  position: sticky; top: 0;
  height: 100vh; overflow: hidden;
  display: flex; align-items: center;
  margin-top: -300vh;
}
.panels-track { display: flex; width: 400vw; transition: none; }
.panel-item {
  width: 100vw; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
  padding: 48px;
  flex-shrink: 0;
  position: relative; overflow: hidden;
}
.panel-num { font-family: 'Bebas Neue', sans-serif; font-size: 20vw; color: rgba(255,255,255,0.04); position: absolute; right: -20px; bottom: -40px; line-height: 1; pointer-events: none; }
.panel-pill {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  text-transform: uppercase;
  border: 1px solid rgba(210,38,48,0.4);
  padding: 8px 20px; color: ${BTB_RED}; margin-bottom: 32px;
}
.panel-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(56px, 9vw, 120px);
  text-transform: uppercase; line-height: 0.9;
  text-align: center; margin-bottom: 24px;
  letter-spacing: 0.005em;
}
.panel-text { max-width: 600px; text-align: center; font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.5); font-weight: 300; }

.panel-progress {
  position: fixed; bottom: 48px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 8px; z-index: 50;
  opacity: 0; transition: opacity 0.3s ease;
}
.pp-dot { width: 24px; height: 3px; background: rgba(255,255,255,0.2); transition: background 0.4s ease, width 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.pp-dot.active { background: ${BTB_RED}; width: 48px; }

#hscroll { padding: 160px 0 0; position: relative; overflow: hidden; }
.hscroll-head { padding: 0 48px 80px; }
@media (max-width: 720px) { .hscroll-head { padding: 0 24px 60px; } #hscroll { padding-top: 100px; } }
.hscroll-label {
  font-size: 11px; font-weight: 700; letter-spacing: 0.3em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 16px;
  display: flex; align-items: center; gap: 12px;
  opacity: 0; transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.hscroll-label::before { content: ''; width: 32px; height: 2px; background: ${BTB_RED}; }
.hscroll-label.in { opacity: 1; transform: translateX(0); }
.hscroll-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(48px, 8vw, 100px);
  text-transform: uppercase; line-height: 0.9;
  letter-spacing: 0.005em;
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease 0.1s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s;
}
.hscroll-title.in { opacity: 1; transform: translateY(0); }
.hscroll-title em { color: ${BTB_RED}; font-style: normal; }

.hscroll-track {
  display: flex; gap: 24px;
  padding: 0 48px 120px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
@media (max-width: 720px) { .hscroll-track { padding: 0 24px 80px; } }
.hscroll-track::-webkit-scrollbar { display: none; }
.hscroll-track.grabbing { cursor: grabbing; }

.hcard {
  flex-shrink: 0;
  width: clamp(280px, 28vw, 400px);
  aspect-ratio: 3/4;
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
  padding: 32px;
  display: flex; flex-direction: column; justify-content: flex-end;
  position: relative; overflow: hidden;
  scroll-snap-align: start;
  transition: border-color 0.3s;
}
.hcard:hover { border-color: rgba(210,38,48,0.4); }
.hcard::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(210,38,48,0.15), transparent 50%);
  opacity: 0; transition: opacity 0.4s ease;
}
.hcard:hover::before { opacity: 1; }
.hcard-num { position: absolute; top: 24px; left: 32px; font-family: 'Bebas Neue', sans-serif; font-size: 11px; letter-spacing: 0.3em; color: rgba(255,255,255,0.2); }
.hcard-icon { font-size: 48px; margin-bottom: 16px; position: relative; z-index: 1; }
.hcard-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; text-transform: uppercase; line-height: 1; position: relative; z-index: 1; margin-bottom: 8px; letter-spacing: 0.005em; }
.hcard-desc { font-size: 13px; color: rgba(255,255,255,0.4); line-height: 1.6; position: relative; z-index: 1; }
.hcard-tag {
  position: absolute; top: 24px; right: 24px;
  padding: 4px 12px; font-size: 10px; font-weight: 700;
  letter-spacing: 0.15em; text-transform: uppercase;
  background: rgba(210,38,48,0.2); color: ${BTB_RED};
}

#manifesto { padding: 200px 48px; background: ${BTB_RED}; position: relative; overflow: hidden; }
@media (max-width: 720px) { #manifesto { padding: 120px 24px; } }
.manifesto-inner { max-width: 1100px; }
.manifesto-line {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(40px, 7vw, 90px);
  text-transform: uppercase; line-height: 0.95;
  display: flex; flex-wrap: wrap; gap: 0.15em;
  letter-spacing: 0.005em;
}
.manifesto-word { display: inline-block; overflow: hidden; }
.manifesto-word > span {
  display: inline-block;
  transform: translateY(110%);
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(0,0,0,0.85);
}
.manifesto-word > span.white { color: #fff; }
.manifesto-word.in > span { transform: translateY(0); }
.manifesto-sep { width: 100%; height: 1px; background: rgba(0,0,0,0.15); margin: 40px 0; }
.manifesto-sub {
  font-size: 16px; color: rgba(0,0,0,0.6);
  max-width: 480px; line-height: 1.7; font-weight: 300;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
}
.manifesto-sub.in { opacity: 1; transform: translateY(0); }

#marquee-section { padding: 120px 0; background: #000; overflow: hidden; }
.marquee-wrap { position: relative; display: flex; overflow: hidden; }
.marquee-track {
  display: flex; gap: 0;
  animation: demoMarquee 20s linear infinite;
  white-space: nowrap;
}
.marquee-track.reverse { animation-direction: reverse; animation-duration: 25s; }
@keyframes demoMarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee-item {
  display: inline-flex; align-items: center; gap: 24px;
  padding: 0 40px;
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(28px, 4vw, 52px);
  letter-spacing: 0.02em; text-transform: uppercase;
  color: rgba(255,255,255,0.08);
}
.marquee-item.highlight { color: rgba(255,255,255,0.7); }
.marquee-dot { width: 8px; height: 8px; border-radius: 50%; background: ${BTB_RED}; flex-shrink: 0; }

#cta {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; text-align: center; padding: 48px;
  background: #000; position: relative; overflow: hidden;
}
.cta-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, rgba(210,38,48,0.15) 0%, transparent 65%);
  animation: demoBreathe 4s ease infinite;
}
@keyframes demoBreathe {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}
.cta-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.4em;
  color: ${BTB_RED}; text-transform: uppercase; margin-bottom: 32px;
  position: relative; z-index: 1;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-eyebrow.in { opacity: 1; transform: translateY(0); }
.cta-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(64px, 12vw, 160px);
  text-transform: uppercase; line-height: 0.87;
  position: relative; z-index: 1; margin-bottom: 48px;
  letter-spacing: 0.005em;
}
.cta-title .line { display: flex; justify-content: center; overflow: hidden; }
.cta-title .line > span {
  display: block; transform: translateY(110%);
  transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.cta-title.in .line:nth-child(1) > span { transform: translateY(0); transition-delay: 0s; }
.cta-title.in .line:nth-child(2) > span { transform: translateY(0); transition-delay: 0.1s; }
.cta-title.in .line:nth-child(3) > span { transform: translateY(0); transition-delay: 0.2s; }
.cta-btns {
  display: flex; gap: 16px; position: relative; z-index: 1;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s ease 0.4s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
  flex-wrap: wrap; justify-content: center;
}
.cta-btns.in { opacity: 1; transform: translateY(0); }
.cta-tagline {
  position: absolute; bottom: 48px; left: 0; right: 0;
  text-align: center;
  font-size: 11px; letter-spacing: 0.3em; color: rgba(255,255,255,0.15);
  text-transform: uppercase;
}

#loader {
  position: fixed; inset: 0; background: #000; z-index: 9997;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 24px;
  animation: demoLoaderOut 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards;
}
@keyframes demoLoaderOut { to { opacity: 0; pointer-events: none; visibility: hidden; } }
.loader-logo { font-family: 'Bebas Neue', sans-serif; font-size: 72px; color: #fff; letter-spacing: 0.04em; }
.loader-bar { width: 200px; height: 2px; background: rgba(255,255,255,0.1); overflow: hidden; }
.loader-fill { height: 100%; background: ${BTB_RED}; animation: demoFill 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes demoFill { from { width: 0%; } to { width: 100%; } }
.loader-num { font-family: 'Bebas Neue', sans-serif; font-size: 13px; color: rgba(255,255,255,0.3); letter-spacing: 0.2em; }
`
