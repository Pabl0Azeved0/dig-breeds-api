import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BreedCard from '../BreedCard.vue'

// Import createVuetify to make a local instance
import { createVuetify } from 'vuetify'

// Create a Vuetify instance
const vuetify = createVuetify()

// Mock the inject function for the modal
const mockShowImages = () => {}

describe('BreedCard.vue', () => {
  const breed = {
    name: 'Akita',
    imageUrl: 'some-url.jpg',
  }

  it('renders the breed name correctly', () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed,
        isFavorite: false,
      },
      global: {
        plugins: [vuetify],
        provide: {
          showBreedImages: mockShowImages,
        },
      },
    })

    expect(wrapper.text()).toContain('Akita')
  })

  it('shows an outline heart icon when not favorited', () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed,
        isFavorite: false,
      },
      global: {
        plugins: [vuetify],
        provide: {
          showBreedImages: mockShowImages,
        },
      },
    })
    
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart-outline')
  })

  it('shows a filled heart icon when favorited', () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed,
        isFavorite: true,
      },
      global: {
        plugins: [vuetify],
        provide: {
          showBreedImages: mockShowImages,
        },
      },
    })
    
    expect(wrapper.find('.v-icon').classes()).toContain('mdi-heart')
  })
  
  it('emits a "toggle-favorite" event when the heart button is clicked', async () => {
    const wrapper = mount(BreedCard, {
      props: {
        breed,
        isFavorite: false,
      },
      global: {
        plugins: [vuetify],
        provide: {
          showBreedImages: mockShowImages,
        },
      },
    })

    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted()).toHaveProperty('toggle-favorite')
    expect(wrapper.emitted('toggle-favorite')?.[0]).toEqual(['Akita'])
  })
})