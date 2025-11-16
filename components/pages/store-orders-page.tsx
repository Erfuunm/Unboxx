// components/pages/store-orders-page.tsx
"use client"

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase-client"
import StoreOrderModal from "../store-order-modal"
import CreateOrderModal from "../modals/CreateOrderModal"
import { toast } from "sonner"
import { Search, Filter, Download, Package, Truck, Clock, CheckCircle, Plus } from "lucide-react"

interface Order {
  id: number
  order_number: string
  customer: string
  store: string
  date: string
  qty: number
  amount: number
  status: string
  deposco_status: string
}

export default function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [companyName, setCompanyName] = useState("")

  const supabase = createSupabaseBrowserClient()

  const fetchData = async () => {
    setLoading(true)

    // Get company name
    const { data: profile } = await supabase
      .from('Profile')
      .select('customer_id')
      .eq('email', (await supabase.auth.getUser()).data.user?.email)
      .single()

    if (profile?.customer_id) {
      const { data: customer } = await supabase
        .from('Customer')
        .select('name')
        .eq('id', profile.customer_id)
        .single()
      setCompanyName(customer?.name || '')
    }

    // Fetch orders
    const { data, error } = await supabase
      .from('Order')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      toast.error("Failed to load orders")
    } else {
      setOrders(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Order' }, () => {
        fetchData()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatAmount = (value: number) => `$${(value || 0).toFixed(2)}`

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return '#0099FF'
      case 'Shipped': return '#1a1a1a'
      case 'Pending': return '#FFA500'
      case 'Delivered': return '#5a8c5a'
      default: return '#888'
    }
  }

  if (loading) return <div className="p-8"><div className="animate-pulse space-y-4">Loading orders...</div></div>

  return (
    <>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
              Store Orders
            </h1>
            <p className="text-gray-600">Track and manage Shopify store orders linked to Deposco</p>
          </div>
      
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
              style={{ backgroundColor: "#F5F5F0", borderColor: "#E0E0D4" }}
            />
          </div>
          <button className="px-6 py-3 rounded-xl flex items-center gap-2 font-medium bg-emerald-600 text-white hover:bg-emerald-700">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9F9F6" }}>
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Order</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Customer</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Store</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Date</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Items</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Amount</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id} className="border-t hover:bg-emerald-50/30 cursor-pointer transition" onClick={() => { setSelectedOrder(order); setIsModalOpen(true) }}>
                  <td className="px-6 py-5 font-bold">#{order.order_number}</td>
                  <td className="px-6 py-5">{order.customer}</td>
                  <td className="px-6 py-5 text-gray-600">{order.store}</td>
                  <td className="px-6 py-5 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-center">{order.qty}</td>
                  <td className="px-6 py-5 font-bold">{formatAmount(order.amount)}</td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && selectedOrder && (
        <StoreOrderModal order={selectedOrder} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}

  
    </>
  )
}