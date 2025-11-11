// components/pages/profile-page.tsx
"use client"

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { User, Mail, Phone, Badge, Save } from 'lucide-react'

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createSupabaseBrowserClient()

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      toast.error('Authentication required')
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('email', user.email)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      toast.error('Failed to load profile')
      setLoading(false)
      return
    }

    if (data) {
      setProfile(data)
    } else {
      setProfile({
        id: user.id,
        auth: user.id,
        email: user.email,
        first_name: '',
        surname: '',
        phone: '',
        role: 'client'
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setSaving(true)
    const payload = {
      first_name: profile.first_name?.trim() || null,
      surname: profile.surname?.trim() || null,
      phone: profile.phone?.trim() || null,
      email: profile.email
    }

    let response
    if (profile.id) {
      response = await supabase
        .from('Profile')
        .update(payload)
        .eq('email', profile.email)
    } else {
      response = await supabase
        .from('Profile')
        .insert({
          id: profile.id,
          auth: profile.id,
          email: profile.email,
          role: 'client',
          ...payload
        })
        .select()
    }

    setSaving(false)

    if (response.error) {
      toast.error(response.error.message || 'Failed to save profile')
    } else {
      await fetchProfile()
      toast.success(profile.id ? 'Profile updated!' : 'Welcome! Profile created!')
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header */}


      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-5">
          <h2 className="text-xl font-semibold text-white flex items-center gap-3">
            <User className="w-6 h-6" />
            Personal Information
          </h2>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-7">
          {/* Email */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Mail className="w-4 h-4 text-emerald-600" />
              Email Address
            </label>
            <input
              type="email"
              value={profile.email || ''}
              disabled
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* First Name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profile.first_name || ''}
                onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                required
                placeholder="John"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>

            {/* Surname */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                Surname <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profile.surname || ''}
                onChange={(e) => setProfile({ ...profile, surname: e.target.value })}
                required
                placeholder="Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+994 50 123 45 67"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Badge className="w-4 h-4 text-emerald-600" />
              Account Role
            </label>
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl font-medium text-emerald-800">
              {profile.role === 'admin' ? 'Administrator' : 'Client User'}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                bg-gradient-to-r from-emerald-600 to-teal-700 
                hover:from-emerald-700 hover:to-teal-800 
                active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: saving ? '#ccc' : 'linear-gradient(to right, #192216, #0d4f3d)' }}
            >
              {saving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {profile?.id ? 'Update Profile' : 'Create Profile'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer Note */}
      {!profile?.id && (
        <p className="text-center text-sm text-gray-500 mt-8 italic">
          This is your first time here — welcome to Unboxx Portal!
        </p>
      )}
    </div>
  )
}