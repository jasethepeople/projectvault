import { useVaultStore } from '@/store/useVaultStore'
import { Folder, Download, HardDrive, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function Dashboard() {
  const { platforms, projects, jobs } = useVaultStore()

  const connectedPlatforms = platforms.filter((p) => p.connected)
  const totalProjects = projects.length
  const completedExports = jobs.filter((j) => j.status === 'completed').length
  const recentProjects = projects.slice(-5).reverse()

  const stats = [
    { label: 'Connected Platforms', value: connectedPlatforms.length, icon: HardDrive, color: 'text-vault-400' },
    { label: 'Total Projects', value: totalProjects, icon: Folder, color: 'text-emerald-400' },
    { label: 'Exports Completed', value: completedExports, icon: Download, color: 'text-amber-400' },
    { label: 'Platforms Available', value: platforms.length, icon: TrendingUp, color: 'text-purple-400' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-vault-400 mt-1">Overview of your AI projects across all platforms</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="vault-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-vault-400 mt-1">{stat.label}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="vault-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Platform Status</h3>
          <Link to="/platforms" className="text-sm text-vault-400 hover:text-vault-300 flex items-center gap-1">
            Manage <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`p-4 rounded-lg border text-center transition-all ${
                platform.connected
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-vault-800/30 border-vault-700/30'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: platform.connected ? '#10b981' : '#475569' }}
              />
              <p className="text-xs font-medium text-white">{platform.name}</p>
              <p className="text-xs text-vault-500 mt-1">
                {platform.connected ? `${platform.projectCount} projects` : 'Not connected'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="vault-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Projects</h3>
          <Link to="/projects" className="text-sm text-vault-400 hover:text-vault-300 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {recentProjects.length === 0 ? (
          <div className="text-center py-8 text-vault-500">
            <p>No projects yet. Connect a platform to get started.</p>
            <Link to="/platforms" className="vault-btn-primary inline-block mt-4">
              Connect Platforms
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg bg-vault-800/30 hover:bg-vault-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: platforms.find((p) => p.id === project.platform)?.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{project.title}</p>
                    <p className="text-xs text-vault-500">
                      {project.platform} • {format(new Date(project.updatedAt), 'PP')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-vault-700/50 text-xs text-vault-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}