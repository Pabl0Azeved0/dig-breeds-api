import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import BreedGrid from '../BreedGrid.vue';
import BreedCard from '../BreedCard.vue';

const vuetify = createVuetify();

// Mock the inject function for the modal
const mockShowImages = () => {};

const lazyLoadDirective = {
  mounted: vi.fn(),
  beforeUnmount: vi.fn(),
};

describe('BreedGrid.vue', () => {
  const mockBreeds = [
    { name: 'akita', imageUrl: 'url1.jpg' },
    { name: 'beagle', imageUrl: 'url2.jpg' },
    { name: 'husky', imageUrl: 'url3.jpg' },
  ];
  
  // Helper function to mount the component with all necessary context
  const mountComponent = (props: any) => {
    return mount(BreedGrid, {
      props,
      global: {
        plugins: [vuetify],
        directives: { 'lazy-load': lazyLoadDirective },
        provide: {
          showBreedImages: mockShowImages,
        },
      },
    });
  }

  it('renders the correct number of BreedCard components', () => {
    const wrapper = mountComponent({ breeds: mockBreeds, favorites: ['husky'] });
    const cards = wrapper.findAllComponents(BreedCard);
    expect(cards.length).toBe(3);
  });

  it('passes the correct "isFavorite" prop to BreedCard', () => {
    const wrapper = mountComponent({ breeds: mockBreeds, favorites: ['husky'] });
    const cards = wrapper.findAllComponents(BreedCard);
    expect(cards[0].props('isFavorite')).toBe(false); // akita
    expect(cards[1].props('isFavorite')).toBe(false); // beagle
    expect(cards[2].props('isFavorite')).toBe(true);  // husky
  });

  it('emits "toggle-favorite" event when a BreedCard emits it', async () => {
    const wrapper = mountComponent({ breeds: mockBreeds, favorites: [] });
    await wrapper.findComponent(BreedCard).vm.$emit('toggle-favorite', 'akita');
    expect(wrapper.emitted()).toHaveProperty('toggle-favorite');
    expect(wrapper.emitted('toggle-favorite')?.[0]).toEqual(['akita']);
  });
});