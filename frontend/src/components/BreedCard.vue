<template>
  <div
    class="relative rounded-lg shadow-lg overflow-hidden group cursor-pointer"
    @click="showImages && showImages(breed.name)"
  >
    <img
      v-if="breed.imageUrl"
      :src="breed.imageUrl"
      :alt="breed.name"
      class="w-full h-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-110"
    />
    <div v-else class="w-full h-full aspect-[4/5] bg-gray-200 flex items-center justify-center">
      <span class="text-gray-500 text-xs">Image unavailable</span>
    </div>

    <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
      <div class="flex justify-between items-center">
        <h3 class="font-bold text-white capitalize truncate pr-2 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
          {{ breed.name.replace('-', ' ') }}
        </h3>
        <div class="rounded-full bg-black/30 backdrop-blur-sm">
          <v-btn
            icon
            size="small"
            variant="text"
            @click.stop="$emit('toggle-favorite', breed.name)"
            :color="isFavorite ? 'red' : 'white'"
          >
            <v-icon class="[text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
              {{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';

interface Breed {
  name: string;
  imageUrl: string | null;
}

defineProps<{
  breed: Breed;
  isFavorite: boolean;
}>();

defineEmits(['toggle-favorite']);

const showImages = inject<(name: string) => void>('showBreedImages');
</script>