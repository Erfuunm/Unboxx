// components/store-order-modal.tsx
"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import { X, Printer, User, Mail, Phone, MapPin, Package, Truck, Building2 } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: number;
  order_number: string;
  customer: string; // This is Customer.name (company name)
  store: string;
  date: string;
  qty: number;
  amount: number;
  status: string;
  deposco_status: string;
}

interface OrderItem {
  sku: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  full_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface Tracking {
  tracking_number: string;
  carrier: string;
  tracking_url: string;
  estimated_delivery: string | null;
}

interface CompanyInfo {
  name: string;
  first_name: string;
  surname: string;
  email: string;
  phone: string;
}

interface StoreOrderModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

export default function StoreOrderModal({ order, isOpen, onClose }: StoreOrderModalProps) {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shipping, setShipping] = useState<ShippingAddress | null>(null);
  const [tracking, setTracking] = useState<Tracking | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!isOpen || !order?.id) return;

    const fetchDetails = async () => {
      setLoading(true);

      // 1. Get Company Info (from Customer table via Profile → customer_id)
      let company: CompanyInfo | null = null;
      const { data: profileData } = await supabase
        .from('Profile')
        .select('customer_id')
        .eq('email', (await supabase.auth.getUser()).data.user?.email)
        .single();

      if (profileData?.customer_id) {
        const { data: cust } = await supabase
          .from('Customer')
          .select('name, first_name, surname, email, phone')
          .eq('id', profileData.customer_id)
          .single();
        if (cust) {
          company = {
            name: cust.name,
            first_name: cust.first_name,
            surname: cust.surname,
            email: cust.email || '—',
            phone: cust.phone || '—',
          };
        }
      }

      // 2. Get Order Items, Shipping, Tracking
      const [itemsRes, shippingRes, trackingRes] = await Promise.all([
        supabase.from("OrderItem").select("sku, product_name, quantity, price").eq("order_id", order.id),
        supabase.from("ShippingAddress").select("*").eq("order_id", order.id).maybeSingle(),
        supabase.from("Tracking").select("*").eq("order_id", order.id).maybeSingle(),
      ]);

      setCompanyInfo(company);
      setItems(itemsRes.data || []);
      setShipping(shippingRes.data);
      setTracking(trackingRes.data);
      setLoading(false);
    };

    fetchDetails();
  }, [order?.id, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return '#0099FF';
      case 'Shipped': return '#1a1a1a';
      case 'Pending': return '#FFA500';
      case 'Delivered': return '#5a8c5a';
      case 'Cancelled': return '#FF4444';
      default: return '#888';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b flex justify-between items-start" style={{ borderColor: "#E8E8E0" }}>
          <div>
            <h2 className="text-3xl font-bold" style={{ color: "#192216" }}>
              Order #{order.order_number}
            </h2>
            <p className="text-gray-600 mt-1">
              {new Date(order.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="p-3 hover:bg-gray-100 rounded-lg transition">
              <Printer className="w-6 h-6" />
            </button>
            <button onClick={onClose} className="p-3 hover:bg-gray-100 rounded-lg transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center text-gray-600">Loading order details...</div>
        ) : (
          <div className="p-8 space-y-8">
            {/* Top Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Company Info (Billed To) */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  Billed To (Your Company)
                </h3>
                {companyInfo ? (
                  <div className="space-y-3">
                    <p className="text-2xl font-bold">{companyInfo.name}</p>
                    <p className="text-lg">
                      {companyInfo.first_name} {companyInfo.surname}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" /> {companyInfo.email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" /> {companyInfo.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Company info not found</p>
                )}
              </div>

              {/* Shipping Address (Ship To) */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Ship To (Delivery)
                </h3>
                {shipping ? (
                  <div className="space-y-3">
                    <p className="text-xl font-bold">{shipping.full_name}</p>
                    <p className="text-gray-700">
                      {shipping.address_line1}<br />
                      {shipping.address_line2 && <>{shipping.address_line2}<br /></>}
                      {shipping.city}, {shipping.state} {shipping.postal_code}<br />
                      {shipping.country}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" /> {shipping.email}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4" /> {shipping.phone}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No shipping address</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-gray-600 text-sm">Store</p>
                  <p className="font-bold text-lg">{order.store}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Items</p>
                  <p className="font-bold text-lg">{order.qty}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-bold text-2xl" style={{ color: "#192216" }}>
                    ${order.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className="inline-block px-4 py-2 rounded-full text-white font-bold" style={{ backgroundColor: getStatusColor(order.status) }}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking */}
            {tracking && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl">
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <Truck className="w-6 h-6" />
                  Tracking Information
                </h3>
                <div className="space-y-2">
                  <p><strong>Carrier:</strong> {tracking.carrier}</p>
                  <p><strong>Tracking #:</strong> {tracking.tracking_number}</p>
                  {tracking.estimated_delivery && (
                    <p><strong>ETA:</strong> {new Date(tracking.estimated_delivery).toLocaleDateString()}</p>
                  )}
                  {tracking.tracking_url && (
                    <a href={tracking.tracking_url} target="_blank" className="inline-block mt-3 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-medium">
                      Track Package
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="font-bold text-xl mb-4">Order Items</h3>
              {items.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 font-bold">SKU</th>
                      <th className="text-left py-3 font-bold">Product</th>
                      <th className="text-center py-3 font-bold">Qty</th>
                      <th className="text-right py-3 font-bold">Price</th>
                      <th className="text-right py-3 font-bold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-4 font-mono">{item.sku}</td>
                        <td className="py-4">{item.product_name}</td>
                        <td className="py-4 text-center">{item.quantity}</td>
                        <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                        <td className="py-4 text-right font-bold">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center py-8 text-gray-500">No items found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}