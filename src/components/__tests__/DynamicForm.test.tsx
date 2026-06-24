import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import DynamicForm from '../DynamicForm';

// Mock the fetch function
global.fetch = vi.fn();

// Mock toast notifications
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('DynamicForm', () => {
  const mockSchema = {
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your name',
      },
      {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        placeholder: 'your.email@example.com',
      },
      {
        key: 'comments',
        label: 'Comments',
        type: 'textarea',
        required: false,
        placeholder: 'Any additional information...',
      },
    ],
    submit_label: 'Submit Form',
  };

  const mockDefaultValues = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders all form fields correctly', () => {
    render(
      <DynamicForm
        schema={mockSchema}
        defaultValues={mockDefaultValues}
        onSubmit={mockOnSubmit}
      />
    );

    // Check if all fields are rendered
    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comments/)).toBeInTheDocument();

    // Check if default values are applied
    expect(screen.getByLabelText(/Name/)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Email/)).toHaveValue('john.doe@example.com');
  });

  test('submits form with valid data', async () => {
    render(
      <DynamicForm
        schema={mockSchema}
        defaultValues={mockDefaultValues}
        onSubmit={mockOnSubmit}
      />
    );

    // Add a comment to the form
    fireEvent.change(screen.getByLabelText(/Comments/), {
      target: { value: 'This is a test comment' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Submit Form'));

    // Wait for the form submission to complete
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        comments: 'This is a test comment',
      });
    });
  });

  test('validates required fields', async () => {
    render(
      <DynamicForm
        schema={mockSchema}
        defaultValues={{}}
        onSubmit={mockOnSubmit}
      />
    );

    // Submit the form without filling required fields
    fireEvent.click(screen.getByText('Submit Form'));

    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Ensure the onSubmit function was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('validates email format', async () => {
    render(
      <DynamicForm
        schema={mockSchema}
        defaultValues={{ name: 'John Doe' }}
        onSubmit={mockOnSubmit}
      />
    );

    // Enter an invalid email
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: 'invalid-email' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Submit Form'));

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });

    // Ensure the onSubmit function was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  test('handles file upload', async () => {
    const fileSchema = {
      fields: [
        {
          key: 'resume',
          label: 'Resume',
          type: 'file',
          required: true,
        },
      ],
      submit_label: 'Upload',
    };

    // Mock successful file upload response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ url: 'https://example.com/file.pdf' }),
    });

    render(
      <DynamicForm
        schema={fileSchema}
        defaultValues={{}}
        onSubmit={mockOnSubmit}
      />
    );

    // Create a mock file
    const file = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });

    // Trigger file upload
    const fileInput = screen.getByLabelText(/Resume/);
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Wait for the upload to complete
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/upload`,
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        })
      );
    });
  });
}); 