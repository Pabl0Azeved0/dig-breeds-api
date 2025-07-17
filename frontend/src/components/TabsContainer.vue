<script setup lang="ts">
import { ref, provide } from 'vue';

defineProps<{
  favoriteCount?: number;
}>();

const tabTitles = ref<string[]>([]);
const selectedTitle = ref<string>('');

// Function for child tabs to register themselves
const addTab = (title: string) => {
  if (!tabTitles.value.includes(title)) {
    tabTitles.value.push(title);
  }
  // **THE FIX IS HERE**: If no tab is selected yet,
  // make the first one that registers the active one.
  if (selectedTitle.value === '') {
    selectedTitle.value = title;
  }
};

// Provide state and methods to child components
provide('addTab', addTab);
provide('selectedTitle', selectedTitle);
</script>

<template>
  <div class="flex flex-col">
    <div class="border-b border-gray-200 flex-shrink-0">
      <nav class="flex -mb-px" aria-label="Tabs">
        <button
          v-for="title in tabTitles"
          :key="title"
          @click="selectedTitle = title"
          :class="[
            'w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200',
            selectedTitle === title
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ title }}
          <span v-if="title === 'Favorite Breeds' && favoriteCount > 0" class="ml-2 bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {{ favoriteCount }}
          </span>
        </button>
      </nav>
    </div>
    <div class="p-6 h-[70vh] overflow-y-auto">
      <slot />
    </div>
  </div>
</template>