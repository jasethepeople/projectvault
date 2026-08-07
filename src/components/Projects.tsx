import { useVaultStore } from '@/store/useVaultStore'
import { Search, Filter, CheckSquare, Square, Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import type { Platform } from '@/types'

const platformColors: Record<Platform, string> = {
  kimi: '#ff6b6b',
  gemini: '#4285f4',
  deepseek: '#4f46e5',
  chatgpt: '#10a37f',
  claude: '#d97757',
  grok: '#1a1a1a',
  perplexity: '#20b2aa',
}

export default function Projects() {
  const {
    projects,
    platforms,
    selectedPlatform,
    setSelectedPlatform,
    searchQuery,
    setSearchQuery,
    selectedProjects,
    toggleProjectSelection,
    selectAllProjects,
    deselectAllProjects,
    removeProject,
  } = useVaultStore()

  const filtered = projects.filter((p) => {
    const matchesPlatform = selectedPlatform === 'all' || p.platform === selectedPlatform
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesPlatform && matchesSearch
  })

  const allSelected = filtered.length > 0 && filtered.every((p) => selectedProjects.has(p.id))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <p className="text-vault-400 mt-1">{projects.length} total projects across all platforms</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-vault-400">
            {selectedProjects.size} selected
          </span>
          {selectedProjects.size > 0 && (
            <button
              onClick={deselectAllProjects}
              className="vault-btn-secondary text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vault-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-vault-900 border border-vault-700 text-white placeholder-vault-500 focus:outline-none focus:border-vault-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-vault-500" />
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as Platform | 'all')}
            className="px-4 py-2.5 rounded-lg bg-vault-900 border border-vault-700 text-white focus:outline-none focus:border-vault-500"
          >
            <option value="all">All Platforms</option>
            {platforms.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="vault-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-vault-700">
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={allSelected ? deselectAllProjects : selectAllProjects}
                    className="text-vault-400 hover:text-white transition-colors"
                  >
                    {allSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-vault-400">Project</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-vault-400">Platform</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-vault-400">Updated</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-vault-400">Tags</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-vault-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className={`border-b border-vault-800/50 hover:bg-vault-800/30 transition-colors ${
                    selectedProjects.has(project.id) ? 'bg-vault-500/5' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleProjectSelection(project.id)}
                      className="text-vault-400 hover:text-white transition-colors"
                    >
                      {selectedProjects.has(project.id) ? (
                        <CheckSquare className="w-5 h-5 text-vault-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{project.title}</p>
                      <p className="text-xs text-vault-500">{project.messages.length} messages</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: `${platformColors[project.platform]}20`,
                        color: platformColors[project.platform],
                      }}
                    >
                      {project.platform}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-vault-400">
                    {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-full bg-vault-700/50 text-xs text-vault-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1.5 rounded-lg hover:bg-vault-700 text-vault-400 hover:text-white transition-colors"
                        title="Preview"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-vault-400 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-vault-500">
            <p>No projects found. Connect a platform to import your work.</p>
          </div>
        )}
      </div>
    </div>
  )
}