import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../lib/integraph', async (orig) => {
  const load = orig as unknown as () => Promise<Record<string, unknown>>
  const mod = (await load()) as Record<string, unknown>
  return {
    ...mod,
    Integraph: {
      ...(mod['Integraph'] as Record<string, unknown>),
      isEnabled: () => false,
      baseUrl: '',
    },
  }
})

describe('EditorPage', () => {
  it('shows disabled adapter notice', async () => {
    const { default: EditorPage } = await import('./EditorPage')
    render(<EditorPage />)
    expect(screen.getByText(/Integraph adapter disabled/i)).toBeInTheDocument()
  })

  it('Reset/Resume session update header session info', async () => {
    vi.resetModules()
    vi.doMock('../lib/integraph', async (orig) => {
      const load = orig as unknown as () => Promise<Record<string, unknown>>
      const mod = (await load()) as Record<string, unknown>
      return {
        ...mod,
        Integraph: {
          ...(mod['Integraph'] as Record<string, unknown>),
          isEnabled: () => true,
          baseUrl: '',
        },
      }
    })
    const { default: EditorPage } = await import('./EditorPage')
    render(<EditorPage />)
    // Initially none
    expect(screen.getByText(/runId=\(none\)/)).toBeInTheDocument()
    // Click resume and provide a runId
    const resumeBtn = screen.getByRole('button', { name: 'Resume by runId' })
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('run-xyz')
    await userEvent.click(resumeBtn)
    promptSpy.mockRestore()
    expect(screen.getByText(/runId=run-xyz/)).toBeInTheDocument()
    // Reset clears it
    const resetBtn = screen.getByRole('button', { name: 'Reset session' })
    await userEvent.click(resetBtn)
    expect(screen.getByText(/runId=\(none\)/)).toBeInTheDocument()
  })
})

describe('EditorPage errors', () => {
  it('shows ErrorPanel with correlationId on failure', async () => {
    vi.resetModules()
    vi.doMock('../lib/integraph', async (orig) => {
      const load = orig as unknown as () => Promise<Record<string, unknown>>
      const mod = (await load()) as Record<string, unknown>
      return {
        ...mod,
        Integraph: {
          ...(mod['Integraph'] as Record<string, unknown>),
          isEnabled: () => true,
          baseUrl: 'http://local',
          generate: async () => {
            // Simulate HttpError shape used in EditorPage
            const error = new Error('HTTP 500') as Error & { status?: number; correlationId?: string }
            error.status = 500
            error.correlationId = 'corr-123'
            throw error
          },
        },
      }
    })
    const { default: Editor } = await import('./EditorPage')
    render(<Editor />)
    const btn = screen.getByRole('button', { name: 'Generate' })
    await userEvent.click(btn)
  const alert = await screen.findByRole('alert')
  expect(alert).toHaveTextContent(/Error in generate/)
  expect(alert).toHaveTextContent(/HTTP 500/)
  })
})
