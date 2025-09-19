import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Layout from '../Layout/Layout';
import { TaskProvider } from '../../context/TaskContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/tasks' })
}));

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <TaskProvider>
          {component}
        </TaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the layout with navigation', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Task Manager')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('shows task summary in sidebar', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Task Summary')).toBeInTheDocument();
    expect(screen.getByText('Pending:')).toBeInTheDocument();
    expect(screen.getByText('In Progress:')).toBeInTheDocument();
    expect(screen.getByText('Completed:')).toBeInTheDocument();
  });

  it('navigates when menu items are clicked', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    fireEvent.click(screen.getByText('Create Task'));
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/new');
  });

  it('opens mobile drawer when menu button is clicked', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // Find and click the mobile menu button
    const menuButton = screen.getByLabelText('open drawer');
    fireEvent.click(menuButton);

    // The drawer should be open (this is a basic test, in reality you'd test the drawer state)
    expect(screen.getAllByText('Task Manager')).toHaveLength(2); // One in app bar, one in drawer
  });
});
