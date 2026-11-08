import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import Nav from "./Nav"
import LoadingScreen from "./ui/8bit-loading-screen"
import PushpinTearFooter from "./ui/pushpin-tear-footer"

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0 }) }, [pathname])
  return null
}

const TIPS = [
  "Learn the pattern. Choose the method!",
  "Desmos is powerful, but knowing when NOT to use it matters.",
  "Read the entire question before jumping into calculations.",
  "Remember to take breaks during long study sessions!",
]

export default function Layout() {
  const navigate = useNavigate()
  // Show the loading screen once per browser session.
  const [booting, setBooting] = useState(() => {
    try { return sessionStorage.getItem("diamond.booted") !== "1" } catch { return true }
  })
  useEffect(() => {
    if (!booting) return
    const t = window.setTimeout(() => {
      try { sessionStorage.setItem("diamond.booted", "1") } catch { /* ignore */ }
      setBooting(false)
    }, 3000)
    return () => clearTimeout(t)
  }, [booting])

  if (booting) {
    return <LoadingScreen variant="fullscreen" title="DIAMOND" tips={TIPS} autoProgress autoProgressDuration={2600} tipInterval={1200} />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Nav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <PushpinTearFooter
        brand="SAT."
        name="DIAMOND"
        logoHref="/"
        logo={<span style={{ fontSize: "1.5em", fontWeight: 800, letterSpacing: "-0.03em" }}>SAT.</span>}
        tagline="Learn the pattern. Choose the method. Know when to use Desmos."
        mark="SAT / 2026"
        status={{ label: "MADE FOR BETTER SAT PREP", href: "/problems" }}
        sheet="#2f5bff"
        paper="#f1ede4"
        paperInk="#101426"
        seed={11}
        copyright="© 2026 DIAMOND"
        credit="BUILT FOR THE SAT"
        columns={[
          {
            title: "LEARN",
            links: [
              { label: "Problems", href: "/problems" },
              { label: "Desmos Tricks", href: "/desmos" },
              { label: "Math Toolkit", href: "/toolkit" },
              { label: "Reading & Writing", href: "/reading-writing" },
            ],
            cta: { label: "practice.", href: "/problems" },
          },
          {
            title: "EXPLORE",
            links: [
              { label: "Scan a Question", href: "/scan" },
              { label: "720+ Challenge", href: "/challenge" },
              { label: "Timed Exam", href: "/exam" },
              { label: "About Diamond", href: "/about" },
            ],
            cta: { label: "challenge.", href: "/challenge" },
          },
        ]}
        onNavigate={(href) => navigate(href)}
      />
    </div>
  )
}
