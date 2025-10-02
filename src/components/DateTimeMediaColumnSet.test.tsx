import { render, screen } from '@testing-library/react'
import AdaptiveCardRenderer from './AdaptiveCardRenderer'

describe('Input.Date/Time and Media/ColumnSet', () => {
  it('renders date and time inputs', () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
            { type: 'Input.Date', id: 'd1', value: '2025-10-01' },
            { type: 'Input.Time', id: 't1', value: '13:45' },
          ],
        }}
      />,
    )

    expect(screen.getByDisplayValue('2025-10-01')).toHaveAttribute('type', 'date')
    expect(screen.getByDisplayValue('13:45')).toHaveAttribute('type', 'time')
  })

  it('renders video media sources and column alignment', () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
            {
              type: 'Media',
              sources: [
                { mimeType: 'video/mp4', url: 'https://example.com/v.mp4' },
              ],
              poster: 'https://example.com/p.png',
              altText: 'Demo video',
            },
            {
              type: 'ColumnSet',
              horizontalAlignment: 'center',
              columns: [
                { type: 'Column', items: [{ type: 'TextBlock', text: 'C1' }] },
                { type: 'Column', items: [{ type: 'TextBlock', text: 'C2' }] },
              ],
            },
          ],
        }}
      />,
    )

    const video = screen.getByText('Demo video').closest('video') as HTMLVideoElement
    expect(video).toBeInTheDocument()
    const c1 = screen.getByText('C1')
    const c2 = screen.getByText('C2')
    expect(c1).toBeInTheDocument()
    expect(c2).toBeInTheDocument()
  })
})
