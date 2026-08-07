/**
 * Export Engine
 * 
 * Handles conversion of AI project data into multiple export formats.
 * Supports Markdown, JSON, HTML, and ZIP archive generation.
 */

import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { format } from 'date-fns'
import type { AIProject, ExportOptions, ExportFormat, Platform } from '@/types'

export class ExportEngine {
  private projects: AIProject[]
  private options: ExportOptions

  constructor(projects: AIProject[], options: ExportOptions) {
    this.projects = projects
    this.options = options
  }

  async export(): Promise<Blob> {
    switch (this.options.format) {
      case 'markdown':
        return this.exportMarkdown()
      case 'json':
        return this.exportJSON()
      case 'html':
        return this.exportHTML()
      case 'zip':
        return this.exportZIP()
      default:
        throw new Error(`Unsupported format: ${this.options.format}`)
    }
  }

  private async exportMarkdown(): Promise<Blob> {
    const chunks: string[] = []

    for (const project of this.projects) {
      chunks.push(this.projectToMarkdown(project))
      chunks.push('\n---\n')
    }

    const content = chunks.join('\n')
    return new Blob([content], { type: 'text/markdown' })
  }

  private projectToMarkdown(project: AIProject): string {
    const lines: string[] = []

    lines.push(`# ${project.title}`)
    lines.push('')
    lines.push(`**Platform:** ${project.platform}`)
    lines.push(`**Created:** ${format(new Date(project.createdAt), 'PPP')}`)
    lines.push(`**Updated:** ${format(new Date(project.updatedAt), 'PPP')}`)

    if (this.options.includeMetadata && project.tags.length > 0) {
      lines.push(`**Tags:** ${project.tags.join(', ')}`)
    }

    lines.push('')
    lines.push('## Conversation')
    lines.push('')

    for (const msg of project.messages) {
      const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant'
      lines.push(`### ${role} — ${format(new Date(msg.timestamp), 'PP p')}`)
      lines.push('')
      lines.push(msg.content)
      lines.push('')
    }

    if (this.options.includeMetadata) {
      lines.push('---')
      lines.push('')
      lines.push('## Metadata')
      lines.push('')
      lines.push('```json')
      lines.push(JSON.stringify(project.metadata, null, 2))
      lines.push('```')
    }

    return lines.join('\n')
  }

  private async exportJSON(): Promise<Blob> {
    const data = {
      exportedAt: new Date().toISOString(),
      totalProjects: this.projects.length,
      projects: this.projects,
    }

    const content = JSON.stringify(data, null, 2)
    return new Blob([content], { type: 'application/json' })
  }

  private async exportHTML(): Promise<Blob> {
    const projectsHTML = this.projects.map((p) => this.projectToHTML(p)).join('')

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ProjectVault Export — ${format(new Date(), 'PPP')}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; background: #f8fafc; }
    .project { background: white; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .project-header { border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem; margin-bottom: 1rem; }
    .project-title { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0; }
    .meta { color: #64748b; font-size: 0.875rem; margin-top: 0.5rem; }
    .message { padding: 1rem; border-radius: 8px; margin: 0.75rem 0; }
    .message.user { background: #eff6ff; border-left: 4px solid #3b82f6; }
    .message.assistant { background: #f0fdf4; border-left: 4px solid #22c55e; }
    .message-role { font-weight: 600; font-size: 0.875rem; margin-bottom: 0.5rem; }
    .message-content { line-height: 1.6; white-space: pre-wrap; }
    .platform-badge { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <h1>ProjectVault Export</h1>
  <p class="meta">Exported on ${format(new Date(), 'PPP p')}</p>
  <p class="meta">${this.projects.length} projects</p>
  ${projectsHTML}
</body>
</html>`

    return new Blob([html], { type: 'text/html' })
  }

  private projectToHTML(project: AIProject): string {
    const messagesHTML = project.messages.map((msg) => `
      <div class="message ${msg.role}">
        <div class="message-role">${msg.role === 'user' ? 'You' : 'Assistant'}</div>
        <div class="message-content">${this.escapeHTML(msg.content)}</div>
      </div>
    `).join('')

    return `
      <div class="project">
        <div class="project-header">
          <h2 class="project-title">${this.escapeHTML(project.title)}</h2>
          <div class="meta">
            <span class="platform-badge" style="background: ${this.getPlatformColor(project.platform)}20; color: ${this.getPlatformColor(project.platform)};">
              ${project.platform}
            </span>
            <span>${format(new Date(project.createdAt), 'PPP')}</span>
          </div>
        </div>
        ${messagesHTML}
      </div>
    `
  }

  private async exportZIP(): Promise<Blob> {
    const zip = new JSZip()
    const organizeBy = this.options.organizeBy

    for (const project of this.projects) {
      let folder: JSZip

      if (organizeBy === 'platform') {
        folder = zip.folder(project.platform) || zip
      } else if (organizeBy === 'date') {
        const dateFolder = format(new Date(project.createdAt), 'yyyy-MM')
        folder = zip.folder(dateFolder) || zip
      } else {
        folder = zip
      }

      const safeTitle = project.title.replace(/[^a-z0-9\-\s]/gi, '').replace(/\s+/g, '-').toLowerCase()
      const filename = `${safeTitle}-${project.id.slice(0, 8)}.md`

      folder.file(filename, this.projectToMarkdown(project))

      if (this.options.includeMetadata) {
        folder.file(`${safeTitle}-meta.json`, JSON.stringify(project.metadata, null, 2))
      }
    }

    const index = this.projects.map((p) => `- [${p.title}](${p.platform}/${p.title.replace(/[^a-z0-9\-\s]/gi, '').replace(/\s+/g, '-').toLowerCase()}-${p.id.slice(0, 8)}.md) — ${p.platform}`).join('\n')
    zip.file('_INDEX.md', `# ProjectVault Export\n\n${index}`)

    return await zip.generateAsync({ type: 'blob' })
  }

  private getPlatformColor(platform: Platform): string {
    const colors: Record<Platform, string> = {
      kimi: '#ff6b6b',
      gemini: '#4285f4',
      deepseek: '#4f46e5',
      chatgpt: '#10a37f',
      claude: '#d97757',
      grok: '#1a1a1a',
      perplexity: '#20b2aa',
    }
    return colors[platform] || '#64748b'
  }

  private escapeHTML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }
}

export function generateFilename(format: ExportFormat): string {
  const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm')
  const ext = format === 'zip' ? 'zip' : format === 'json' ? 'json' : format === 'html' ? 'html' : 'md'
  return `projectvault-export-${timestamp}.${ext}`
}