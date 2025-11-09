"use client"

export default function InvoicesPage() {
  const invoices = [
    {
      number: "INV-2025-001",
      description: "Monthly subscription and services",
      invoiceDate: "2025-10-01",
      dueDate: "2025-10-15",
      amount: "$2850.00",
      status: "Paid",
      statusColor: "#5a8c5a",
    },
    {
      number: "INV-2025-004",
      description: "Corporate gift boxes",
      invoiceDate: "2025-10-15",
      dueDate: "2025-11-01",
      amount: "$3200.00",
      status: "Outstanding",
      statusColor: "#FFA500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
          Invoices
        </h1>
        <p className="text-gray-600">View and manage QuickBooks invoices</p>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-3 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search by invoice number, company, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-md border-none focus:outline-none"
            style={{ backgroundColor: "#F5F5F0" }}
          />
        </div>
        <select className="px-4 py-2 rounded-md border-none focus:outline-none" style={{ backgroundColor: "#F5F5F0" }}>
          <option>All Status</option>
        </select>
        <button
          className="px-4 py-2 rounded-md flex items-center gap-2 font-medium"
          style={{ backgroundColor: "#F5F5F0" }}
        >
          📥 Export CSV
        </button>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center gap-2" style={{ borderColor: "#E8E8E0" }}>
          <span>📄</span>
          <h3 className="text-lg font-bold" style={{ color: "#1a1a1a" }}>
            Invoice List
          </h3>
        </div>

        <table className="w-full">
          <thead style={{ backgroundColor: "#F9F9F6" }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Invoice Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Invoice Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Due Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Amount
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="border-t" style={{ borderColor: "#E8E8E0" }}>
                <td className="px-6 py-4 text-sm" style={{ color: "#1a1a1a" }}>
                  {invoice.number}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.invoiceDate}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1a1a1a" }}>
                  {invoice.amount}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className="px-3 py-1 rounded-full text-white text-xs font-medium"
                    style={{ backgroundColor: invoice.statusColor }}
                  >
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
