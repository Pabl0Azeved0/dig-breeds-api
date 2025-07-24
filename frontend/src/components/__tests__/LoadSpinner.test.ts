import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import LoadingSpinner from '../LoadingSpinner.vue';

describe('LoadingSpinner.vue', () => {
  it('renders the loading text', () => {
    const wrapper = mount(LoadingSpinner);
    expect(wrapper.text()).toContain('Loading...');
  });
});