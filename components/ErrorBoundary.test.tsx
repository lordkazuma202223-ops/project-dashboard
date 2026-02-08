import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary';

describe('ErrorBoundary', () => {
  it('should render children without errors', () => {
    render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should attach global error handlers', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <ErrorBoundary>
        <div>Test</div>
      </ErrorBoundary>
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
