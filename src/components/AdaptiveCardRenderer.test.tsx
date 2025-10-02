import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdaptiveCardRenderer from './AdaptiveCardRenderer'

describe('AdaptiveCardRenderer basic nodes', () => {
  it('renders TextBlock and ImageSet', () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          version: '1.6',
          body: [
            { type: 'TextBlock', text: 'Hello', weight: 'bolder' },
            { type: 'ImageSet', imageSize: 'small', images: [{ type: 'Image', url: 'https://example.com/a.png', altText: 'A' }] },
          ],
        }}
      />,
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
    const img = screen.getByAltText('A') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toContain('https://example.com/a.png')
  })

  it('toggles ShowCard content', async () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [],
          actions: [
            {
              type: 'Action.ShowCard',
              title: 'More',
              card: { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: 'Inner' }] },
            },
          ],
        }}
      />,
    )

    const btn = screen.getByRole('button', { name: 'More' })
    expect(screen.queryByText('Inner')).not.toBeInTheDocument()
    await userEvent.click(btn)
    expect(await screen.findByText('Inner')).toBeInTheDocument()
  })
})
