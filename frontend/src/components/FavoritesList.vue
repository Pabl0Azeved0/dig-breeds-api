<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-4">⭐ Favorite Breeds</h2>
    <div v-if="favorites.length > 0" class="space-y-2">
      <div
        v-for="fav in favorites"
        :key="fav"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <span class="capitalize font-medium text-gray-800">{{ fav }}</span>
        <button
          @click="$emit('remove-favorite', fav)"
          class="text-red-500 hover:text-red-700 font-bold"
          aria-label="Remove favorite"
        >
          Remove
        </button>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-500">You haven't favorited any breeds yet. Click the heart icon on a breed to add it here!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  favorites: string[];
}>();
defineEmits(['remove-favorite']);
</script>