<template>
  <v-app class="bg-grey-lighten-4">
    <v-main>
      <v-container class="pa-4 pa-sm-8">
        <header class="text-center mb-8">
          <h1 class="text-h3 text-sm-h2 font-weight-bold text-grey-darken-3">Dog Breeds Explorer 🐾</h1>
          <p class="text-grey-darken-1 mt-2">Discover and save your favorite dog breeds</p>
        </header>

        <v-card class="mx-auto" max-width="1200" flat>
          <v-tabs v-model="activeTab" bg-color="primary" grow>
            <v-tab value="all">All Breeds</v-tab>
            <v-tab value="favorites">
              My Favorites
              <v-badge v-if="favorites.length > 0" color="white" :content="favorites.length" inline></v-badge>
            </v-tab>
          </v-tabs>
          
          <v-window v-if="!loading && !error" v-model="activeTab" style="height: 70vh; overflow-y: auto;">
            <v-window-item value="all" class="pa-4">
              <BreedGrid :breeds="breedsWithImages" :favorites="favorites" @toggle-favorite="toggleFavorite" />
            </v-window-item>
            <v-window-item value="favorites" class="pa-4">
              <div v-if="favoriteBreedsWithImages.length === 0" class="text-center text-grey-darken-1 pa-16">
                You haven't favorited any breeds yet.
              </div>
              <BreedGrid v-else :breeds="favoriteBreedsWithImages" :favorites="favorites" @toggle-favorite="toggleFavorite" />
            </v-window-item>
          </v-window>
          
          <div v-if="loading" class="d-flex justify-center align-center" style="height: 60vh;">
             <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
          </div>
          <div v-else-if="error" class="pa-4">
            <v-alert type="error" :text="error" variant="tonal"></v-alert>
          </div>
        </v-card>
      </v-container>
    </v-main>

    <v-dialog v-model="isModalOpen" width="auto" scrim="grey-darken-3">
      <v-card theme="dark" class="pa-2" min-width="600px" rounded="lg">
        <v-card-title class="d-flex justify-center align-center relative">
          <span class="text-h5 capitalize">{{ selectedBreed?.replace('-', ' ') }}</span>
          <v-btn icon="mdi-close" variant="text" @click="isModalOpen = false" class="absolute top-0 right-0 ma-1"></v-btn>
        </v-card-title>
        
        <v-card-text>
          <div v-if="isModalLoading" class="d-flex justify-center align-center" style="height: 200px;">
            <v-progress-circular indeterminate color="white"></v-progress-circular>
          </div>
          <div v-else class="grid grid-cols-3 gap-2">
            <v-img
              v-for="image in modalImages"
              :key="image"
              :src="image"
              aspect-ratio="1"
              cover
              class="rounded"
            ></v-img>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup lang="ts">
// The script is now cleaned of debugging logs
import { ref, onMounted, computed, provide } from 'vue';
import api from './services/api';
import BreedGrid from './components/BreedGrid.vue';

interface Breed { name: string; imageUrl: string | null; }

const activeTab = ref('all');
const breedsWithImages = ref<Breed[]>([]);
const favorites = ref<string[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const isModalOpen = ref(false);
const isModalLoading = ref(false);
const selectedBreed = ref<string | null>(null);
const modalImages = ref<string[]>([]);

const showBreedImages = async (breedName: string) => {
  selectedBreed.value = breedName;
  isModalOpen.value = true;
  isModalLoading.value = true;
  modalImages.value = [];

  try {
    const response = await api.getBreedImages(breedName);
    modalImages.value = response.data;
  } catch (err) {
    console.error(`Failed to fetch images for ${breedName}`, err);
  } finally {
    isModalLoading.value = false;
  }
};

provide('showBreedImages', showBreedImages);

const fetchData = async () => {
  try {
    const [breedsRes, favsRes] = await Promise.all([api.getBreeds(), api.getFavorites()]);
    const breedNames: string[] = breedsRes.data;
    favorites.value = favsRes.data;
    breedsWithImages.value = breedNames.map(name => ({ name, imageUrl: null }));
  } catch (err) {
    error.value = 'Failed to fetch data from the server.';
  } finally {
    loading.value = false;
  }
};
onMounted(fetchData);

const toggleFavorite = async (breedName: string) => {
  const isCurrentlyFavorite = favorites.value.includes(breedName);
  if (isCurrentlyFavorite) {
    favorites.value = favorites.value.filter(fav => fav !== breedName);
  } else {
    favorites.value.push(breedName);
  }
  try {
    if (isCurrentlyFavorite) {
      await api.removeFavorite(breedName);
    } else {
      await api.addFavorite(breedName);
    }
  } catch (err) {
    console.error('Failed to sync favorite status with backend:', err);
    fetchData();
  }
};

const favoriteBreedsWithImages = computed(() => {
  return breedsWithImages.value.filter(breed => favorites.value.includes(breed.name));
});
</script>