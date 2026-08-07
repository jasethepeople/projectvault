import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIProject, PlatformConfig, ExportJob, ExportOptions, Platform } from '@/types'

interface VaultState {
  platforms: PlatformConfig[]
  setPlatformConnected: (platform: Platform, connected: boolean) => void
  updatePlatformStats: (platform: Platform, count: number) => void

  projects: AIProject[]
  addProjects: (projects: AIProject[]) => void
  removeProject: (id: string) => void
  clearProjects: () => void

  jobs: ExportJob[]
  addJob: (job: ExportJob) => void
  updateJob: (id: string, updates: Partial<ExportJob>) => void
  removeJob: (id: string) => void

  selectedPlatform: Platform | 'all'
  setSelectedPlatform: (platform: Platform | 'all') => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedProjects: Set<string>
  toggleProjectSelection: (id: string) => void
  selectAllProjects: () => void
  deselectAllProjects: () => void

  exportOptions: ExportOptions
  setExportOptions: (options: Partial<ExportOptions>) => void
}

const defaultPlatforms: PlatformConfig[] = [
  { id: 'kimi', name: 'Kimi AI', icon: 'Brain', color: '#ff6b6b', connected: false, exportMethod: 'browser', projectCount: 0 },
  { id: 'gemini', name: 'Gemini', icon: 'Sparkles', color: '#4285f4', connected: false, exportMethod: 'api', projectCount: 0 },
  { id: 'deepseek', name: 'DeepSeek', icon: 'Search', color: '#4f46e5', connected: false, exportMethod: 'api', projectCount: 0 },
  { id: 'chatgpt', name: 'ChatGPT', icon: 'MessageSquare', color: '#10a37f', connected: false, exportMethod: 'api', projectCount: 0 },
  { id: 'claude', name: 'Claude', icon: 'Bot', color: '#d97757', connected: false, exportMethod: 'browser', projectCount: 0 },
  { id: 'grok', name: 'Grok', icon: 'Zap', color: '#1a1a1a', connected: false, exportMethod: 'browser', projectCount: 0 },
  { id: 'perplexity', name: 'Perplexity', icon: 'Compass', color: '#20b2aa', connected: false, exportMethod: 'browser', projectCount: 0 },
]

export const useVaultStore = create<VaultState>()(
  persist(
    (set, get) => ({
      platforms: defaultPlatforms,
      projects: [],
      jobs: [],
      selectedPlatform: 'all',
      searchQuery: '',
      selectedProjects: new Set(),
      exportOptions: {
        format: 'markdown',
        includeMetadata: true,
        includeAttachments: true,
        organizeBy: 'platform',
      },

      setPlatformConnected: (platform, connected) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platform ? { ...p, connected, lastSync: connected ? new Date().toISOString() : undefined } : p
          ),
        })),

      updatePlatformStats: (platform, count) =>
        set((state) => ({
          platforms: state.platforms.map((p) =>
            p.id === platform ? { ...p, projectCount: count } : p
          ),
        })),

      addProjects: (projects) =>
        set((state) => {
          const existingIds = new Set(state.projects.map((p) => p.id))
          const newProjects = projects.filter((p) => !existingIds.has(p.id))
          return { projects: [...state.projects, ...newProjects] }
        }),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          selectedProjects: new Set([...state.selectedProjects].filter((sid) => sid !== id)),
        })),

      clearProjects: () => set({ projects: [], selectedProjects: new Set() }),

      addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),

      updateJob: (id, updates) =>
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
        })),

      removeJob: (id) => set((state) => ({ jobs: state.jobs.filter((j) => j.id !== id) })),

      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleProjectSelection: (id) =>
        set((state) => {
          const newSet = new Set(state.selectedProjects)
          if (newSet.has(id)) newSet.delete(id)
          else newSet.add(id)
          return { selectedProjects: newSet }
        }),

      selectAllProjects: () =>
        set((state) => {
          const filtered = getFilteredProjects(state.projects, state.selectedPlatform, state.searchQuery)
          return { selectedProjects: new Set(filtered.map((p) => p.id)) }
        }),

      deselectAllProjects: () => set({ selectedProjects: new Set() }),

      setExportOptions: (options) =>
        set((state) => ({ exportOptions: { ...state.exportOptions, ...options } })),
    }),
    {
      name: 'projectvault-storage',
      partialize: (state) => ({ platforms: state.platforms, exportOptions: state.exportOptions }),
    }
  )
)

function getFilteredProjects(projects: AIProject[], platform: Platform | 'all', query: string) {
  return projects.filter((p) => {
    const matchesPlatform = platform === 'all' || p.platform === platform
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    return matchesPlatform && matchesQuery
  })
}