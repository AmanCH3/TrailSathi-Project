import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Header from '../layouts/Header';
import { useAuth } from '../auth/authProvider';

// Mock the auth provider
jest.mock('../auth/authProvider');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => mockNavigate,
}));

// Helper function to render component with router
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading is true', () => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
        loading: true,
      });

      renderWithRouter(<Header />);
      
      expect(screen.getAllByText('').length).toBeGreaterThan(0);
      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  describe('Unauthenticated User', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
        loading: false,
      });
    });

    it('should render the logo and brand name', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText('Hike Hub')).toBeInTheDocument();
      expect(screen.getByAltText('Hike Hub')).toBeInTheDocument();
    });

    it('should render all navigation items', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Trails')).toBeInTheDocument();
      expect(screen.getByText('Groups')).toBeInTheDocument();
      expect(screen.getByText('Checklist')).toBeInTheDocument();
      expect(screen.getByText('Payments')).toBeInTheDocument();
    });

    it('should render Sign In button when not authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should not render profile dropdown when not authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated User', () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    };

    beforeEach(() => {
      useAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });
    });

    it('should render user profile section when authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    it('should show user initial when no avatar is provided', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText('J')).toBeInTheDocument();
    });

    it('should render user avatar when provided', () => {
      const userWithAvatar = { ...mockUser, avatar: 'https://example.com/avatar.jpg' };
      useAuth.mockReturnValue({
        user: userWithAvatar,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      
      const avatarImg = screen.getByAltText('Profile');
      expect(avatarImg).toBeInTheDocument();
      expect(avatarImg).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('should show profile dropdown when profile button is clicked', async () => {
      renderWithRouter(<Header />);
      
      const profileButton = screen.getByRole('button', { name: /john doe/i });
      fireEvent.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
      });
    });

    it('should call logout function when Sign Out is clicked', async () => {
      renderWithRouter(<Header />);
      
      const profileButton = screen.getByRole('button', { name: /john doe/i });
      fireEvent.click(profileButton);

      await waitFor(() => {
        const signOutButton = screen.getByText('Sign Out');
        fireEvent.click(signOutButton);
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
    });

    it('should hide dropdown when clicking outside', async () => {
      renderWithRouter(<Header />);
      
      const profileButton = screen.getByRole('button', { name: /john doe/i });
      fireEvent.click(profileButton);

      await waitFor(() => {
        expect(screen.getByText('My Profile')).toBeInTheDocument();
      });

      // Click outside
      fireEvent.click(document.body);
      
      await waitFor(() => {
        expect(screen.queryByText('My Profile')).not.toBeInTheDocument();
      });
    });
  });

  describe('Admin User', () => {
    const mockAdminUser = {
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };

    beforeEach(() => {
      useAuth.mockReturnValue({
        user: mockAdminUser,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });
    });

    it('should render Dashboard button for admin users', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should not render Dashboard button for non-admin users', () => {
      const regularUser = { ...mockAdminUser, role: 'user' };
      useAuth.mockReturnValue({
        user: regularUser,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
        loading: false,
      });
    });

    it('should render mobile menu button', () => {
      renderWithRouter(<Header />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('should toggle mobile menu when button is clicked', async () => {
      renderWithRouter(<Header />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Menu should be closed initially
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
      
      // Open menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        // Check if mobile navigation items are visible
        const mobileNavItems = screen.getAllByText('Home');
        expect(mobileNavItems.length).toBeGreaterThan(1); // Desktop + Mobile
      });
    });

    it('should close mobile menu when navigation item is clicked', async () => {
      renderWithRouter(<Header />);
      
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const mobileNavItems = screen.getAllByText('Home');
        expect(mobileNavItems.length).toBeGreaterThan(1);
      });

      // Click on a navigation item
      const homeLinks = screen.getAllByText('Home');
      const mobileHomeLink = homeLinks[homeLinks.length - 1]; // Get the mobile version
      fireEvent.click(mobileHomeLink);

      await waitFor(() => {
        const mobileNavItems = screen.getAllByText('Home');
        expect(mobileNavItems.length).toBe(1); // Only desktop version should remain
      });
    });
  });

  describe('Scroll Behavior', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
        loading: false,
      });
    });

    it('should change header appearance on scroll', async () => {
      renderWithRouter(<Header />);
      
      const header = screen.getByRole('navigation');
      
      // Initially should have one set of classes
      expect(header).toHaveClass('bg-white/90');
      
      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(header).toHaveClass('bg-white/95');
        expect(header).toHaveClass('shadow-lg');
      });
    });
  });

  describe('User Name Display', () => {
    it('should display user name when available', () => {
      const user = { name: 'John Doe', email: 'john@example.com' };
      useAuth.mockReturnValue({
        user,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display username when name is not available', () => {
      const user = { username: 'johndoe', email: 'john@example.com' };
      useAuth.mockReturnValue({
        user,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      expect(screen.getByText('johndoe')).toBeInTheDocument();
    });

    it('should display email when name and username are not available', () => {
      const user = { email: 'john@example.com' };
      useAuth.mockReturnValue({
        user,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });

    it('should display "User" when no identifying information is available', () => {
      const user = {};
      useAuth.mockReturnValue({
        user,
        isAuthenticated: true,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  describe('Navigation Highlighting', () => {
    it('should highlight active navigation item', () => {
      // Mock useLocation to return specific path
      jest.doMock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useLocation: () => ({ pathname: '/trails' }),
      }));

      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
        loading: false,
      });

      renderWithRouter(<Header />);
      
      const trailsLink = screen.getByText('Trails').closest('a');
      expect(trailsLink).toHaveClass('bg-green-100', 'text-green-700');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        logout: mockLogout,
        loading: false,
      });
    });

    it('should have proper ARIA labels', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      renderWithRouter(<Header />);
      
      const signInButton = screen.getByText('Sign In');
      signInButton.focus();
      expect(signInButton).toHaveFocus();
    });
  });
});