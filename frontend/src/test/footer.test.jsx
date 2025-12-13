import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../layouts/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  describe('Brand Section', () => {
    it('should render the brand logo and name', () => {
      expect(screen.getByText('Hike Hub')).toBeInTheDocument();
    });

    it('should render the brand description', () => {
      const description = screen.getByText(/Connecting adventurous souls with breathtaking trails/i);
      expect(description).toBeInTheDocument();
    });

    it('should render social media buttons', () => {
      // Check for social media buttons (they don't have text, but we can check for the container)
      const socialButtons = document.querySelectorAll('button');
      const socialMediaButtons = Array.from(socialButtons).filter(button => 
        button.className.includes('bg-white/20')
      );
      expect(socialMediaButtons).toHaveLength(4); // Facebook, Instagram, Twitter, Youtube
    });
  });

  describe('Discover Section', () => {
    it('should render the Discover section title', () => {
      expect(screen.getByText('Discover')).toBeInTheDocument();
    });

    it('should render all discover links', () => {
      const discoverLinks = [
        'Popular Trails',
        'Local Hiking Groups',
        'Trail Reviews',
        'Difficulty Levels',
        'Seasonal Hikes'
      ];

      discoverLinks.forEach(link => {
        expect(screen.getByText(link)).toBeInTheDocument();
      });
    });

    it('should render discover links as anchor elements', () => {
      const popularTrailsLink = screen.getByText('Popular Trails').closest('a');
      expect(popularTrailsLink).toBeInTheDocument();
      expect(popularTrailsLink).toHaveAttribute('href', '#');
    });
  });

  describe('Community Section', () => {
    it('should render the Community section title', () => {
      expect(screen.getByText('Community')).toBeInTheDocument();
    });

    it('should render all community links', () => {
      const communityLinks = [
        'Join Groups',
        'Create Events',
        'Find Hiking Buddies',
        'Share Experiences',
        'Safety Tips'
      ];

      communityLinks.forEach(link => {
        expect(screen.getByText(link)).toBeInTheDocument();
      });
    });

    it('should render community links as anchor elements', () => {
      const joinGroupsLink = screen.getByText('Join Groups').closest('a');
      expect(joinGroupsLink).toBeInTheDocument();
      expect(joinGroupsLink).toHaveAttribute('href', '#');
    });
  });

  describe('Support Section', () => {
    it('should render the Support section title', () => {
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should render contact email', () => {
      expect(screen.getByText('amanxchau1@gmail.com')).toBeInTheDocument();
    });

    it('should render contact phone number', () => {
      expect(screen.getByText('9810800087')).toBeInTheDocument();
    });

    it('should render contact information with proper icons', () => {
      const emailContainer = screen.getByText('amanxchau1@gmail.com').parentElement;
      const phoneContainer = screen.getByText('9810800087').parentElement;
      
      expect(emailContainer).toHaveClass('flex', 'items-center');
      expect(phoneContainer).toHaveClass('flex', 'items-center');
    });
  });

  describe('Bottom Bar', () => {
    it('should render copyright notice', () => {
      const copyrightText = screen.getByText(/© 2025 Hike Hub. All rights reserved/i);
      expect(copyrightText).toBeInTheDocument();
    });

    it('should render footer links', () => {
      const footerLinks = ['Privacy', 'Terms', 'Cookies', 'Accessibility'];
      
      footerLinks.forEach(link => {
        expect(screen.getByText(link)).toBeInTheDocument();
      });
    });

    it('should render footer links as anchor elements', () => {
      const privacyLink = screen.getByText('Privacy').closest('a');
      expect(privacyLink).toBeInTheDocument();
      expect(privacyLink).toHaveAttribute('href', '#');
    });
  });

  describe('Styling and Layout', () => {
    it('should have proper footer styling', () => {
      const footer = document.querySelector('footer');
      expect(footer).toHaveClass('bg-gradient-to-br');
      expect(footer).toHaveClass('from-green-800');
      expect(footer).toHaveClass('via-green-700');
      expect(footer).toHaveClass('to-green-600');
    });

    it('should have responsive grid layout', () => {
      const gridContainer = document.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
      expect(gridContainer).toHaveClass('md:grid-cols-2');
      expect(gridContainer).toHaveClass('lg:grid-cols-4');
    });

    it('should have proper section spacing', () => {
      const sectionsContainer = document.querySelector('.max-w-7xl');
      expect(sectionsContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      const footer = document.querySelector('footer');
      expect(footer).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      const headings = document.querySelectorAll('h3, h4');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should have proper link structure', () => {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    it('should have proper button structure for social media', () => {
      const socialButtons = document.querySelectorAll('button');
      const socialMediaButtons = Array.from(socialButtons).filter(button => 
        button.className.includes('bg-white/20')
      );
      expect(socialMediaButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Elements', () => {
    it('should have hover effects on links', () => {
      const discoverLink = screen.getByText('Popular Trails').closest('a');
      expect(discoverLink).toHaveClass('hover:text-yellow-400');
      expect(discoverLink).toHaveClass('transition-colors');
    });

    it('should have hover effects on social buttons', () => {
      const socialButtons = document.querySelectorAll('button');
      const socialMediaButtons = Array.from(socialButtons).filter(button => 
        button.className.includes('bg-white/20')
      );
      
      socialMediaButtons.forEach(button => {
        expect(button).toHaveClass('hover:bg-yellow-500');
        expect(button).toHaveClass('transition-all');
      });
    });

    it('should have transform effects on links', () => {
      const communityLink = screen.getByText('Join Groups').closest('a');
      expect(communityLink).toHaveClass('hover:translate-x-1');
      expect(communityLink).toHaveClass('transform');
    });
  });

  describe('Visual Elements', () => {
    it('should render section icons', () => {
      // Check for Lucide icons by looking for SVG elements with specific classes
      const iconElements = document.querySelectorAll('svg');
      expect(iconElements.length).toBeGreaterThan(0);
    });

    it('should have proper icon colors', () => {
      // Check for yellow colored icons (text-yellow-400 class would be applied to icon containers)
      const yellowIcons = document.querySelectorAll('.text-yellow-400');
      expect(yellowIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Content Completeness', () => {
    it('should render all expected sections', () => {
      expect(screen.getByText('Discover')).toBeInTheDocument();
      expect(screen.getByText('Community')).toBeInTheDocument();
      expect(screen.getByText('Support')).toBeInTheDocument();
    });

    it('should render all navigation items in each section', () => {
      // Discover section - 5 items
      const discoverItems = ['Popular Trails', 'Local Hiking Groups', 'Trail Reviews', 'Difficulty Levels', 'Seasonal Hikes'];
      discoverItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });

      // Community section - 5 items
      const communityItems = ['Join Groups', 'Create Events', 'Find Hiking Buddies', 'Share Experiences', 'Safety Tips'];
      communityItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it('should not render commented out sections', () => {
      // These sections are commented out in the component
      expect(screen.queryByText('Never Miss an Adventure')).not.toBeInTheDocument();
      expect(screen.queryByText('Help Center')).not.toBeInTheDocument();
      expect(screen.queryByText('4.9 Rating')).not.toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('should have proper container structure', () => {
      const footer = document.querySelector('footer');
      const container = footer.querySelector('.max-w-7xl');
      const grid = container.querySelector('.grid');
      
      expect(footer).toBeInTheDocument();
      expect(container).toBeInTheDocument();
      expect(grid).toBeInTheDocument();
    });

    it('should have four main columns in desktop layout', () => {
      const gridItems = document.querySelectorAll('.grid > div');
      expect(gridItems.length).toBe(4); // Brand, Discover, Community, Support
    });

    it('should have proper bottom bar structure', () => {
      const bottomBar = document.querySelector('.bg-green-900');
      expect(bottomBar).toBeInTheDocument();
      
      const bottomBarContent = bottomBar.querySelector('.max-w-7xl');
      expect(bottomBarContent).toBeInTheDocument();
    });
  });
});