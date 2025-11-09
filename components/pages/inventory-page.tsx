"use client"

import { useState } from "react"

export default function InventoryPage() {
  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const products = [
    {
      id: "UB-GIFT-003",
      name: "Gourmet Snack Collection",
      store: "Corporate Gifts Store",
      soh: 67,
      status: "In Stock",
      statusColor: "#475346",
      variants: [
        {
          variantSku: "UB-GIFT-003-S",
          size: "Small",
          color: "-",
          stock: 30,
          minStock: 20,
          status: "In Stock",
          statusColor: "#475346",
        },
        {
          variantSku: "UB-GIFT-003-L",
          size: "Large",
          color: "-",
          stock: 37,
          minStock: 25,
          status: "In Stock",
          statusColor: "#475346",
        },
      ],
    },
    {
      id: "UB-GIFT-004",
      name: "Luxury Spa Set",
      store: "Premium Hampers",
      soh: 8,
      status: "Low Stock",
      statusColor: "#DC3545",
      variants: [
        {
          variantSku: "UB-GIFT-004-A",
          size: "Standard",
          color: "-",
          stock: 5,
          minStock: 15,
          status: "Low Stock",
          statusColor: "#DC3545",
        },
        {
          variantSku: "UB-GIFT-004-B",
          size: "Premium",
          color: "-",
          stock: 3,
          minStock: 10,
          status: "Low Stock",
          statusColor: "#DC3545",
        },
      ],
    },
    {
      id: "UB-GIFT-005",
      name: "Tech Accessories Bundle",
      store: "Seasonal Collection",
      soh: 34,
      status: "In Stock",
      statusColor: "#475346",
      variants: [
        {
          variantSku: "UB-GIFT-005-1",
          size: "Bundle",
          color: "-",
          stock: 34,
          minStock: 20,
          status: "In Stock",
          statusColor: "#475346",
        },
      ],
    },
    {
      id: "UB-GIFT-002",
      name: "Premium Wine Hamper",
      store: "Premium Hampers",
      soh: 12,
      status: "Low Stock",
      statusColor: "#DC3545",
      variants: [
        {
          variantSku: "UB-GIFT-002-1",
          size: "Standard",
          color: "-",
          stock: 12,
          minStock: 25,
          status: "Low Stock",
          statusColor: "#DC3545",
        },
      ],
    },
    {
      id: "UB-GIFT-001",
      name: "Executive Gift Box",
      store: "Corporate Gifts Store",
      soh: 45,
      status: "In Stock",
      statusColor: "#475346",
      variants: [
        {
          variantSku: "UB-GIFT-001-1",
          size: "Standard",
          color: "-",
          stock: 45,
          minStock: 30,
          status: "In Stock",
          statusColor: "#475346",
        },
      ],
    },
  ]

  const toggleRow = (productId: string) => {
    setExpandedRows((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const toggleExpandAll = () => {
    if (expandedRows.length === products.length) {
      setExpandedRows([])
    } else {
      setExpandedRows(products.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#192216" }}>
            Inventory Management
          </h1>
          <p className="text-base" style={{ color: "#475346" }}>
            Monitor stock levels across all stores
          </p>
        </div>
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
          ⚠ 2 Low Stock
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-3 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            className="w-full pl-12 pr-4 py-2 rounded-lg border-2 focus:outline-none transition"
            style={{ backgroundColor: "#ffffff", borderColor: "#dee2da", color: "#192216" }}
          />
        </div>
        <select
          className="px-4 py-2 rounded-lg border-2 focus:outline-none transition font-medium"
          style={{ backgroundColor: "#ffffff", borderColor: "#dee2da", color: "#192216" }}
        >
          <option>All Stores</option>
        </select>
        <select
          className="px-4 py-2 rounded-lg border-2 focus:outline-none transition font-medium"
          style={{ backgroundColor: "#ffffff", borderColor: "#dee2da", color: "#192216" }}
        >
          <option>All Status</option>
        </select>
        <button
          onClick={toggleExpandAll}
          className="px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
          style={{ backgroundColor: "#ffffff", borderColor: "#dee2da", border: "2px solid", color: "#192216" }}
        >
          ▼ Expand All
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-lg shadow-sm" style={{ overflow: "auto" }}>
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: "#dee2da" }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#192216", width: "120px" }}>
                SKU
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#192216", width: "250px" }}>
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#192216", width: "200px" }}>
                Store
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#192216", width: "120px" }}>
                Total SOH
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#192216", width: "140px" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tbody key={product.id} style={{ display: "contents" }}>
                <tr
                  className="border-t cursor-pointer hover:bg-gray-50 transition"
                  style={{ borderColor: "#dee2da" }}
                  onClick={() => toggleRow(product.id)}
                >
                  <td className="px-6 py-4 text-sm flex items-center gap-3" style={{ color: "#192216" }}>
                    <span
                      className={`transition-transform inline-block ${expandedRows.includes(product.id) ? "rotate-90" : ""}`}
                    >
                      ▶
                    </span>
                    {product.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: "#192216" }}>
                    {product.name}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: "#475346" }}>
                    {product.store}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#192216" }}>
                    {product.soh}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className="px-3 py-1 rounded-full text-white text-xs font-medium inline-block"
                      style={{ backgroundColor: product.statusColor }}
                    >
                      {product.status}
                    </span>
                  </td>
                </tr>

                {expandedRows.includes(product.id) && (
                  <tr style={{ backgroundColor: "#f5f5f5", display: "table-row" }}>
                    <td colSpan={5} className="px-6 py-4" style={{ paddingTop: "16px", paddingBottom: "16px" }}>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm" style={{ color: "#192216" }}>
                          Product Variants
                        </h3>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr style={{ backgroundColor: "#dee2da" }}>
                              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#192216" }}>
                                Variant SKU
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#192216" }}>
                                Size
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#192216" }}>
                                Color
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#192216" }}>
                                Stock on Hand
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#192216" }}>
                                Min Stock Level
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-semibold" style={{ color: "#192216" }}>
                                Stock Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.variants.map((variant, idx) => (
                              <tr
                                key={idx}
                                style={{ backgroundColor: "#ffffff", borderColor: "#dee2da" }}
                                className="border-t"
                              >
                                <td className="px-4 py-3 text-xs font-medium" style={{ color: "#192216" }}>
                                  {variant.variantSku}
                                </td>
                                <td className="px-4 py-3 text-xs" style={{ color: "#475346" }}>
                                  {variant.size}
                                </td>
                                <td className="px-4 py-3 text-xs" style={{ color: "#475346" }}>
                                  {variant.color}
                                </td>
                                <td className="px-4 py-3 text-xs font-medium" style={{ color: "#192216" }}>
                                  {variant.stock}
                                </td>
                                <td className="px-4 py-3 text-xs" style={{ color: "#475346" }}>
                                  {variant.minStock}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                  <span
                                    className="px-2 py-1 rounded-full text-white text-xs font-medium inline-block"
                                    style={{ backgroundColor: variant.statusColor }}
                                  >
                                    {variant.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
