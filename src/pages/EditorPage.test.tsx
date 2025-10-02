import { render, screen } from '@testing-library/react'
import EditorPage from './EditorPage'

vi.mock('../lib/integraph', async (orig) => {
  const mod = await (orig as any)()
  return {
    ...mod,
    Integraph: {
      ...mod.Integraph,
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
