import { useState } from 'react'
import { useVaultStore } from '@/store/useVaultStore'
import { ExportEngine, generateFilename } from '@/utils/exportEngine'
import { Download, FileText, Code, FileCode, Archive, CheckCircle2, Loader2 } from 'lucide-react'
import type { ExportFormat } from '@/types'

const formats: { id: ExportFormat; label: string; icon: React.ElementType; desc: string }[] = [
  { id: 'markdown', label: 'Markdown', icon: FileText, desc: 'Clean .md files, perfect for docs' },
  { id: 'json', label: 'JSON', icon: Code, desc: 'Structured data with full metadata' },
  { id: 'html', label: 'HTML', icon: FileCode, desc: 'Self-contained web pages' },
  { id: 'zip', label: 'ZIP Archive', icon: Archive, desc: 'Organized folder structure' },
]

const organizeOptions = [
  { value: 'platform', label: 'By Platform' },
  { value: 'date', label: 'By Date' },
  { value: 'topic', label: 'Flat (No folders)' },
]

export default function Export() {
  const { projects, selectedProjects, exportOptions, setExportOptions, addJob, updateJob } = useVaultStore()
  const [exporting, setExporting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const projectsToExport = selectedProjects.size > 0
    ? projects.filter((p) => selectedProjects.has(p.id))
    : projects

  const handleExport = async () => {
    if (projectsToExport.length === 0) return

    setExporting(true)
    setCompleted(false)

    const jobId = `job-${Date.now()}`
    addJob({
      id: jobId,
      platform: projectsToExport[0].platform,
      status: 'running',
      progress: 0,
      totalItems: projectsToExport.length,
      completedItems: 0,
      startedAt: new Date().toISOString(),
    })

    try {
      const engine = new ExportEngine(projectsToExport, exportOptions)
      const blob = await engine.export()
      const filename = generateFilename(exportOptions.format)

      import('file-saver').then(({ default: saveAs }) => {
        saveAs(blob, filename)
      })

      updateJob(jobId, {
        status: 'completed',
        progress: 100,
        completedItems: projectsToExport.length,
        completedAt: new Date().toISOString(),
      })

      setCompleted(true)
      setTimeout(() => setCompleted(false), 3000)
    } catch (error) {
      updateJob(jobId, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Export failed',
      })
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-white">Export</h2>
        <p className="text-vault-400 mt-1">
          {projectsToExport.length} projects ready for export
          {selectedProjects.size > 0 && ` (${selectedProjects.size} selected)`}
        </p>
      </div>

      <div className="vault-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export Format</h3>
        <div className="grid grid-cols-4 gap-4">
          {formats.map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => setExportOptions({ format: fmt.id })}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                exportOptions.format === fmt.id
                  ? 'border-vault-500 bg-vault-500/10'
                  : 'border-vault-700/50 bg-vault-800/30 hover:border-vault-600'
              }`}
            >
              <fmt.icon className={`w-8 h-8 mb-3 ${
                exportOptions.format === fmt.id ? 'text-vault-400' : 'text-vault-600'
              }`} />
              <p className="font-semibold text-white">{fmt.label}</p>
              <p className="text-xs text-vault-500 mt-1">{fmt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="vault-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Options</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Include Metadata</p>
              <p className="text-xs text-vault-500">Model info, tokens, timestamps</p>
            </div>
            <button
              onClick={() => setExportOptions({ includeMetadata: !exportOptions.includeMetadata })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                exportOptions.includeMetadata ? 'bg-vault-500' : 'bg-vault-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                exportOptions.includeMetadata ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Include Attachments</p>
              <p className="text-xs text-vault-500">Images, files referenced in chats</p>
            </div>
            <button
              onClick={() => setExportOptions({ includeAttachments: !exportOptions.includeAttachments })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                exportOptions.includeAttachments ? 'bg-vault-500' : 'bg-vault-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                exportOptions.includeAttachments ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          {exportOptions.format === 'zip' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Organize By</p>
                <p className="text-xs text-vault-500">Folder structure inside ZIP</p>
              </div>
              <select
                value={exportOptions.organizeBy}
                onChange={(e) => setExportOptions({ organizeBy: e.target.value as 'date' | 'platform' | 'topic' })}
                className="px-4 py-2 rounded-lg bg-vault-900 border border-vault-700 text-white focus:outline-none focus:border-vault-500"
              >
                {organizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-vault-500">
          <p>Exporting {projectsToExport.length} projects as {exportOptions.format.toUpperCase()}</p>
          {exportOptions.includeMetadata && <p className="mt-1">• Metadata included</p>}
          {exportOptions.includeAttachments && <p className="mt-1">• Attachments included</p>}
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || projectsToExport.length === 0}
          className={`vault-btn-primary text-lg px-8 py-4 flex items-center gap-3 ${
            exporting || projectsToExport.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {exporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : completed ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Done!
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export {projectsToExport.length} Projects
            </>
          )}
        </button>
      </div>
    </div>
  )
}