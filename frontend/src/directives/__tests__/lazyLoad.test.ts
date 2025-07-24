import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { lazyLoadDirective } from '../lazyLoad';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

// This will hold the instance of our mock observer
let mockObserverInstance: IntersectionObserver;

beforeEach(() => {
  // @ts-ignore
  global.IntersectionObserver = vi.fn((callback) => {
    mockObserverInstance = {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
      // @ts-ignore
      callback, // Store the callback for manual triggering
    };
    return mockObserverInstance;
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('lazyLoad Directive', () => {
  it('calls the provided function when the element intersects', () => {
    const callback = vi.fn();

    const TestComponent = {
      template: '<div v-lazy-load="onLoad"></div>',
      methods: {
        onLoad: callback,
      },
    };

    mount(TestComponent, {
      global: {
        directives: {
          'lazy-load': lazyLoadDirective,
        },
      },
    });

    // Manually trigger the intersection
    // @ts-ignore
    const intersectionCallback = mockObserverInstance.callback;
    
    intersectionCallback([{ isIntersecting: true }], mockObserverInstance);

    expect(callback).toHaveBeenCalled();
    expect(mockUnobserve).toHaveBeenCalled();
  });
});