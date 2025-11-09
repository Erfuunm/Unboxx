"use client"

interface BulkOrderModalProps {
  order: {
    orderNumber: string
    title: string
    customer: string
    date: string
    items: number
    amount: string
    status: string
    statusColor: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function BulkOrderModal({ order, isOpen, onClose }: BulkOrderModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
 <div className="bg-white rounded-lg overflow-y-scroll overflow-x-hidden shadow-lg max-w-4xl h-[90%] w-full mx-4" style={{ backgroundColor: "#F5F5F0" }}>
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: "#E8E8E0" }}>
          <h2 className="text-2xl font-bold" style={{ color: "#192216" }}>
            Bulk Order Details
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Information & Customer Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
                Order Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600 text-sm">Order Number:</span>
                  <p className="font-semibold" style={{ color: "#192216" }}>
                    {order.orderNumber}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Order Date:</span>
                  <p className="font-semibold" style={{ color: "#192216" }}>
                    {order.date}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Title:</span>
                  <p className="font-semibold" style={{ color: "#192216" }}>
                    {order.title}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 text-sm">Status:</span>
                  <p className="mt-1">
                    <span
                      className="px-3 py-1 rounded-full text-white text-xs font-medium"
                      style={{ backgroundColor: order.statusColor }}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
                Customer Information
              </h3>
              <div>
                <span className="text-gray-600 text-sm">Customer Name:</span>
                <p className="font-semibold" style={{ color: "#192216" }}>
                  {order.customer}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
              Shipping Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-600 text-sm">Ship Date:</span>
                <p className="font-semibold" style={{ color: "#192216" }}>
                  Not shipped yet
                </p>
              </div>
              <div>
                <span className="text-gray-600 text-sm">Tracking Link:</span>
                <p className="font-semibold text-gray-600">Not available</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
              Order Summary
            </h3>
            <div className="space-y-3 border-t pt-3" style={{ borderColor: "#E8E8E0" }}>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Items:</span>
                <p className="font-semibold" style={{ color: "#192216" }}>
                  {order.items}
                </p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: "#E8E8E0" }}>
                <span className="text-gray-700 font-semibold">Total Amount:</span>
                <p className="text-2xl font-bold" style={{ color: "#192216" }}>
                  {order.amount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
