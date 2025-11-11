"use client";

import {
  X,
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
} from "lucide-react";

interface StoreOrderModalProps {
  order: {
    orderNumber: string;
    customer: string;
    store: string;
    date: string;
    items: number;
    amount: string;
    status: string;
    statusColor: string;
    deposcoStatus: string;
    tracking: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreOrderModal({ order, isOpen, onClose }: StoreOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "#F5F5F0" }}
      >
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-start" style={{ borderColor: "#E8E8E0" }}>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "#192216" }}>
              Order Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete information for order {order.orderNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <button
              className="ml-4 px-4 py-2 flex items-center gap-2 font-medium rounded-md transition hover:opacity-90"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #DEE2DA" }}
            >
              <Printer className="w-5 h-5" strokeWidth={1.5} />
              Print PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Information & Customer Details */}
          <div className="grid grid-cols-2 gap-6">
            {/* Order Information */}
            <div className="bg-white p-6 rounded-lg" style={{ backgroundColor: "#FFFFFF" }}>
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
                  <span className="text-gray-600 text-sm">Store:</span>
                  <p className="font-semibold" style={{ color: "#192216" }}>
                    {order.store}
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
            
            <div className="bg-white p-6 rounded-lg" style={{ backgroundColor: "#FFFFFF" }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
                Customer Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-gray-600 text-sm">Customer Name</p>
                    <p className="font-semibold" style={{ color: "#192216" }}>
                      {order.customer}
                    
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold" style={{ color: "#192216" }}>
                      customer@example.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" strokeWidth={1.5} />
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold" style={{ color: "#192216" }}>
                      +61 400 000 000
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
              Shipping Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="font-semibold" style={{ color: "#192216" }}>
                    123 Business Street
                  </p>
                  <p className="text-gray-600">Sydney NSW 2000, Australia</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-gray-600 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-gray-600 text-sm">
                    Deposco Status:{" "}
                    <span className="font-semibold text-gray-800">In Warehouse</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-4" style={{ color: "#192216" }}>
              Order Items
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #E8E8E0" }}>
                    <th className="text-left py-2 font-semibold text-gray-700">SKU</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Product Name</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Quantity</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid #E8E8E0" }}>
                    <td className="py-3">UB-GIFT-001</td>
                    <td className="py-3">Executive Gift Box</td>
                    <td className="py-3">2</td>
                    <td className="py-3">$89.99</td>
                    <td className="py-3 font-semibold">$179.98</td>
                  </tr>
                  <tr>
                    <td className="py-3">UB-GIFT-002</td>
                    <td className="py-3">Premium Wine Hamper</td>
                    <td className="py-3">1</td>
                    <td className="py-3">$149.99</td>
                    <td className="py-3 font-semibold">$149.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}