import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { SEO } from "@/components/shared/SEO"
import { ArrowLeft, Lock, Loader2, Mail, CheckCircle } from "lucide-react"

type View = "login" | "forgot" | "forgot-sent"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [view, setView] = useState<View>("login")
  const [submitting, setSubmitting] = useState(false)
  const { login, requestPasswordRecovery } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get("redirect") || "/"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const user = await login(email, password)

      // Redirect based on role + program if no specific redirect was requested
      if (redirect === "/") {
        if (user.role === "owner" || user.role === "coach") {
          navigate(`/${user.gender}/coaches-hub`, { replace: true })
        } else {
          navigate(`/${user.gender}/players`, { replace: true })
        }
      } else {
        navigate(redirect, { replace: true })
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed"
      // Make common errors more user-friendly
      if (message.includes("invalid_grant") || message.includes("Invalid")) {
        setError("Invalid email or password. Please try again.")
      } else if (message.includes("not_found") || message.includes("No user")) {
        setError("No account found with that email address.")
      } else {
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      await requestPasswordRecovery(email)
      setView("forgot-sent")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send recovery email"
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <SEO
        title="Login | BTB Lacrosse Club"
        description="Sign in to your BTB Lacrosse Club account to access the Players Hub, Coaches Hub, and Academy resources."
        path="/login"
      />
      <div className="w-full max-w-[400px]">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/30 hover:text-white transition-colors text-[0.78rem] font-semibold uppercase tracking-[1.5px] mb-12">
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-[var(--btb-red)]/20 flex items-center justify-center">
            {view === "forgot-sent" ? (
              <CheckCircle size={18} className="text-emerald-400" />
            ) : view === "forgot" ? (
              <Mail size={18} className="text-[var(--btb-red)]" />
            ) : (
              <Lock size={18} className="text-[var(--btb-red)]" />
            )}
          </div>
          <div>
            <div className="font-display text-2xl uppercase tracking-wide text-white">
              {view === "forgot-sent" ? (
                <>Check Your <span className="text-emerald-400">Email</span></>
              ) : view === "forgot" ? (
                <>Reset <span className="text-[var(--btb-red)]">Password</span></>
              ) : (
                <>BTB <span className="text-[var(--btb-red)]">Login</span></>
              )}
            </div>
          </div>
        </div>

        {/* LOGIN VIEW */}
        {view === "login" && (
          <>
            <p className="text-[0.84rem] text-white/35 leading-relaxed mb-8">
              Sign in to access your Players Hub or Coaches Hub. Course progress, film study, and resources are all inside.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-[2px] text-white/30 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white text-[0.88rem] placeholder:text-white/20 focus:outline-none focus:border-[var(--btb-red)]/50 transition-colors disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-[2px] text-white/30 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white text-[0.88rem] placeholder:text-white/20 focus:outline-none focus:border-[var(--btb-red)]/50 transition-colors disabled:opacity-50"
                  placeholder="Password"
                />
              </div>

              {error && (
                <p className="text-[0.78rem] text-[var(--btb-red)] bg-[var(--btb-red)]/10 border border-[var(--btb-red)]/20 rounded-lg px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[var(--btb-red)] text-white text-[0.72rem] font-bold uppercase tracking-[2px] rounded-lg hover:bg-[var(--btb-red-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setError(""); setView("forgot") }}
                className="text-[0.75rem] text-white/30 hover:text-white/60 transition-colors"
              >
                Forgot your password?
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.07]">
              <p className="text-[0.72rem] text-white/20 leading-relaxed">
                Access is by invitation only. If you need an account, contact your program director.
              </p>
            </div>
          </>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {view === "forgot" && (
          <>
            <p className="text-[0.84rem] text-white/35 leading-relaxed mb-8">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[0.65rem] font-bold uppercase tracking-[2px] text-white/30 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-lg text-white text-[0.88rem] placeholder:text-white/20 focus:outline-none focus:border-[var(--btb-red)]/50 transition-colors disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>

              {error && (
                <p className="text-[0.78rem] text-[var(--btb-red)] bg-[var(--btb-red)]/10 border border-[var(--btb-red)]/20 rounded-lg px-4 py-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[var(--btb-red)] text-white text-[0.72rem] font-bold uppercase tracking-[2px] rounded-lg hover:bg-[var(--btb-red-dark)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setError(""); setView("login") }}
                className="text-[0.75rem] text-white/30 hover:text-white/60 transition-colors"
              >
                Back to sign in
              </button>
            </div>
          </>
        )}

        {/* FORGOT PASSWORD — EMAIL SENT */}
        {view === "forgot-sent" && (
          <>
            <p className="text-[0.84rem] text-white/35 leading-relaxed mb-8">
              If an account exists for <span className="text-white/60">{email}</span>, you'll receive a password reset link shortly. Check your inbox and spam folder.
            </p>

            <button
              onClick={() => { setError(""); setView("login") }}
              className="w-full py-3.5 bg-white/[0.08] text-white text-[0.72rem] font-bold uppercase tracking-[2px] rounded-lg hover:bg-white/[0.12] transition-colors"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  )
}
