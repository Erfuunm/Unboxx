// components/pages/profile-page.tsx
"use client"

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { User, Mail, Phone, Building2, Edit3 } from 'lucide-react'
import CompanyModal from '@/components/modals/CompanyModal'
import ProfileModal from '@/components/modals/ProfileModal'

interface Customer {
  id: number
  name: string
  first_name: string
  surname: string
  email: string
  phone: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const supabase = createSupabaseBrowserClient()

  const fetchData = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Login required')
      setLoading(false)
      return
    }

    const { data: profileData, error } = await supabase
      .from('Profile')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error || !profileData) {
      toast.error('Profile not found')
      setLoading(false)
      return
    }

    setProfile(profileData)

    if (profileData.customer_id) {
      const { data: cust } = await supabase
        .from('Customer')
        .select('*')
        .eq('id', profileData.customer_id)
        .single()
      setCustomer(cust)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-80 mb-8"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 h-64"></div>
            <div className="bg-white rounded-2xl shadow-lg p-8 h-64"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-4xl font-bold shadow-2xl">
          {profile.first_name?.[0] || profile.email[0].toUpperCase()}
        </div>
        <h1 className="text-3xl font-bold mt-4" style={{ color: "#192216" }}>
          Welcome, {profile.first_name || 'User'}
        </h1>
        <p className="text-gray-600">Manage your profile and company</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <User className="w-6 h-6" />
              Personal Info
            </h2>
            <button
              onClick={() => setShowProfileModal(true)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-lg font-semibold">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="mt-1 text-lg font-semibold">
                {profile.first_name} {profile.surname}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="mt-1 text-lg">{profile.phone || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <p className="mt-1 text-lg font-medium text-emerald-700">
                {profile.role === 'admin' ? 'Administrator' : 'Client User'}
              </p>
            </div>
          </div>
        </div>

        {/* Company Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-100">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              Your Company
            </h2>
            <button
              onClick={() => setShowCompanyModal(true)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {customer ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <p className="mt-1 text-2xl font-bold text-indigo-700">{customer.name}</p>
                </div>
                <div className="text-sm grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Contact:</span>
                    <p className="font-medium">{customer.first_name} {customer.surname}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{customer.email || '—'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No company registered yet</p>
                <button
                  onClick={() => setShowCompanyModal(true)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                >
                  Add Your Company
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onSuccess={fetchData}
        />
      )}

      {showCompanyModal && (
        <CompanyModal
          customer={customer}
          userEmail={profile.email}
          onClose={() => setShowCompanyModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}