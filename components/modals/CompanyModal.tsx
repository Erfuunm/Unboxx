
"use client"

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { Building2, Save, X } from 'lucide-react'

interface Customer {
  id?: number
  name: string
  first_name: string
  surname: string
  email: string
  phone: string
}

interface CompanyModalProps {
  customer: Customer | null
  userEmail: string
  onClose: () => void
  onSuccess: () => void
}

export default function CompanyModal({ customer, userEmail, onClose, onSuccess }: CompanyModalProps) {
  const [saving, setSaving] = useState(false)
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') as string,
      first_name: formData.get('first_name') as string,
      surname: formData.get('surname') as string,
      email: formData.get('email') as string || null,
      phone: formData.get('phone') as string || null,
    }

    let newCustomerId: number | undefined

    if (customer?.id) {
      // UPDATE
      const { error } = await supabase
        .from('Customer')
        .update(payload)
        .eq('id', customer.id)

      if (error) {
        toast.error('Failed to update company')
        setSaving(false)
        return
      }
      newCustomerId = customer.id
    } else {
      // INSERT
      debugger
      const { data, error } = await supabase
        .from('Customer')
        .insert(payload)
        .select()
        .single()

      if (error || !data) {
        toast.error('Failed to create company')
        setSaving(false)
        return
      }
      newCustomerId = data.id
    }

    // LINK TO PROFILE
    const { error: linkError } = await supabase
      .from('Profile')
      .update({ customer_id: newCustomerId })
      .eq('email', userEmail)

    if (linkError) {
      toast.error('Failed to link company')
    } else {
      toast.success(customer?.id ? 'Company updated!' : 'Company created!')
      onSuccess()
      onClose()
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-8 py-6 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-8 h-8" />
            {customer ? 'Edit Company' : 'Create Your Company'}
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Company Name *</label>
            <input
              name="name"
              defaultValue={customer?.name}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition"
              placeholder="Unboxx LLC"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Contact First Name *</label>
              <input
                name="first_name"
                defaultValue={customer?.first_name}
                required
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:outline-none"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Contact Surname *</label>
              <input
                name="surname"
                defaultValue={customer?.surname}
                required
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:outline-none"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Company Email</label>
            <input
              name="email"
              type="email"
              defaultValue={customer?.email || ''}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="info@unboxx.az"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Company Phone</label>
            <input
              name="phone"
              defaultValue={customer?.phone || ''}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="+994 50 123 45 67"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              {saving ? 'Saving...' : <><Save className="w-5 h-5" /> {customer ? 'Update' : 'Create'} Company</>}
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