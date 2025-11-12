// components/pages/store-orders-page.tsx
"use client"

import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase-client"
import StoreOrderModal from "../store-order-modal"
import { toast } from "sonner"
import { Search, Filter, Download, Package, Truck, Clock, CheckCircle } from "lucide-react"

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
  const supabase = createSupabaseBrowserClient()

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true)
    debugger
    const { data, error } = await supabase
      .from('Order')
      .select('*')
      .order('date', { ascending: false })

    if (error) {
      toast.error("Failed to load orders")
      console.error(error)
    } else {
      setOrders(data || [])
      toast.success(`Loaded ${data?.length} orders`)
    }
    setLoading(false)
  }

  // Realtime subscription
  useEffect(() => {
    fetchOrders()

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'Order' },
        (payload) => {
          console.log('Realtime change:', payload)
          fetchOrders() // Refresh on any change
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Filter orders
  const filteredOrders = orders.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Format amount
  const formatAmount = (value: number) => `$${(value || 0).toFixed(2)}`

  // Status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return '#0099FF'
      case 'Shipped': return '#1a1a1a'
      case 'Pending': return '#FFA500'
      case 'Delivered': return '#5a8c5a'
      default: return '#888'
    }
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
            Store Orders
          </h1>
          <p className="text-gray-600">Track and manage Shopify store orders linked to Deposco</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              style={{ backgroundColor: "#F5F5F0", borderColor: "#E0E0D4" }}
            />
          </div>
          <select className="px-5 py-3 rounded-xl" style={{ backgroundColor: "#F5F5F0", borderColor: "#E0E0D4" }}>
            <option>All Stores</option>
          </select>
          <select className="px-5 py-3 rounded-xl" style={{ backgroundColor: "#F5F5F0", borderColor: "#E0E0D4" }}>
            <option>All Status</option>
          </select>
          <button className="px-6 py-3 rounded-xl flex items-center gap-2 font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition">
            <Download className="w-5 h-5" />
            Export CSV
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9F9F6" }}>
              <tr>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Order Number</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Customer</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Store</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Date</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Items</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Amount</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Status</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Deposco</th>
                <th className="px-6 py-5 text-left text-sm font-bold" style={{ color: "#1a1a1a" }}>Tracking</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    {searchTerm ? "No orders found" : "No orders yet"}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-emerald-50/30 cursor-pointer transition"
                    style={{ borderColor: "#E8E8E0" }}
                    onClick={() => handleOrderClick(order)}
                  >
                    <td className="px-6 py-5 font-medium" style={{ color: "#1a1a1a" }}>
                      {order.order_number}
                    </td>
                    <td className="px-6 py-5" style={{ color: "#1a1a1a" }}>
                      {order.customer}
                    </td>
                    <td className="px-6 py-5 text-gray-600">{order.store}</td>
                    <td className="px-6 py-5 text-gray-600">
                      {new Date(order.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Package className="w-4 h-4 text-gray-500" />
                        {order.qty}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold" style={{ color: "#1a1a1a" }}>
                      {formatAmount(order.amount)}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className="px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 w-fit"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                        {order.status === 'Shipped' && <Truck className="w-3 h-3" />}
                        {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-600">
                      <span className="flex items-center gap-2">
                        <span style={{ color: "#5a8c5a" }}>●</span>
                        {order.deposco_status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <button className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1">
                        Track Order →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <StoreOrderModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}