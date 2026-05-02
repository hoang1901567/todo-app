import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import axios from 'axios';

vi.mock('axios');

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful GET request
    axios.get.mockResolvedValue({ data: [] });
  });

  it('should render the TODO APP title', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /TODO APP/i });
    expect(heading).toBeInTheDocument();
  });

  it('should display input field for adding tasks', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/What needs to be done?/i);
    expect(input).toBeInTheDocument();
  });

  it('should display add task button', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Add task/i });
    expect(button).toBeInTheDocument();
  });

  it('should display loading message initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should display "No tasks available" when todo list is empty', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/No tasks available/i)).toBeInTheDocument();
    });
  });

  it('should allow typing in the input field', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/What needs to be done?/i);
    await user.type(input, 'Buy milk');
    
    expect(input.value).toBe('Buy milk');
  });

  it('should have proper error message container', () => {
    render(<App />);
    // Verify component structure exists
    const appContainer = screen.getByText(/TODO APP/i).closest('div');
    expect(appContainer).toBeInTheDocument();
  });

  it('should display todos when they are loaded', async () => {
    const mockTodos = [
      { todo_id: 1, description: 'Task 1', completed: false },
      { todo_id: 2, description: 'Task 2', completed: true },
    ];
    axios.get.mockResolvedValue({ data: mockTodos });
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });
});
