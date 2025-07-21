<template>
  <div class="bg-[#00FFFF] rounded-xl p-4 border-2 border-gray-200 flex flex-col gap-3">
    <h3 class="font-bold text-lg text-black capitalize truncate text-center">
      {{ breed.name.replace('-', ' ') }}
    </h3>

    <div
      class="w-full aspect-square rounded-md overflow-hidden cursor-pointer"
      @click="showImages && showImages(breed.name)"
    >
      <img
        v-if="breed.imageUrl"
        :src="breed.imageUrl"
        :alt="breed.name"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
      <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
        <span class="text-gray-500 text-xs">Image unavailable</span>
      </div>
    </div>

    <div class="flex justify-center items-center pt-1">
      <button
        @click.stop="$emit('toggle-favorite', breed.name)"
        class="w-12 h-12 rounded-full bg-white/70 backdrop-blur-sm shadow-lg flex items-center justify-center text-3xl transition hover:bg-red-100"
      >
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
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
  index: number;
}>();

defineEmits(['toggle-favorite']);

const showImages = inject<(name: string) => void>('showBreedImages');
</script>