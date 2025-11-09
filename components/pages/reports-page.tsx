"use client"

export default function ReportsPage() {
  const topProducts = [
    { rank: 1, name: "Gourmet Snack Collection", sku: "UB-GIFT-003", price: "$59.99", store: "Corporate Gifts Store" },
    { rank: 2, name: "Premium Wine Hamper", sku: "UB-GIFT-002", price: "$149.99", store: "Premium Hampers" },
    { rank: 3, name: "Luxury Spa Set", sku: "UB-GIFT-004", price: "$119.99", store: "Premium Hampers" },
    { rank: 4, name: "Executive Gift Box", sku: "UB-GIFT-001", price: "$89.99", store: "Corporate Gifts Store" },
    { rank: 5, name: "Tech Accessories Bundle", sku: "UB-GIFT-005", price: "$79.99", store: "Seasonal Collection" },
  ]

  const storePerformance = [
    { name: "Corporate Gifts Store", revenue: "$3299.65", orders: 2 },
    { name: "Premium Hampers", revenue: "$1499.85", orders: 1 },
    { name: "Seasonal Collection", revenue: "$679.90", orders: 1 },
    { name: "Custom Branding", revenue: "$0.00", orders: 0 },
    { name: "Eco Gifts", revenue: "$0.00", orders: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
          Reports & Analytics
        </h1>
        <p className="text-gray-600">Performance insights and trends</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1a1a1a" }}>
            <span>📦</span>
            Top Selling Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div key={product.rank}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: "#8B8B7A" }}
                  >
                    {product.rank}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: "#1a1a1a" }}>
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">{product.sku}</p>
                    <p className="text-sm text-gray-600">{product.store}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: "#1a1a1a" }}>
                      {product.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: "#1a1a1a" }}>
            <span>📈</span>
            Store Performance
          </h3>
          <div className="space-y-4">
            {storePerformance.map((store, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <p style={{ color: "#1a1a1a" }} className="font-medium">
                    {store.name}
                  </p>
                  <p className="text-right">
        <strong className="block text-right" style={{ color: "#1a1a1a" }}>
  {store.revenue}
</strong>
                    <strong className="text-xs text-gray-600">
                      <span>🛒</span> {store.orders} order{store.orders !== 1 ? "s" : ""}
                    </strong>
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(10, (Number.parseFloat(store.revenue.slice(1)) / 3500) * 100)}%`,
                      backgroundColor: "#8B8B7A",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Trends */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "#1a1a1a" }}>
          <span>📊</span>
          Order Trends
        </h3>
        <p className="text-gray-600 mt-2">Chart visualization would go here</p>
      </div>
    </div>
  )
}
