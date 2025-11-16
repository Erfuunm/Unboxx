// components/pages/invoices-page.tsx
"use client"

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase-client"
import { toast } from "sonner"

interface Invoice {
  id: number
  invoice_number: string
  customer_name: string
  description: string | null
  invoice_date: string
  due_date: string
  amount: number
  status: string
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const supabase = createSupabaseBrowserClient()

  const fetchInvoices = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('Invoice')
      .select('*')
      .order('invoice_date', { ascending: false })

    if (error) {
      toast.error("Failed to load invoices")
      console.error(error)
    } else {
      setInvoices(data || [])
      toast.success(`Loaded ${data?.length} invoices`)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()

    const channel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Invoice' }, () => {
        fetchInvoices()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      inv.customer_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "All" || inv.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return '#5a8c5a'
      case 'Outstanding': return '#FFA500'
      case 'Overdue': return '#FF4444'
      case 'Cancelled': return '#888888'
      default: return '#888'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
          Invoices
        </h1>
        <p className="text-gray-600">View and manage QuickBooks invoices</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
         
          <input
            type="text"
            placeholder="Search by invoice number, company, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            style={{ backgroundColor: "#F5F5F0", border: "1px solid #E0E0D4" }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-3 rounded-xl"
          style={{ backgroundColor: "#F5F5F0", border: "1px solid #E0E0D4" }}
        >
          <option>All Status</option>
          <option>Paid</option>
          <option>Outstanding</option>
          <option>Overdue</option>
          <option>Cancelled</option>
        </select>
        <button className="px-6 py-3 rounded-xl flex items-center gap-2 font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition">
          Export CSV
        </button>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="p-6 border-b flex items-center gap-3" style={{ borderColor: "#E8E8E0" }}>
          <span className="text-2xl">Invoice</span>
          <h3 className="text-xl font-bold" style={{ color: "#1a1a1a" }}>
            Invoice List ({filteredInvoices.length})
          </h3>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            {searchTerm || filterStatus !== "All" ? "No invoices match your filters" : "No invoices yet"}
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9F9F6" }}>
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Invoice Number</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Company</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Description</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Invoice Date</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Due Date</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Amount</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="border-t hover:bg-emerald-50/30 transition" style={{ borderColor: "#E8E8E0" }}>
                  <td className="px-6 py-5 font-bold text-emerald-700">{inv.invoice_number}</td>
                  <td className="px-6 py-5 font-medium">{inv.customer_name}</td>
                  <td className="px-6 py-5 text-gray-600">{inv.description || "—"}</td>
                  <td className="px-6 py-5 text-gray-600">
                    {new Date(inv.invoice_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-5 text-gray-600">
                    {new Date(inv.due_date).toLocaleDateString('en-GB')}
                  </td>
                  <td className="px-6 py-5 font-bold text-lg" style={{ color: "#192216" }}>
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className="px-4 py-2 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: getStatusColor(inv.status) }}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}