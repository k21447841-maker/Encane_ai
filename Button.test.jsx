import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../components/common/Button'

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('handles click events', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  test('disables button when loading', async () => {
    const handleClick = jest.fn()
    render(<Button loading onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('disables button when disabled prop is true', async () => {
    const handleClick = jest.fn()
    render(<Button disabled onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(screen.getByText('Click me'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  test('applies primary variant styles', () => {
    render(<Button variant="primary">Click me</Button>)
    
    const button = screen.getByText('Click me')
    expect(button.className).toContain('from-accent-cyan')
  })

  test('applies secondary variant styles', () => {
    render(<Button variant="secondary">Click me</Button>)
    
    const button = screen.getByText('Click me')
    expect(button.className).toContain('bg-white/10')
  })

  test('applies outline variant styles', () => {
    render(<Button variant="outline">Click me</Button>)
    
    const button = screen.getByText('Click me')
    expect(button.className).toContain('border-accent-cyan')
  })

  test('applies different sizes', () => {
    const { rerender } = render(<Button size="small">Click me</Button>)
    expect(screen.getByText('Click me').className).toContain('px-4 py-2')

    rerender(<Button size="large">Click me</Button>)
    expect(screen.getByText('Click me').className).toContain('px-8 py-4')
  })

  test('applies full width class', () => {
    render(<Button fullWidth>Click me</Button>)
    expect(screen.getByText('Click me').className).toContain('w-full')
  })

  test('renders icon on left', () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Button icon={icon} iconPosition="left">Click me</Button>)
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('renders icon on right', () => {
    const icon = <span data-testid="icon">🔍</span>
    render(<Button icon={icon} iconPosition="right">Click me</Button>)
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})