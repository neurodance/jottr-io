import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditorPage from './EditorPage'
import { vi } from 'vitest'

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
  it('shows disabled adapter notice', () => {
    render(<EditorPage />)
    expect(screen.getByText(/Integraph adapter disabled/i)).toBeInTheDocument()
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
