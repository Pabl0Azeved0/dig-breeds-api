<template>
  <v-row dense>
    <v-col
      v-for="breed in breeds"
      :key="breed.name"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <BreedCard
        :breed="breed"
        :is-favorite="favorites.includes(breed.name)"
        @toggle-favorite="$emit('toggle-favorite', breed.name)"
        v-lazy-load="() => loadCardImage(breed)"
        class="h-100"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import BreedCard from './BreedCard.vue';
import api from '../services/api';

interface Breed { name: string; imageUrl: string | null; }

defineProps<{
  breeds: Breed[];
  favorites: string[];
}>();

// **FIX #2**: The grid no longer needs to know about the 'show-images' event at all.
defineEmits(['toggle-favorite']);

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