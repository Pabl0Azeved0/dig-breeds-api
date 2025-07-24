import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises, VueWrapper } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import App from '../App.vue';
import api from '../services/api';
import { nextTick } from 'vue';

const vuetify = createVuetify();

vi.mock('../services/api');

const lazyLoadDirective = {
  mounted: vi.fn(),
  beforeUnmount: vi.fn(),
};

describe('App.vue', () => {
  let wrapper: VueWrapper;

  // Mount the component once and clean it up after each test
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getBreeds).mockResolvedValue({ data: ['akita', 'beagle'] });
    vi.mocked(api.getFavorites).mockResolvedValue({ data: ['beagle'] });

    wrapper = mount(App, {
      attachTo: document.body,
      global: {
        plugins: [vuetify],
        directives: { 'lazy-load': lazyLoadDirective },
        stubs: {
          'v-img': { template: '<div class="v-img-stub"></div>' },
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('loads and displays breeds on mount', async () => {
    await flushPromises();
    await nextTick();

    const text = wrapper.text().toLowerCase();
    expect(text).toContain('akita');
    
    expect(wrapper.find('[data-testid="favorites-badge"]').text()).toBe('1');
  });

  it('toggles a favorite when a card button is clicked', async () => {
    await flushPromises();
    await nextTick();

    const akitaCard = wrapper.findAllComponents({ name: 'BreedCard' }).find(c => c.props('breed').name === 'akita');
    const favoriteButton = akitaCard!.find('button');
    
    vi.mocked(api.addFavorite).mockResolvedValue({});
    await favoriteButton.trigger('click');
    await flushPromises();
    await nextTick();

    expect(api.addFavorite).toHaveBeenCalledWith('akita');
    expect(wrapper.find('[data-testid="favorites-badge"]').text()).toBe('2');
  });
});