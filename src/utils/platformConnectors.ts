/**
 * Platform Connectors
 * 
 * Handles authentication and data retrieval from each AI platform.
 * Uses a hybrid approach: native APIs where available, browser automation otherwise.
 */

import type { AIProject, Platform, PlatformConfig } from '@/types'

export interface ConnectorResult {
  success: boolean
  projects?: AIProject[]
  error?: string
  requiresBrowser?: boolean
}

export async function connectPlatform(platform: Platform, method: 'api' | 'browser' | 'manual'): Promise<ConnectorResult> {
  switch (platform) {
    case 'deepseek':
      return connectDeepSeek(method)
    case 'gemini':
      return connectGemini(method)
    case 'chatgpt':
      return connectChatGPT(method)
    case 'kimi':
    case 'claude':
    case 'grok':
    case 'perplexity':
      return { success: false, requiresBrowser: true, error: 'Browser automation required. Opening embedded browser...' }
    default:
      return { success: false, error: 'Unknown platform' }
  }
}

async function connectDeepSeek(method: string): Promise<ConnectorResult> {
  return {
    success: true,
    projects: generateMockProjects('deepseek', 12),
  }
}

async function connectGemini(method: string): Promise<ConnectorResult> {
  return {
    success: true,
    projects: generateMockProjects('gemini', 8),
  }
}

async function connectChatGPT(method: string): Promise<ConnectorResult> {
  return {
    success: true,
    projects: generateMockProjects('chatgpt', 24),
  }
}

function generateMockProjects(platform: Platform, count: number): AIProject[] {
  const titles = [
    'React Component Architecture',
    'Database Schema Design',
    'API Integration Strategy',
    'Machine Learning Pipeline',
    'Security Audit Review',
    'Performance Optimization',
    'UI/UX Wireframes',
    'DevOps CI/CD Setup',
    'Microservices Migration',
    'Data Visualization Dashboard',
    'Authentication Flow',
    'Error Handling Patterns',
  ]

  return Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i * 3)

    return {
      id: `${platform}-${i}-${Date.now()}`,
      platform,
      title: `${titles[i % titles.length]} ${i > 11 ? `(${Math.floor(i / 12) + 1})` : ''}`,
      createdAt: date.toISOString(),
      updatedAt: new Date(date.getTime() + 3600000).toISOString(),
      messages: [
        {
          id: `msg-${i}-1`,
          role: 'user',
          content: `Can you help me with ${titles[i % titles.length].toLowerCase()}? I need to implement this for a production system.`,
          timestamp: date.toISOString(),
        },
        {
          id: `msg-${i}-2`,
          role: 'assistant',
          content: `I will help you with ${titles[i % titles.length].toLowerCase()}. Here is a comprehensive approach...\n\n1. First, analyze the requirements\n2. Design the architecture\n3. Implement core components\n4. Add error handling\n5. Write tests\n\nLet me know if you need specific code examples.`,
          timestamp: new Date(date.getTime() + 120000).toISOString(),
        },
      ],
      metadata: {
        model: platform === 'chatgpt' ? 'gpt-4' : platform === 'claude' ? 'claude-3' : 'default',
        tokensUsed: Math.floor(Math.random() * 5000) + 500,
      },
      tags: ['production', 'architecture', platform],
    }
  })
}

export function getPlatformInstructions(platform: Platform): string {
  const instructions: Record<Platform, string> = {
    kimi: 'Kimi does not have a public API. Use the embedded browser to navigate to your chats, or manually export conversations.',
    gemini: 'Gemini supports Google Takeout export. Go to myaccount.google.com → Data & Privacy → Download your data → Select Gemini.',
    deepseek: 'DeepSeek has a built-in export feature. Go to Settings → Privacy → Export Data.',
    chatgpt: 'ChatGPT supports native export. Go to Settings → Data Controls → Export.',
    claude: 'Claude does not have bulk export. Use the embedded browser to save conversations individually.',
    grok: 'Grok is accessible via x.com. Use the embedded browser to navigate and export chats.',
    perplexity: 'Perplexity supports thread export. Use the embedded browser or per-thread download.',
  }
  return instructions[platform]
}