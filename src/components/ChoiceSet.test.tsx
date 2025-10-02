import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdaptiveCardRenderer from './AdaptiveCardRenderer'

describe('Input.ChoiceSet', () => {
  it('renders compact select (single) with default', async () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
            {
              type: 'Input.ChoiceSet',
              id: 'c1',
              style: 'compact',
              value: 'b',
              choices: [
                { title: 'Alpha', value: 'a' },
                { title: 'Bravo', value: 'b' },
              ],
            },
          ],
        }}
      />,
    )

  const select = screen.getByRole('combobox') as HTMLSelectElement
    expect(select).toBeInTheDocument()
    expect(select.multiple).toBe(false)
    // The default selected option should be Bravo (value 'b')
    const option = screen.getByRole('option', { name: 'Bravo' }) as HTMLOptionElement
    expect(option.selected).toBe(true)
  })

  it('renders expanded (multi) as checkboxes and allows toggling', async () => {
    render(
      <AdaptiveCardRenderer
        card={{
          type: 'AdaptiveCard',
          body: [
            {
              type: 'Input.ChoiceSet',
              id: 'c2',
              style: 'expanded',
              isMultiSelect: true,
              value: ['a'],
              choices: [
                { title: 'Alpha', value: 'a' },
                { title: 'Bravo', value: 'b' },
              ],
            },
          ],
        }}
      />,
    )

    const alpha = screen.getByLabelText('Alpha') as HTMLInputElement
    const bravo = screen.getByLabelText('Bravo') as HTMLInputElement
    expect(alpha.checked).toBe(true)
    expect(bravo.checked).toBe(false)
    await userEvent.click(bravo)
    expect(bravo.checked).toBe(true)
  })
})
