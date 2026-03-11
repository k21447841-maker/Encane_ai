import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../App'
import { LanguageProvider } from '../context/LanguageContext'
import { ThemeProvider } from '../context/ThemeContext'
import { UserProvider } from '../context/UserContext'
import { AIProvider } from '../context/AIContext'

// Mock components
jest.mock('../pages/SplashPage', () => () => <div data-testid="splash-page">Splash Page</div>)
jest.mock('../pages/LanguagePage', () => () => <div data-testid="language-page">Language Page</div>)
jest.mock('../pages/OnboardingPage', () => () => <div data-testid="onboarding-page">Onboarding Page</div>)
jest.mock('../pages/ProfilePage', () => () => <div data-testid="profile-page">Profile Page</div>)
jest.mock('../pages/HomePage', () => () => <div data-testid="home-page">Home Page</div>)

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString() },
    removeItem: (key) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <AIProvider>
              {component}
            </AIProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  test('shows splash screen initially', async () => {
    renderWithProviders(<App />)
    expect(screen.getByTestId('splash-page')).toBeInTheDocument()
  })

  test('redirects to language page when no language selected', async () => {
    renderWithProviders(<App />)
    
    // Wait for splash to complete
    await waitFor(() => {
      expect(screen.getByTestId('language-page')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('redirects to onboarding after language selected', async () => {
    localStorage.setItem('hasSelectedLanguage', 'true')
    
    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('onboarding-page')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('redirects to profile after onboarding', async () => {
    localStorage.setItem('hasSelectedLanguage', 'true')
    localStorage.setItem('hasSeenOnboarding', 'true')
    
    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-page')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('redirects to home when all steps completed', async () => {
    localStorage.setItem('hasSelectedLanguage', 'true')
    localStorage.setItem('hasSeenOnboarding', 'true')
    localStorage.setItem('hasProfile', 'true')
    
    renderWithProviders(<App />)
    
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})