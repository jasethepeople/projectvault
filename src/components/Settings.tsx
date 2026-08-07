import { useVaultStore } from '@/store/useVaultStore'
import { Database, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const { projects, clearProjects, jobs } = useVaultStore()
  const [cleared, setCleared] = useState(false)

  const handleClear = () => {
    if (confirm('Are you sure? This will remove all imported projects.')) {
      clearProjects()
      setCleared(true)
      setTimeout(() => setCleared(false), 2000)
    }
  }

  const storageUsed = projects.reduce((acc, p) => {
    return acc + JSON.stringify(p).length
  }, 0)

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-vault-400 mt-1">Manage your ProjectVault configuration</p>
      </div>

      <div className="vault-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-vault-400" />
          <h3 className="text-lg font-semibold text-white">Storage</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-vault-400">Total Projects</span>
            <span className="text-sm font-medium text-white">{projects.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-vault-400">Storage Used</span>
            <span className="text-sm font-medium text-white">
              {(storageUsed / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-vault-400">Export Jobs</span>
            <span className="text-sm font-medium text-white">{jobs.length}</span>
          </div>
        </div>
      </div>

      <div className="vault-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Data Management</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <div>
              <p className="text-sm font-medium text-white">Clear All Projects</p>
              <p className="text-xs text-vault-500 mt-1">Remove all imported data. This cannot be undone.</p>
            </div>
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              {cleared ? <CheckCircle2 className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
              {cleared ? 'Cleared' : 'Clear All'}
            </button>
          </div>
        </div>
      </div>

      <div className="vault-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">About ProjectVault</h3>
        <div className="space-y-2 text-sm text-vault-400">
          <p>Version 1.0.0</p>
          <p>Universal AI Project Exporter</p>
          <p>Supports: Kimi, Gemini, DeepSeek, ChatGPT, Claude, Grok, Perplexity</p>
          <p className="mt-4 text-vault-500">
            ProjectVault helps you consolidate and export your AI conversations and projects 
            from multiple platforms into organized, portable formats.
          </p>
        </div>
      </div>
    </div>
  )
}