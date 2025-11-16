// components/pages/inventory-page.tsx
"use client"

import { Fragment, useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase-client"
import { toast } from "sonner"
import { ArrowRightIcon } from "lucide-react"

interface Variant {
  variant_sku: string
  size: string | null
  color: string | null
  stock: number
  min_stock: number
}

interface Product {
  id: number
  sku: string
  name: string
  store: { name: string }
  variants: Variant[]
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [expandedRows, setExpandedRows] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseBrowserClient()

  const fetchInventory = async () => {
    setLoading(true)
    debugger
    const { data, error } = await supabase
      .from('Product')
      .select(`
        id,
        sku,
        name,
        store:Store!inner (name),
        variants:ProductVariant (
          variant_sku,
          size,
          color,
          stock,
          min_stock
        )
      `)
      .order('name')

    if (error) {
      toast.error("Failed to load inventory")
      console.error("Supabase error:", error)
    } else {
      setProducts(data || [])
      toast.success(`Loaded ${data?.length} products`)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchInventory()

    const channel = supabase
      .channel('inventory-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Product' }, fetchInventory)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ProductVariant' }, fetchInventory)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const filtered = products.filter(p =>
    p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleRow = (id: number) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleExpandAll = () => {
    setExpandedRows(expandedRows.length === filtered.length ? [] : filtered.map(p => p.id))
  }

  const getStatus = (stock: number, min: number) => {
    return stock <= min ? { text: "Low Stock", color: "#DC3545" } : { text: "In Stock", color: "#475346" }
  }

  const lowStockCount = products.reduce((acc, p) => {
    const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0)
    const totalMin = p.variants.reduce((sum, v) => sum + v.min_stock, 0)
    const isLow = totalStock <= totalMin
    return acc + (isLow ? 1 : 0)
  }, 0)

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading inventory...</div>
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "#192216" }}>
            Inventory Management
          </h1>
          <p className="text-base" style={{ color: "#475346" }}>
            Monitor stock levels across your stores
          </p>
        </div>
        {lowStockCount > 0 && (
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
            Warning {lowStockCount} Low Stock
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative">
          
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:border-emerald-500 transition"
            style={{ backgroundColor: "#ffffff", borderColor: "#dee2da" }}
          />
        </div>
        <button
          onClick={toggleExpandAll}
          className="px-6 py-3 rounded-xl font-medium border-2 flex items-center gap-2 transition hover:bg-gray-50"
          style={{ borderColor: "#dee2da", color: "#192216" }}
        >
          {expandedRows.length === filtered.length ? "Collapse" : "Expand"} All
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead style={{ backgroundColor: "#dee2da" }}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: "#192216" }}>SKU</th>
              <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: "#192216" }}>Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: "#192216" }}>Store</th>
              <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: "#192216" }}>Total SOH</th>
              <th className="px-6 py-4 text-left text-sm font-bold" style={{ color: "#192216" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const totalStock = product.variants.reduce((a, v) => a + v.stock, 0)
              const totalMin = product.variants.reduce((a, v) => a + v.min_stock, 0)
              const status = getStatus(totalStock, totalMin)

              return (
                <Fragment key={product.id}>
                  <tr
                    className="border-t cursor-pointer hover:bg-emerald-50 transition"
                    style={{ borderColor: "#dee2da" }}
                    onClick={() => toggleRow(product.id)}
                  >
                    <td className="px-6 py-4 text-sm flex items-center gap-3 font-medium">
                      <span className={`transition-transform ${expandedRows.includes(product.id) ? "rotate-90" : ""}`}>
                        <ArrowRightIcon />
                      </span>
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-gray-600">{product.store.name}</td>
                    <td className="px-6 py-4 font-bold">{totalStock}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: status.color }}>
                        {status.text}
                      </span>
                    </td>
                  </tr>

                  {expandedRows.includes(product.id) && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 bg-gray-50">
                        <div className="space-y-4">
                          <h3 className="font-bold text-lg">Product Variants</h3>
                          <table className="w-full">
                            <thead>
                              <tr style={{ backgroundColor: "#dee2da" }}>
                                <th className="px-4 py-3 text-left text-xs font-bold">Variant SKU</th>
                                <th className="px-4 py-3 text-left text-xs font-bold">Size</th>
                                <th className="px-4 py-3 text-left text-xs font-bold">Color</th>
                                <th className="px-4 py-3 text-left text-xs font-bold">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-bold">Min Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-bold">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.variants.map((v) => {
                                const vStatus = getStatus(v.stock, v.min_stock)
                                return (
                                  <tr key={v.variant_sku} className="border-t">
                                    <td className="px-4 py-3 text-xs font-mono">{v.variant_sku}</td>
                                    <td className="px-4 py-3 text-xs">{v.size || "-"}</td>
                                    <td className="px-4 py-3 text-xs">{v.color || "-"}</td>
                                    <td className="px-4 py-3 text-xs font-medium">{v.stock}</td>
                                    <td className="px-4 py-3 text-xs">{v.min_stock}</td>
                                    <td className="px-4 py-3 text-xs">
                                      <span className="px-2 py-1 rounded-full text-white text-xs font-bold" style={{ backgroundColor: vStatus.color }}>
                                        {vStatus.text}
                                      </span>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}