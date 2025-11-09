"use client"

import { useState } from "react"
import StoreOrderModal from "../store-order-modal"

export default function StoreOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const orders = [
    {
      orderNumber: "UB-2025-1001",
      customer: "Acme Corporation",
      store: "Corporate Gifts Store",
      date: "2025-10-05",
      items: 10,
      amount: "$899.90",
      status: "Processing",
      statusColor: "#0099FF",
      deposcoStatus: "In Warehouse",
      tracking: "No tracking",
    },
    {
      orderNumber: "UB-2025-1002",
      customer: "Tech Innovations Ltd",
      store: "Premium Hampers",
      date: "2025-10-03",
      items: 15,
      amount: "$1499.85",
      status: "Shipped",
      statusColor: "#1a1a1a",
      deposcoStatus: "Dispatched",
      tracking: "Track Order",
    },
    {
      orderNumber: "UB-2025-1003",
      customer: "Global Enterprises",
      store: "Corporate Gifts Store",
      date: "2025-10-06",
      items: 25,
      amount: "$2399.75",
      status: "Pending",
      statusColor: "#FFA500",
      deposcoStatus: "Awaiting Stock",
      tracking: "No tracking",
    },
    {
      orderNumber: "UB-2025-1004",
      customer: "Marketing Agency Co",
      store: "Seasonal Collection",
      date: "2025-09-28",
      items: 8,
      amount: "$679.90",
      status: "Delivered",
      statusColor: "#5a8c5a",
      deposcoStatus: "Delivered",
      tracking: "Track Order",
    },
  ]

  const handleOrderClick = (order: any) => {
    console.log("[v0] Opening modal for order:", order.orderNumber)
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    console.log("[v0] Closing modal")
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
            Store Orders
          </h1>
          <p className="text-gray-600">Track and manage Shopify store orders linked to Deposco</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by order number or customer..."
              className="w-full pl-10 pr-4 py-2 rounded-md border-none focus:outline-none"
              style={{ backgroundColor: "#F5F5F0" }}
            />
          </div>
          <select
            className="px-4 py-2 rounded-md border-none focus:outline-none"
            style={{ backgroundColor: "#F5F5F0" }}
          >
            <option>All Stores</option>
          </select>
          <select
            className="px-4 py-2 rounded-md border-none focus:outline-none"
            style={{ backgroundColor: "#F5F5F0" }}
          >
            <option>All Status</option>
          </select>
          <button
            className="px-4 py-2 rounded-md flex items-center gap-2 font-medium"
            style={{ backgroundColor: "#F5F5F0" }}
          >
            📥 Export CSV
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead style={{ backgroundColor: "#F9F9F6" }}>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Order Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Store
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Items
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Deposco Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Tracking
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="border-t cursor-pointer hover:bg-gray-50"
                  style={{ borderColor: "#E8E8E0" }}
                  onClick={() => handleOrderClick(order)}
                >
                  <td className="px-6 py-4 text-sm" style={{ color: "#1a1a1a" }}>
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#1a1a1a" }}>
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.store}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#1a1a1a" }}>
                    {order.items}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                    {order.amount}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: order.statusColor }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                    <span style={{ color: "#5a8c5a" }}>●</span>
                    {order.deposcoStatus}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.tracking === "Track Order" ? (
                      <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                        Track Order ↗
                      </button>
                    ) : (
                      <span className="text-gray-500">{order.tracking}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <StoreOrderModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}
