<template>
  <div class="grid grid-cols-4 gap-4">
    <BreedCard
      v-for="breed in breeds"
      :key="breed.name"
      :breed="breed"
      :is-favorite="favorites.includes(breed.name)"
      @toggle-favorite="$emit('toggle-favorite', breed.name)"
      @show-images="$emit('show-images', breed.name)"
      v-lazy-load="() => loadCardImage(breed)"
    />
  </div>
</template>

<script setup lang="ts">
// The script section remains the same.
import BreedCard from './BreedCard.vue';
import api from '../services/api';

interface Breed { name: string; imageUrl: string | null; }

const props = defineProps<{
  breeds: Breed[];
  favorites: string[];
}>();

defineEmits(['toggle-favorite', 'show-images']);

const loadCardImage = async (breed: Breed) => {
  if (breed.imageUrl) return;
  try {
    const response = await api.getBreedImage(breed.name);
    breed.imageUrl = response.data.imageUrl;
  } catch (err) {
    console.error(`Could not load image for ${breed.name}:`, err);
  }
};
</script>