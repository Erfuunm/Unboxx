// components/pages/profile-page.tsx
"use client"

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  useEffect(() => {
    const fetchProfile = async () => {
      setError(null)
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('Profile')
        .select('*')
        .eq('auth', user.id)
        .maybeSingle() // ← IMPORTANT: allows null result without error

      if (error && error.code !== 'PGRST116') {
        console.error('Select error:', error)
        setError('Failed to load profile. Please try again.')
        setLoading(false)
        return
      }

      if (data) {
        setProfile(data)
      } else {
        // No profile → ready to create
        setProfile({
          auth: user.id,
          email: user.email || '',
          first_name: '',
          surname: '',
          phone: '',
          role: 'client'
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    setError(null)

    const payload = {
      auth: profile.auth,
      email: profile.email,
      first_name: profile.first_name || '',
      surname: profile.surname || '',
      phone: profile.phone || '',
      role: profile.role || 'client'
    }

    const { data, error } = profile.id
      ? await supabase.from('Profile').update(payload).eq('auth', profile.auth).select().single()
      : await supabase.from('Profile').insert(payload).select().single()

    setSaving(false)

    if (error) {
      console.error('Save error:', error)
      setError(
        error.code === '42501'
          ? 'Permission denied. Please contact admin.'
          : error.message || 'Failed to save profile'
      )
    } else {
      setProfile(data)
      alert('Profile saved successfully!')
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-4">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8" style={{ color: "#192216" }}>
        {profile?.id ? 'Edit Profile' : 'Complete Your Profile'}
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white p-8 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={profile.email || ''}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-50"
            style={{ borderColor: "#E0E0D4" }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">First Name *</label>
          <input
            type="text"
            value={profile.first_name || ''}
            onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ borderColor: "#E0E0D4" }}
            placeholder="John"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Surname *</label>
          <input
            type="text"
            value={profile.surname || ''}
            onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ borderColor: "#E0E0D4" }}
            placeholder="Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="text"
            value={profile.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{ borderColor: "#E0E0D4" }}
            placeholder="+994 50 123 45 67"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role</label>
          <input
            type="text"
            value={profile.role || 'client'}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-50"
            style={{ borderColor: "#E0E0D4" }}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-md font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#192216" }}
          >
            {saving ? 'Saving...' : profile?.id ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>

      {!profile?.id && (
        <p className="mt-6 text-sm text-gray-600 text-center">
          This is your first time here. Please complete your profile to continue.
        </p>
      )}
    </div>
  )
}