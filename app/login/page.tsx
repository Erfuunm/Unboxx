"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      router.push("/dashboard")
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg-beige)" }}
    >
      <div className="bg-white rounded-lg shadow-2xl p-12 w-full max-w-md">
        <div className="text-center mb-12">
          {/* UNBOXX Logo with leaf icon */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-5xl font-light tracking-wider" style={{ color: "var(--color-text-dark)" }}>
              UNBOXX
            </span>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
              <path d="M12 6c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--color-text-dark)" }}>
            Unboxx B2B Shopify Portal
          </h1>
          <p className="text-sm" style={{ color: "var(--color-accent-green)" }}>
            Enter your credentials to access the portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mb-8">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2.5" style={{ color: "var(--color-text-dark)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm"
              style={{
                backgroundColor: "var(--color-bg-input)",
                color: "var(--color-text-dark)",
              }}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2.5" style={{ color: "var(--color-text-dark)" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm"
              style={{
                backgroundColor: "var(--color-bg-input)",
                color: "var(--color-text-dark)",
              }}
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-md font-semibold transition text-white hover:opacity-90"
            style={{ backgroundColor: "var(--color-btn-dark)" }}
          >
            Sign in
          </button>
        </form>

        <div className="p-4 rounded-md" style={{ backgroundColor: "var(--color-bg-demo)" }}>
          <p className="font-semibold mb-2.5 text-sm" style={{ color: "var(--color-btn-dark)" }}>
            Demo Credentials:
          </p>
          <div className="text-xs space-y-1.5 font-mono" style={{ color: "var(--color-btn-dark)" }}>
            <p>Admin: admin@unboxx.com</p>
            <p>Client: client@example.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
