<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-200">
    <div class="h-40 w-full relative cursor-pointer" @click="$emit('show-images', breed.name)">
      <img
        v-if="breed.imageUrl"
        :src="breed.imageUrl"
        :alt="breed.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
        No Image
      </div>
    </div>

    <div class="p-3 bg-white flex justify-between items-center">
      <span class="capitalize font-semibold text-gray-800 truncate">{{ breed.name.replace('-', ' ') }}</span>
      <button @click.stop="$emit('toggle-favorite', breed.name)" class="text-2xl ml-2 flex-shrink-0">
        {{ isFavorite ? '❤️' : '🤍' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define a type for our breed object
interface Breed {
  name: string;
  imageUrl: string | null;
}

defineProps<{
  breed: Breed;
  isFavorite: boolean;
}>();

defineEmits(['toggle-favorite', 'show-images']);
</script>