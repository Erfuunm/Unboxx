"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabase-client"

type Mode = "signin" | "signup" | "forgot"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const supabase = createSupabaseBrowserClient()

  // Check if already logged in → redirect to dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard")
      }
    })
  }, [router])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) {
      setMessage({ text: error.message, type: "error" })
    } else {
      router.push("/dashboard")
      // In handleSignIn after router.push('/dashboard')
const { data: { user } } = await supabase.auth.getUser()
await supabase
  .from('Customer')
  .upsert({
    id: user?.id,
    email: user?.email,
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
  }, { onConflict: 'id' })
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setLoading(false)
    if (error) {
      setMessage({ text: error.message, type: "error" })
    } else {
      setMessage({
        text: "Check your email! We sent you a confirmation link.",
        type: "success",
      })
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })

    setLoading(false)
    if (error) {
      setMessage({ text: error.message, type: "error" })
    } else {
      setMessage({
        text: "Password reset link sent to your email!",
        type: "success",
      })
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg-beige)" }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-12 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl font-light tracking-wider" style={{ color: "var(--color-text-dark)" }}>
              UNBOXX
            </span>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-dark)" }}>
            Unboxx B2B Shopify Portal
          </h1>
          <p className="text-sm" style={{ color: "var(--color-accent-green)" }}>
            {mode === "signin" && "Enter your credentials"}
            {mode === "signup" && "Create a new account"}
            {mode === "forgot" && "Reset your password"}
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-md text-sm ${
              message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Forms */}
        <form onSubmit={mode === "signin" ? handleSignIn : mode === "signup" ? handleSignUp : handleForgotPassword} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2.5" style={{ color: "var(--color-text-dark)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm"
              style={{ backgroundColor: "var(--color-bg-input)", color: "var(--color-text-dark)" }}
            />
          </div>

          {(mode === "signin" || mode === "signup") && (
            <div>
              <label className="block text-sm font-medium mb-2.5" style={{ color: "var(--color-text-dark)" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={mode === "signin" || mode === "signup"}
                minLength={6}
                placeholder={mode === "signup" ? "Choose a strong password" : "Enter your password"}
                className="w-full px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm"
                style={{ backgroundColor: "var(--color-bg-input)", color: "var(--color-text-dark)" }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md font-semibold text-white hover:opacity-90 disabled:opacity-50 transition"
            style={{ backgroundColor: "var(--color-btn-dark)" }}
          >
            {loading
              ? "Please wait..."
              : mode === "signin"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Send Reset Link"}
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center text-sm">
          {mode === "signin" && (
            <>
              <button onClick={() => setMode("forgot")} className="text-blue-600 hover:underline">
                Forgot password?
              </button>
              <br />
              <span className="text-gray-600">
                No account?{" "}
                <button onClick={() => setMode("signup")} className="text-blue-600 hover:underline font-medium">
                  Sign up
                </button>
              </span>
            </>
          )}
          {mode === "signup" && (
            <button onClick={() => setMode("signin")} className="text-blue-600 hover:underline">
              Already have an account? Sign in
            </button>
          )}
          {mode === "forgot" && (
            <button onClick={() => setMode("signin")} className="text-blue-600 hover:underline">
              Back to Sign in
            </button>
          )}
        </div>

        {/* Demo Credentials */}
        {/* {mode === "signin" && (
          <div className="mt-8 p-4 rounded-md" style={{ backgroundColor: "var(--color-bg-demo)" }}>
            <p className="font-semibold mb-2.5 text-sm" style={{ color: "var(--color-btn-dark)" }}>
              Demo Credentials:
            </p>
            <div className="text-xs space-y-1 font-mono" style={{ color: "var(--color-btn-dark)" }}>
              <p>Admin: admin@unboxx.com</p>
              <p>Client: client@example.com</p>
              <p>Password: demo123</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}