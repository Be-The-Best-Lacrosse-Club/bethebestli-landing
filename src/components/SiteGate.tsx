import { useState, useEffect, type FormEvent, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { Lock } from "lucide-react"

// CHANGE THIS to whatever passcode you want
const SITE_PASSCODE = "BTB2026"

interface SiteGateProps {
  children: ReactNode
}

export function SiteGate({ children }: SiteGateProps) {
  const location = useLocation()
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)

  // Re-lock on every route change
  useEffect(() => {
    setUnlocked(false)
    setInput("")
    setError(false)
  }, [location.pathname])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() === SITE_PASSCODE) {
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput("")
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D22630]/10 border border-[#D22630]/30 mb-6">
            <Lock size={28} className="text-[#D22630]" />
          </div>
          <h1
            className="text-4xl font-bold text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
          >
            BE THE BEST LACROSSE
          </h1>
          <p className="text-white/50 text-sm uppercase tracking-[2px] font-semibold">
            Site Coming Soon
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="passcode" className="block text-[0.68rem] font-semibold uppercase tracking-[1.5px] text-white/40 mb-2">
              Enter Passcode
            </label>
            <input
              id="passcode"
              type="password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError(false)
              }}
              autoFocus
              autoComplete="off"
              className={`w-full px-4 py-3.5 bg-white/5 border ${
                error ? "border-[#D22630]" : "border-white/10"
              } rounded-lg text-white text-base focus:outline-none focus:border-[#D22630] transition-colors`}
              placeholder="••••••••"
            />
            {error && (
              <p className="text-[#D22630] text-xs mt-2 font-semibold">
                Incorrect passcode. Try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#D22630] hover:bg-[#B01F28] text-white font-bold uppercase tracking-[1.5px] text-sm rounded-lg transition-colors"
          >
            Enter Site
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-8">
          BTB Lacrosse Club · Long Island, NY
        </p>
      </div>
    </div>
  )
}
