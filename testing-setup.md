# Testing Setup for Frontend-Backend Integration

This document explains how to set up and run tests for the frontend-backend integration components.

## Prerequisites

Before running the tests, you need to install the necessary testing dependencies:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Configure Vitest

Create or update your `vitest.config.ts` file in the project root:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

## Create Test Setup File

Create a file at `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('import.meta.env', () => ({
  VITE_API_BASE_URL: 'http://localhost:8000',
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## Update package.json

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Running Tests

Now you can run the tests using the following commands:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

The test files are organized as follows:

- `src/components/__tests__/`: Tests for UI components
- `src/pages/__tests__/`: Tests for page components
- `src/hooks/__tests__/`: Tests for custom hooks

## Testing Patterns

### Component Testing

For component testing, we use React Testing Library. Here's a basic example:

```typescript
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### API Mocking

For API calls, we mock the `fetch` function:

```typescript
global.fetch = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  (global.fetch as any).mockImplementation((url: string) => {
    if (url.includes('/api/endpoint')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'mock data' }),
      });
    }
    return Promise.reject(new Error('Not found'));
  });
});
```

### Testing Forms

For form testing, we use user events:

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import FormComponent from '../FormComponent';

test('submits form with user input', async () => {
  const handleSubmit = vi.fn();
  render(<FormComponent onSubmit={handleSubmit} />);
  
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
    email: 'test@example.com',
  }));
});
```

## Troubleshooting

If you encounter issues with the tests:

1. **Missing DOM elements**: Make sure you're using the correct query methods from Testing Library.

2. **Async issues**: Use `await waitFor(() => {})` for asynchronous operations.

3. **Module mocking issues**: Check that you're mocking modules before they're imported.

4. **Environment variables**: Ensure environment variables are correctly mocked in the setup file. 