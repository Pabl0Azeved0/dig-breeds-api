<template>
  <v-app class="bg-grey-lighten-2">
    <v-main>
      <header
        class="text-center mb-8 bg-cover bg-center relative overflow-hidden"
        :style="{ backgroundImage: `url(${headerBgUrl})` }"
        style="padding-top: 10vh; padding-bottom: 10vh;"
      >
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="relative z-10">
          <h1 class="text-h3 text-sm-h2 font-weight-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
            Dog Breeds Explorer
          </h1>
          <p class="text-white mt-2 [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
            Discover and save your favorite dog breeds
          </p>
        </div>
      </header>

      <v-container class="pa-4 pa-sm-8">
        <v-card class="mx-auto" max-width="1200" flat>
          <v-tabs v-model="activeTab" bg-color="primary" grow>
            <v-tab value="all">All Breeds</v-tab>
            <v-tab value="favorites">
              My Favorites
              <v-badge v-if="favorites.length > 0" color="white" :content="favorites.length" inline></v-badge>
            </v-tab>
          </v-tabs>
          <v-window v-if="!loading && !error" v-model="activeTab" style="height: 70vh; overflow-y: auto;">
            <v-window-item value="all" class="pa-4  bg-white">
              <BreedGrid :breeds="breedsWithImages" :favorites="favorites" @toggle-favorite="toggleFavorite" @show-images="showBreedImages" />
            </v-window-item>
            <v-window-item value="favorites" class="pa-4  bg-white">
              <div v-if="favoriteBreedsWithImages.length === 0" class="text-center text-grey-darken-1 pa-16">
                You haven't favorited any breeds yet.
              </div>
              <BreedGrid v-else :breeds="favoriteBreedsWithImages" :favorites="favorites" @toggle-favorite="toggleFavorite" @show-images="showBreedImages" />
            </v-window-item>
          </v-window>
        </v-card>
      </v-container>
    </v-main>

    <v-dialog v-model="isModalOpen" max-width="800px">
      <v-card rounded="lg" class="pa-0">

        <div class="d-flex align-center pa-1">
          <v-spacer></v-spacer>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="isModalOpen = false"
          >
            <v-icon
              color="white"
              class="[text-shadow:0_1px_3px_rgba(0,0,0,0.8)]"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </div>

        <div v-if="isModalLoading" class="d-flex justify-center align-center" style="height: 500px;">
          <v-progress-circular indeterminate color="primary" size="50"></v-progress-circular>
        </div>
        <div v-else>
          <v-carousel v-model="modalSlide" hide-delimiters show-arrows="hover">
            <v-carousel-item
              v-for="image in modalImages"
              :key="image"
              :src="image"
              cover
            ></v-carousel-item>
          </v-carousel>

          <div class="d-flex justify-space-between align-center pa-4">
            <div class="font-weight-bold text-grey-darken-1 bg-primary rounded px-3 py-1">
              {{ modalSlide + 1 }} / {{ modalImages.length }}
            </div>
            <div class="text-h6 capitalize">{{ selectedBreed?.replace('-', ' ') }}</div>
            <div class="rounded-full bg-grey-lighten-4">
              <v-btn
                icon
                variant="text"
                @click="toggleFavorite(selectedBreed!)"
                :color="favorites.includes(selectedBreed!) ? 'red' : 'grey-darken-1'"
              >
                <v-icon>
                  {{ favorites.includes(selectedBreed!) ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import headerBgUrl from '@/assets/images/header-bg.jpg';
import { ref, onMounted, computed, provide } from 'vue';
import api from './services/api';
import BreedGrid from './components/BreedGrid.vue';

interface Breed { name: string; imageUrl: string | null; }

const activeTab = ref('all');
const breedsWithImages = ref<Breed[]>([]);
const favorites = ref<string[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Modal State
const isModalOpen = ref(false);
const isModalLoading = ref(false);
const selectedBreed = ref<string | null>(null);
const modalImages = ref<string[]>([]);
const modalSlide = ref(0); // For carousel position

const showBreedImages = async (breedName: string) => {
  selectedBreed.value = breedName;
  isModalOpen.value = true;
  isModalLoading.value = true;
  modalImages.value = [];
  modalSlide.value = 0; // Reset to first slide

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

// --- General Logic ---
const fetchData = async () => {
  try {
    const [breedsRes, favsRes] = await Promise.all([api.getBreeds(), api.getFavorites()]);
    const breedNames: string[] = breedsRes.data;
    favorites.value = favsRes.data;
    breedsWithImages.value = breedNames.map(name => ({ name, imageUrl: null }));
  } catch (err) { error.value = 'Failed to fetch data.'; } finally { loading.value = false; }
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
    if (isCurrentlyFavorite) { await api.removeFavorite(breedName); } else { await api.addFavorite(breedName); }
  } catch (err) { console.error('Failed to sync favorite status:', err); fetchData(); }
};

const favoriteBreedsWithImages = computed(() => {
  return breedsWithImages.value.filter(breed => favorites.value.includes(breed.name));
});

const isBreedFavoriteInModal = computed(() => {
  if (!selectedBreed.value) return false;
  return favorites.value.includes(selectedBreed.value);
});
</script>