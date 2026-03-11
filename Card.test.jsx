import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from '../../components/common/Card'

describe('Card Component', () => {
  test('renders children', () => {
    render(
      <Card>
        <div data-testid="child">Card Content</div>
      </Card>
    )
    
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
  })

  test('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Card onClick={handleClick}>Clickable Card</Card>)
    
    await userEvent.click(screen.getByText('Clickable Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies default variant styles', () => {
    render(<Card>Card Content</Card>)
    
    const card = screen.getByText('Card Content').parentElement
    expect(card.className).toContain('glass-card')
  })

  test('applies flat variant styles', () => {
    render(<Card variant="flat">Card Content</Card>)
    
    const card = screen.getByText('Card Content').parentElement
    expect(card.className).toContain('bg-white/5')
  })

  test('applies gradient variant styles', () => {
    render(<Card variant="gradient">Card Content</Card>)
    
    const card = screen.getByText('Card Content').parentElement
    expect(card.className).toContain('bg-gradient-to-br')
  })

  test('applies different padding sizes', () => {
    const { rerender } = render(<Card padding="small">Card Content</Card>)
    expect(screen.getByText('Card Content').parentElement.className).toContain('p-3')

    rerender(<Card padding="large">Card Content</Card>)
    expect(screen.getByText('Card Content').parentElement.className).toContain('p-6')
  })

  test('applies glow effect when prop is true', () => {
    render(<Card glow>Card Content</Card>)
    
    const card = screen.getByText('Card Content').parentElement
    expect(card.className).toContain('glow')
  })

  test('applies custom className', () => {
    render(<Card className="custom-class">Card Content</Card>)
    
    const card = screen.getByText('Card Content').parentElement
    expect(card.className).toContain('custom-class')
  })
})