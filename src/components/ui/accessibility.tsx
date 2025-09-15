import React, { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Skip to content link for screen readers
export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
                 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50 
                 focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Passer au contenu principal
    </a>
  );
};

// Visually hidden text for screen readers
interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('sr-only', className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';

// Focus trap for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, className }) => {
  const trapRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const trap = trapRef.current;
    if (!trap) return;

    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    trap.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      trap.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  return (
    <div ref={trapRef} className={className}>
      {children}
    </div>
  );
};

// Accessible status announcements
interface LiveRegionProps {
  children: React.ReactNode;
  priority?: 'polite' | 'assertive';
  atomic?: boolean;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  priority = 'polite',
  atomic = true
}) => {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic={atomic}
      className="sr-only"
    >
      {children}
    </div>
  );
};

// Keyboard navigation helper
export const useKeyboardNavigation = (
  items: number,
  orientation: 'horizontal' | 'vertical' = 'vertical'
) => {
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    const isVertical = orientation === 'vertical';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

    switch (e.key) {
      case nextKey:
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % items);
        break;
      case prevKey:
        e.preventDefault();
        setFocusedIndex(prev => (prev - 1 + items) % items);
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(items - 1);
        break;
    }
  }, [items, orientation]);

  return { focusedIndex, handleKeyDown, setFocusedIndex };
};