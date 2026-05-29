import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RegisterPage from '../RegisterPage';

// Mock the DynamicForm component
vi.mock('@/components/DynamicForm', () => ({
  default: ({ schema, defaultValues, onSubmit }: any) => (
    <div data-testid="mock-dynamic-form">
      <div>Schema: {JSON.stringify(schema)}</div>
      <div>Default Values: {JSON.stringify(defaultValues)}</div>
      <button onClick={() => onSubmit({ email: 'test@example.com', name: 'Test User' })}>
        Submit Form
      </button>
    </div>
  ),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('RegisterPage', () => {
  const mockEventData = {
    id: '123',
    title: 'Test Event',
    description: 'This is a test event',
    start_datetime: '2023-12-01T10:00:00Z',
    end_datetime: '2023-12-01T12:00:00Z',
    location: 'Test Location',
    capacity: 50,
    form_id: 'form-123',
  };

  const mockFormData = {
    id: 'form-123',
    name: 'Test Form',
    description: 'Test form description',
    schema: {
      fields: [
        {
          key: 'email',
          label: 'Email',
          type: 'email',
          required: true,
        },
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
        },
      ],
      submit_label: 'Register',
    },
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();

    // Mock fetch for event data
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/events/123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockEventData),
        });
      } else if (url.includes('/forms/form-123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockFormData),
        });
      } else if (url.includes('/registrations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'reg-123' }),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  test('loads event and form data and renders form', async () => {
    render(
      <MemoryRouter initialEntries={['/events/123/register']}>
        <Routes>
          <Route path="/events/:eventId/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Initially should show loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText(/Test Event/)).toBeInTheDocument();
    });

    // Check if event details are displayed
    expect(screen.getByText(/Test Event/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test event/)).toBeInTheDocument();
    expect(screen.getByText(/Test Location/)).toBeInTheDocument();

    // Check if form is rendered
    expect(screen.getByTestId('mock-dynamic-form')).toBeInTheDocument();
  });

  test('handles form submission', async () => {
    render(
      <MemoryRouter initialEntries={['/events/123/register']}>
        <Routes>
          <Route path="/events/:eventId/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('mock-dynamic-form')).toBeInTheDocument();
    });

    // Submit the form
    screen.getByText('Submit Form').click();

    // Check if registration API was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/registrations`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            event_id: '123',
            data: { email: 'test@example.com', name: 'Test User' },
          }),
        })
      );
    });

    // Check if localStorage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'formData_event_123',
      JSON.stringify({ email: 'test@example.com', name: 'Test User' })
    );

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'guest_profile',
      JSON.stringify({ email: 'test@example.com', name: 'Test User' })
    );
  });

  test('loads default form when no form_id is present', async () => {
    const eventWithoutForm = {
      ...mockEventData,
      form_id: undefined,
    };

    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/events/123')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(eventWithoutForm),
        });
      } else if (url.includes('/registrations')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'reg-123' }),
        });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(
      <MemoryRouter initialEntries={['/events/123/register']}>
        <Routes>
          <Route path="/events/:eventId/register" element={<RegisterPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('mock-dynamic-form')).toBeInTheDocument();
    });

    // Check if default form schema is used
    expect(screen.getByText(/Schema:/)).toHaveTextContent(/email/);
    expect(screen.getByText(/Schema:/)).toHaveTextContent(/name/);
    expect(screen.getByText(/Schema:/)).toHaveTextContent(/comments/);
  });
}); 