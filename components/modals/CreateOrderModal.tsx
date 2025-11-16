// components/modals/CreateOrderModal.tsx
"use client"

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { Package, Save, X } from 'lucide-react'

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  companyName: string
}

export default function CreateOrderModal({ isOpen, onClose, onSuccess, companyName }: CreateOrderModalProps) {
  const [saving, setSaving] = useState(false)
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      order_number: formData.get('order_number') as string,
      customer: companyName,
      store: formData.get('store') as string,
      date: formData.get('date') as string,
      qty: Number(formData.get('qty')),
      amount: Number(formData.get('amount')),
      status: formData.get('status') as string,
      deposco_status: 'Pending',
    }

    const { error } = await supabase
      .from('Order')
      .insert(payload)
      .select()

    setSaving(false)

    if (error) {
      toast.error('Failed to create order: ' + error.message)
    } else {
      toast.success('Order created successfully!')
      onSuccess()
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-8 py-6 rounded-t-2xl flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package className="w-8 h-8" />
            Create New Order
          </h3>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Order Number *</label>
              <input
                name="order_number"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                placeholder="#1001"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Store *</label>
              <select
                name="store"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
              >
                <option value="">Select store</option>
                <option value="Shopify US">Shopify US</option>
                <option value="Shopify EU">Shopify EU</option>
                <option value="Amazon">Amazon</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Order Date *</label>
              <input
                name="date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Status *</label>
              <select
                name="status"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Quantity *</label>
              <input
                name="qty"
                type="number"
                min="1"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                placeholder="12"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Amount (USD) *</label>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none"
                placeholder="299.99"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <p className="text-sm text-gray-600">
              Customer: <span className="font-bold">{companyName}</span>
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              {saving ? 'Creating...' : <><Save className="w-5 h-5" /> Create Order</>}
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