/**
 * ProjectVault Type Definitions
 * 
 * Core data models for the universal AI project exporter.
 */

export type Platform = 
  | 'kimi' 
  | 'gemini' 
  | 'deepseek' 
  | 'chatgpt' 
  | 'claude' 
  | 'grok' 
  | 'perplexity';

export interface AIProject {
  id: string;
  platform: Platform;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  metadata: Record<string, unknown>;
  tags: string[];
  exportedAt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

export interface Attachment {
  name: string;
  type: string;
  url?: string;
  data?: string;
}

export interface PlatformConfig {
  id: Platform;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  exportMethod: 'api' | 'browser' | 'manual';
  lastSync?: string;
  projectCount: number;
}

export interface ExportJob {
  id: string;
  platform: Platform;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalItems: number;
  completedItems: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export type ExportFormat = 'markdown' | 'json' | 'pdf' | 'zip' | 'html';

export interface ExportOptions {
  format: ExportFormat;
  includeMetadata: boolean;
  includeAttachments: boolean;
  dateRange?: { from?: string; to?: string };
  selectedProjects?: string[];
  organizeBy: 'date' | 'platform' | 'topic';
}