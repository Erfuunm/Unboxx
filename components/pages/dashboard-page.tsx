"use client"

export default function DashboardPage() {
  const metrics = [
    {
      title: "Store Orders - Processing",
      value: "38",
      subtitle: "142 total orders",
      icon: "🛒",
    },
    {
      title: "Bulk Orders - Processing",
      value: "7",
      subtitle: "14 total orders",
      icon: "⚙",
    },
    {
      title: "Low Stock Items",
      value: "8",
      subtitle: "Below threshold",
      icon: "⚠",
      color: "#DC3545",
    },
  ]

  const orderStatusData = [
    { label: "Processing", value: 45, color: "#0099FF" },
    { label: "Shipped", value: 67, color: "#1a1a1a" },
    { label: "Delivered", value: 20, color: "#888888" },
  ]

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
            <span>📈</span>
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
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(item.value / 100) * 100}%`,
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
            <span>💵</span>
            Revenue Summary
          </h3>
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold" style={{ color: "#1a1a1a" }}>
                $125,340.50
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Avg. Order Value</p>
                <p className="text-xl font-bold" style={{ color: "#1a1a1a" }}>
                  $803.46
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
