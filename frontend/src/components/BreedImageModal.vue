<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center p-4 z-50"
      @click="$emit('close')"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="`modal-title-${breed}`"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full" @click.stop>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold capitalize" :id="`modal-title-${breed}`">{{ breed }}</h2>
          <button @click="$emit('close')" class="text-2xl font-bold hover:text-red-500" aria-label="Close">
            &times;
          </button>
        </div>
        <div v-if="loading" class="text-center p-8">
          <p>Loading beautiful dog pictures...</p>
        </div>
        <div v-else-if="error" class="text-red-500 bg-red-100 p-4 rounded">
          <p>Sorry, we couldn't fetch the images. Please try again later.</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <img
            v-for="(image, index) in images"
            :key="image"
            :src="image"
            :alt="`${breed} dog image ${index + 1}`"
            class="w-full h-48 object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api';

const props = defineProps<{ breed: string }>();
const emit = defineEmits(['close']);

const images = ref<string[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Function to handle Escape key press
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    emit('close');
  }
};

onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
  try {
    const response = await api.getBreedImages(props.breed);
    images.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch images.';
    console.error(err);
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>