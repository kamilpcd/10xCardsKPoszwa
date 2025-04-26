import { vi, expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Przeprowadza czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

// Dodaje globalny mock dla fetch
globalThis.fetch = vi.fn();

// Dodaje globalny mock dla localStorage
global.localStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
};

// Dodaje globalny mock dla sessionStorage
global.sessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}; 