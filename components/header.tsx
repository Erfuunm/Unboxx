"use client"

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b px-6 py-4 flex items-center" style={{ borderColor: "#E0E0D4" }}>
      <button
        onClick={onMenuClick}
        className="p-2 hover:bg-gray-100 rounded-md transition text-xl"
        style={{ color: "#2d3d2d" }}
      >
        ☰
      </button>
    </header>
  )
}
