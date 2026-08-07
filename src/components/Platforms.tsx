import { useState } from 'react'
import { useVaultStore } from '@/store/useVaultStore'
import { connectPlatform, getPlatformInstructions } from '@/utils/platformConnectors'
import type { Platform } from '@/types'
import { Brain, Sparkles, Search, MessageSquare, Bot, Zap, Compass, CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'

const platformIcons: Record<Platform, React.ElementType> = {
  kimi: Brain,
  gemini: Sparkles,
  deepseek: Search,
  chatgpt: MessageSquare,
  claude: Bot,
  grok: Zap,
  perplexity: Compass,
}

export default function Platforms() {
  const { platforms, setPlatformConnected, addProjects, updatePlatformStats } = useVaultStore()
  const [connecting, setConnecting] = useState<Platform | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)

  const handleConnect = async (platform: Platform) => {
    setConnecting(platform)
    const config = platforms.find((p) => p.id === platform)
    if (!config) return

    const result = await connectPlatform(platform, config.exportMethod)

    if (result.success && result.projects) {
      setPlatformConnected(platform, true)
      addProjects(result.projects)
      updatePlatformStats(platform, result.projects.length)
    } else if (result.requiresBrowser) {
      setSelectedPlatform(platform)
    }

    setConnecting(null)
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white">Platforms</h2>
        <p className="text-vault-400 mt-1">Connect to your AI platforms to import projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => {
          const Icon = platformIcons[platform.id]
          return (
            <div
              key={platform.id}
              className={`vault-card p-6 transition-all duration-300 hover:scale-[1.02] ${
                platform.connected ? 'border-emerald-500/30' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: platform.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{platform.name}</h3>
                    <p className="text-xs text-vault-500">
                      {platform.exportMethod === 'api' ? 'API Export' : 
                       platform.exportMethod === 'browser' ? 'Browser Required' : 'Manual Import'}
                    </p>
                  </div>
                </div>
                {platform.connected ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-vault-600" />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-vault-400">Status</span>
                  <span className={platform.connected ? 'text-emerald-400' : 'text-vault-500'}>
                    {platform.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                {platform.connected && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-vault-400">Projects</span>
                    <span className="text-white font-medium">{platform.projectCount}</span>
                  </div>
                )}
                {platform.lastSync && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-vault-400">Last Sync</span>
                    <span className="text-vault-500">
                      {new Date(platform.lastSync).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleConnect(platform.id)}
                  disabled={connecting === platform.id || platform.connected}
                  className={`flex-1 vault-btn text-sm ${
                    platform.connected 
                      ? 'vault-btn-secondary cursor-default' 
                      : 'vault-btn-primary'
                  }`}
                >
                  {connecting === platform.id ? 'Connecting...' : 
                   platform.connected ? 'Connected' : 'Connect'}
                </button>
                <button
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="vault-btn-secondary px-3"
                  title="View instructions"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {selectedPlatform && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="vault-card p-6 max-w-lg w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {platforms.find((p) => p.id === selectedPlatform)?.name} Export Guide
              </h3>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-vault-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 text-sm text-vault-300">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-vault-800/50">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>{getPlatformInstructions(selectedPlatform)}</p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedPlatform(null)}
                className="vault-btn-secondary flex-1"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedPlatform(null)
                  handleConnect(selectedPlatform)
                }}
                className="vault-btn-primary flex-1"
              >
                Try Auto-Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}