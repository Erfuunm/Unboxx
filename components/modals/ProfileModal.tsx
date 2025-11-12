// components/modals/ProfileModal.tsx
"use client"

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { User, Mail, Phone, Save, X } from 'lucide-react'

interface ProfileModalProps {
  profile: any
  onClose: () => void
  onSuccess: () => void
}

export default function ProfileModal({ profile, onClose, onSuccess }: ProfileModalProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    surname: profile.surname || '',
    phone: profile.phone || '',
  })

  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      first_name: formData.first_name.trim() || null,
      surname: formData.surname.trim() || null,
      phone: formData.phone.trim() || null,
    }

    const { error } = await supabase
      .from('Profile')
      .update(payload)
      .eq('email', profile.email)

    setSaving(false)

    if (error) {
      toast.error('Failed to update profile')
    } else {
      toast.success('Profile updated!')
      onSuccess()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-6 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8" />
            Edit Personal Info
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none transition"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Surname *</label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none transition"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none transition"
              placeholder="+994 50 123 45 67"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Update Profile</>}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}