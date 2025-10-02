import '@testing-library/jest-dom/vitest'

// JSDOM lacks layout; stub scrollTo to avoid errors if used
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true })
