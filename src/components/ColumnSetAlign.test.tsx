import { render } from '@testing-library/react'
import AdaptiveCardRenderer from './AdaptiveCardRenderer'

describe('ColumnSet alignment', () => {
  it('applies justify-center when horizontalAlignment is center', () => {
    const { container } = render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
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

    const el = container.querySelector('div.justify-center')
    expect(el).toBeTruthy()
  })
})
