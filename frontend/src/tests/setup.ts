import { vi } from 'vitest'

// Mock the ResizeObserver API
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

const visualViewportMock = {
  width: 1280,
  height: 720,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};
vi.stubGlobal('visualViewport', visualViewportMock);