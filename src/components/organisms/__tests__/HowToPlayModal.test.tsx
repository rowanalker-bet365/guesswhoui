import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HowToPlayModal } from '../HowToPlayModal';

describe('HowToPlayModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when isOpen is false', () => {
    it('does not render the modal', () => {
      render(<HowToPlayModal isOpen={false} onClose={defaultProps.onClose} />);
      expect(screen.queryByText('How to Play')).not.toBeInTheDocument();
    });

    it('does not render the backdrop', () => {
      const { container } = render(
        <HowToPlayModal isOpen={false} onClose={defaultProps.onClose} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('when isOpen is true', () => {
    it('renders the modal header with the correct title', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'How to Play', level: 2 })).toBeInTheDocument();
    });

    it('renders the How to Play section heading', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'How to Play', level: 3 })).toBeInTheDocument();
    });

    it('renders the Milestones & Scoring section heading', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'Milestones & Scoring' })).toBeInTheDocument();
    });

    it('renders all 8 numbered steps', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText(/Start a New Round/)).toBeInTheDocument();
      expect(screen.getByText(/Fetch the Board/)).toBeInTheDocument();
      expect(screen.getByText(/Ask Questions/)).toBeInTheDocument();
      expect(screen.getByText(/Handle Different Answers/)).toBeInTheDocument();
      expect(screen.getByText(/Eliminate Candidates/)).toBeInTheDocument();
      expect(screen.getByText(/Submit Your Guess/)).toBeInTheDocument();
      expect(screen.getByText(/Solve the Board/)).toBeInTheDocument();
      expect(screen.getByText(/Optimise/)).toBeInTheDocument();
    });

    it('renders all scoring bullet points', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText(/Achieving Milestones/)).toBeInTheDocument();
      expect(screen.getByText(/Correct Solves/)).toBeInTheDocument();
      expect(screen.getByText(/Bonuses/)).toBeInTheDocument();
    });

    it('renders the API URL in the intro paragraph', () => {
      render(<HowToPlayModal {...defaultProps} />);
      // gameApiUrl is a module-level constant; in the test environment
      // NEXT_PUBLIC_GAME_API_URL is not set so it falls back to '(not configured)'
      expect(screen.getByText(/not configured/)).toBeInTheDocument();
    });

    it('renders the service API reference in the intro paragraph', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByText(/service API/)).toBeInTheDocument();
    });

    it('renders the close button', () => {
      render(<HowToPlayModal {...defaultProps} />);
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });
  });

  describe('closing behaviour', () => {
    it('calls onClose when the close button is clicked', () => {
      render(<HowToPlayModal {...defaultProps} />);
      fireEvent.click(screen.getByRole('button', { name: /close modal/i }));
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when the backdrop is clicked', () => {
      const { container } = render(<HowToPlayModal {...defaultProps} />);
      // The backdrop is the outermost div (fixed overlay)
      const backdrop = container.firstChild as HTMLElement;
      fireEvent.click(backdrop);
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when the modal panel itself is clicked', () => {
      render(<HowToPlayModal {...defaultProps} />);
      // Click on content inside the panel (use a unique text element)
      fireEvent.click(screen.getByText('This is where the real challenge lies. Your program will need to:'));
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('calls onClose when the Escape key is pressed', () => {
      render(<HowToPlayModal {...defaultProps} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when a non-Escape key is pressed', () => {
      render(<HowToPlayModal {...defaultProps} />);
      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'ArrowDown' });
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });

    it('removes the Escape key listener when the modal is closed', () => {
      const { rerender } = render(<HowToPlayModal {...defaultProps} />);
      rerender(<HowToPlayModal isOpen={false} onClose={defaultProps.onClose} />);
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(defaultProps.onClose).not.toHaveBeenCalled();
    });
  });
});