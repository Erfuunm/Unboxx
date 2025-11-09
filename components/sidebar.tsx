"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Archive,
  FileText,
  BarChart3,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard",          label: "Dashboard",    Icon: LayoutDashboard },
    { href: "/dashboard/inventory", label: "Inventory",   Icon: Package },
    { href: "/dashboard/store-orders", label: "Store Orders", Icon: ShoppingCart },
    { href: "/dashboard/bulk-orders",  label: "Bulk Orders",  Icon: Archive },
    { href: "/dashboard/invoices",    label: "Invoices",    Icon: FileText },
    { href: "/dashboard/reports",     label: "Reports",     Icon: BarChart3 },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div
      className={`${isOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden flex flex-col`}
      style={{ backgroundColor: "#192216" }}
    >
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: "#0d1110" }}>
        <div className="text-white text-xl font-semibold">Unboxx Portal</div>
        <div className="text-gray-400 text-sm">Client User</div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-4">
          Navigation
        </div>
        <div className="space-y-2">
          {navItems.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition text-sm ${
                  active
                    ? "text-white bg-opacity-20"
                    : "text-gray-300 hover:text-white"
                }`}
                style={{
                  backgroundColor: active
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
                }}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderColor: "#0d1110" }}>
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white transition text-sm"
        >
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
}