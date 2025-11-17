// components/pages/dashboard-page.tsx
"use client"

import { useEffect, useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

export default function DashboardPage() {
  const [metrics, setMetrics] = useState([
    { title: "Store Orders - Processing", value: "0", subtitle: "0 total orders", icon: "Cart" },
    { title: "Bulk Orders - Processing", value: "0", subtitle: "0 total orders", icon: "Gear" },
    { title: "Low Stock Items", value: "0", subtitle: "Below threshold", icon: "Warning", color: "#DC3545" },
  ])

  const [orderStatusData, setOrderStatusData] = useState([
    { label: "Processing", value: 0, color: "#0099FF" },
    { label: "Shipped", value: 0, color: "#1a1a1a" },
    { label: "Delivered", value: 0, color: "#888888" },
  ])

  const [totalRevenue, setTotalRevenue] = useState(0)
  const [avgOrderValue, setAvgOrderValue] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createSupabaseBrowserClient()

  const fetchData = async () => {
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase
      .from('Profile')
      .select('customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.customer_id) return

    const customerId = profile.customer_id

    // Get company name
    const { data: customer } = await supabase
      .from('Customer')
      .select('name')
      .eq('id', customerId)
      .single()

    if (!customer?.name) return
    const companyName = customer.name

    // === Orders ===
    const { data: orders = [] } = await supabase
      .from('Order')
      .select('status, type, total_amount')
      .eq('customer', companyName)

    const storeProcessing = orders.filter(o => o.type === 'Store' && o.status === 'Processing').length
    const bulkProcessing = orders.filter(o => o.type === 'Bulk' && o.status === 'Processing').length
    const totalOrders = orders.length

    // === Low Stock ===
    const { data: stores = [] } = await supabase.from('Store').select('id').eq('customer_id', customerId)
    const storeIds = stores.map(s => s.id)

    let lowStockCount = 0
    if (storeIds.length > 0) {
      const { data: products = [] } = await supabase.from('Product').select('id').in('store_id', storeIds)
      const productIds = products.map(p => p.id)
      if (productIds.length > 0) {
        const { data: variants = [] } = await supabase.from('ProductVariant').select('stock, min_stock').in('product_id', productIds)
        lowStockCount = variants.filter(v => v.stock <= (v.min_stock || 0)).length
      }
    }

    // === Status Counts ===
    const processing = orders.filter(o => o.status === 'Processing').length
    const shipped = orders.filter(o => o.status === 'Shipped').length
    const delivered = orders.filter(o => o.status === 'Delivered').length

    // === Revenue ===
    const { data: revenueData = [] } = await supabase.from('Revenue').select('amount').eq('customer_id', customerId)
    const totalRev = revenueData.reduce((sum, r) => sum + Number(r.amount), 0)
    const avg = totalOrders > 0 ? totalRev / totalOrders : 0

    // Update State
    setMetrics([
      { title: "Store Orders - Processing", value: storeProcessing.toString(), subtitle: `${totalOrders} total orders`, icon: "🛒", },
      { title: "Bulk Orders - Processing", value: bulkProcessing.toString(), subtitle: `${bulkProcessing} total orders`,   icon: "⚙️" },
      { title: "Low Stock Items", value: lowStockCount.toString(), subtitle: "Below threshold",  icon: "⚠" , color: "#DC3545" },
    ])

    setOrderStatusData([
      { label: "Processing", value: processing, color: "#0099FF" },
      { label: "Shipped", value: shipped, color: "#1a1a1a" },
      { label: "Delivered", value: delivered, color: "#888888" },
    ])

    setTotalRevenue(totalRev)
    setAvgOrderValue(avg)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel('dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Order' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ProductVariant' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Revenue' }, fetchData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const totalForBars = orderStatusData.reduce((a, b) => a + b.value, 0) || 1

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="text-2xl text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
          Dashboard
        </h1>
        <p className="text-gray-600">Overview of your business metrics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm mb-2">{metric.title}</p>
                <p className="text-3xl font-bold mb-1" style={{ color: "#1a1a1a" }}>
                  {metric.value}
                </p>
                <p className="text-gray-500 text-xs">{metric.subtitle}</p>
              </div>
              <span className="text-2xl" style={{ color: metric.color }}>
                {metric.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1a1a1a" }}>
            Order Status Breakdown
          </h3>
          <div className="space-y-4">
            {orderStatusData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-700">{item.label}</p>
                  <p className="font-semibold" style={{ color: "#1a1a1a" }}>
                    {item.value}
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / totalForBars) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1a1a1a" }}>
            Revenue Summary
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold" style={{ color: "#1a1a1a" }}>
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Avg. Order Value</p>
                <p className="text-xl font-bold" style={{ color: "#1a1a1a" }}>
                  ${avgOrderValue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">This Month</p>
                <p className="text-xl font-bold text-green-600">+18.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}