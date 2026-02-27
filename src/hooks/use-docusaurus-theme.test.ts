import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useDocusaurusTheme, useTheme } from './use-docusaurus-theme';

describe('useDocusaurusTheme', () => {
  afterEach(() => {
    // Unmount hooks first to disconnect the MutationObserver,
    // then remove the attribute so it doesn't trigger a stale observer
    cleanup();
    document.documentElement.removeAttribute('data-theme');
  });

  it('returns "light" when data-theme is "light"', () => {
    document.documentElement.setAttribute('data-theme', 'light');

    const { result } = renderHook(() => useDocusaurusTheme());

    expect(result.current.resolvedTheme).toBe('light');
  });

  it('returns "dark" when data-theme is "dark"', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const { result } = renderHook(() => useDocusaurusTheme());

    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('defaults to "light" when data-theme attribute is not set', () => {
    const { result } = renderHook(() => useDocusaurusTheme());

    // No data-theme attribute → getAttribute returns null → "light"
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('updates when data-theme attribute changes', async () => {
    document.documentElement.setAttribute('data-theme', 'light');

    const { result } = renderHook(() => useDocusaurusTheme());

    expect(result.current.resolvedTheme).toBe('light');

    // MutationObserver fires asynchronously, so we need waitFor here
    act(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    await waitFor(() => {
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  it('useTheme is an alias for useDocusaurusTheme', () => {
    expect(useTheme).toBe(useDocusaurusTheme);
  });
});
