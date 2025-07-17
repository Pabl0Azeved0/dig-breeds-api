<template>
  <div class="bg-gray-100 min-h-screen font-sans p-4 sm:p-8 flex items-center justify-center">

    <div class="bg-white rounded-xl shadow-lg w-full max-w-6xl">
      <header class="text-center py-6 px-4 border-b border-gray-200">
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-800">Dog Breeds Explorer 🐾</h1>
        <p class="text-gray-600 mt-1">Discover and save your favorite dog breeds</p>
      </header>

      <div v-if="loading" class="text-center py-12"><LoadingSpinner /></div>
      <div v-else-if="error" class="text-red-500 bg-red-100 p-4 rounded-lg text-center m-4">{{ error }}</div>

      <TabsContainer v-else :favorite-count="favorites.length">
        <TabPanel title="All Breeds">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <BreedCard
              v-for="breed in breedsWithImages"
              :key="breed.name"
              :breed="breed"
              :is-favorite="isFavorite(breed.name)"
              @toggle-favorite="toggleFavorite"
              @show-images="showBreedImages"
            />
          </div>
        </TabPanel>

        <TabPanel title="Favorite Breeds">
           <div v-if="favoriteBreedsWithImages.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <BreedCard
                v-for="breed in favoriteBreedsWithImages"
                :key="breed.name"
                :breed="breed"
                :is-favorite="true"
                @toggle-favorite="toggleFavorite"
                @show-images="showBreedImages"
              />
           </div>
           <div v-else class="text-center text-gray-500 pt-16">
              <p>You haven't favorited any breeds yet.</p>
           </div>
        </TabPanel>
      </TabsContainer>
    </div>

    <BreedImageModal v-if="selectedBreed" :breed="selectedBreed" @close="selectedBreed = null" />
  </div>
</template>

<script setup lang="ts">
// No changes needed in the <script> section. It remains the same.
import TabsContainer from '../components/TabsContainer.vue';
import TabPanel from '../components/TabPanel.vue';
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import BreedCard from '../components/BreedCard.vue';
import BreedImageModal from '../components/BreedImageModal.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

interface Breed { name: string; imageUrl: string | null; }
const breedsWithImages = ref<Breed[]>([]);
const favorites = ref<string[]>([]);
const selectedBreed = ref<string | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchData = async () => {
  try {
    const [breedsRes, favsRes] = await Promise.all([api.getBreeds(), api.getFavorites()]);
    const breedNames: string[] = breedsRes.data;
    favorites.value = favsRes.data;
    const imagePromises = breedNames.map(name => api.getBreedImage(name));
    const imagesResponses = await Promise.allSettled(imagePromises);
    breedsWithImages.value = breedNames.map((name, index) => {
      const response = imagesResponses[index];
      return {
        name,
        imageUrl: response.status === 'fulfilled' ? response.value.data.imageUrl : null,
      };
    });
  } catch (err) {
    console.error(err);
    error.value = 'Failed to fetch data from the server.';
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const favoriteBreedsWithImages = computed(() => {
  return breedsWithImages.value.filter(breed => favorites.value.includes(breed.name));
});

const isFavorite = (breedName: string) => favorites.value.includes(breedName);

const toggleFavorite = async (breedName: string) => {
  if (isFavorite(breedName)) {
    favorites.value = favorites.value.filter(fav => fav !== breedName);
    await api.removeFavorite(breedName);
  } else {
    favorites.value.push(breedName);
    await api.addFavorite(breedName);
  }
};

const showBreedImages = (breedName: string) => {
  selectedBreed.value = breedName;
};
</script>