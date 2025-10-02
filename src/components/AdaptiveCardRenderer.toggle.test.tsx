import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdaptiveCardRenderer from './AdaptiveCardRenderer'

describe('AdaptiveCardRenderer ToggleVisibility', () => {
  it('toggles target visibility by id when isVisible not provided (defaults from true)', async () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
            { type: 'TextBlock', id: 't1', text: 'Toggle me' },
          ],
          actions: [
            { type: 'Action.ToggleVisibility', title: 'Toggle', targetElements: ['t1'] },
          ],
        }}
      />,
    )

    expect(screen.getByText('Toggle me')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.queryByText('Toggle me')).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByText('Toggle me')).toBeInTheDocument()
  })

  it('sets explicit visibility when isVisible provided', async () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
            { type: 'TextBlock', id: 't2', text: 'Shown explicitly' },
          ],
          actions: [
            { type: 'Action.ToggleVisibility', title: 'Hide', targetElements: [{ elementId: 't2', isVisible: false }] },
          ],
        }}
      />,
    )

    expect(screen.getByText('Shown explicitly')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Hide' }))
    expect(screen.queryByText('Shown explicitly')).not.toBeInTheDocument()
  })
})
