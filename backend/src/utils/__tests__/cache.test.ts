import { cache } from '../cache';

describe('Cache Utility', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should set and get a value', () => {
    cache.set('key1', 'value1', 60);
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for an expired entry', () => {
    cache.set('key2', 'value2', 10); // TTL of 10 seconds

    // Advance time by 11 seconds
    jest.advanceTimersByTime(11 * 1000);

    expect(cache.get('key2')).toBeNull();
  });

  it('should delete a value', () => {
    cache.set('key3', 'value3', 60);
    expect(cache.get('key3')).toBe('value3');
    cache.del('key3');
    expect(cache.get('key3')).toBeNull();
  });
});