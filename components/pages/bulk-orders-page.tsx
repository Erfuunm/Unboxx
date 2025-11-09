"use client"

import { useState } from "react"
import BulkOrderModal from "../bulk-order-modal"

export default function BulkOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const orders = [
    {
      orderNumber: "BLK-2025-001",
      title: "Corporate Welcome Kits - Q4",
      customer: "Fortune 500 Corp",
      date: "2025-10-08",
      items: 500,
      amount: "$15000.00",
      status: "Processing",
      statusColor: "#0099FF",
      tracking: "No tracking",
    },
    {
      orderNumber: "BLK-2025-002",
      title: "Employee Recognition Gifts",
      customer: "Tech Giant Inc",
      date: "2025-10-01",
      items: 300,
      amount: "$8500.00",
      status: "Shipped",
      statusColor: "#1a1a1a",
      tracking: "Track Order",
    },
    {
      orderNumber: "BLK-2025-003",
      title: "Client Appreciation Hampers",
      customer: "Financial Services Co",
      date: "2025-10-10",
      items: 800,
      amount: "$22000.00",
      status: "Pending",
      statusColor: "#FFA500",
      tracking: "No tracking",
    },
    {
      orderNumber: "BLK-2025-004",
      title: "Conference Swag Bags",
      customer: "Event Management Ltd",
      date: "2025-09-20",
      items: 1000,
      amount: "$12500.00",
      status: "Delivered",
      statusColor: "#5a8c5a",
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
            Bulk Orders
          </h1>
          <p className="text-gray-600">Manage bulk orders linked to Hoops CRM</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Search by order number, customer, or title..."
              className="w-full pl-10 pr-4 py-2 rounded-md border-none focus:outline-none"
              style={{ backgroundColor: "#F5F5F0" }}
            />
          </div>
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
                  Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  Customer
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
                    {order.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
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
        <BulkOrderModal order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </>
  )
}
