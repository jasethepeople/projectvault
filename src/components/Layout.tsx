import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Plug, FolderOpen, Download, Settings, Vault } from 'lucide-react'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/platforms', icon: Plug, label: 'Platforms' },
  { path: '/projects', icon: FolderOpen, label: 'Projects' },
  { path: '/export', icon: Download, label: 'Export' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-vault-950">
      <aside className="w-64 bg-vault-900/80 border-r border-vault-800 flex flex-col">
        <div className="p-6 border-b border-vault-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-500 flex items-center justify-center">
              <Vault className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white">ProjectVault</h1>
              <p className="text-xs text-vault-400">AI Project Exporter</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-vault-500/20 text-vault-300 border border-vault-500/30'
                    : 'text-vault-400 hover:bg-vault-800/50 hover:text-vault-200'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-vault-800">
          <div className="vault-card p-3">
            <p className="text-xs text-vault-400">v1.0.0</p>
            <p className="text-xs text-vault-500 mt-1">Universal AI Exporter</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}