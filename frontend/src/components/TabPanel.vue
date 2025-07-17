<template>
  <div v-show="isActive">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, computed, type Ref, onBeforeMount, getCurrentInstance } from 'vue';

const props = defineProps<{
  title: string;
}>();

// Inject the shared state provided by the TabsContainer parent
const selectedTitle = inject<Ref<string>>('selectedTitle');
const addTab = inject<(title: string) => void>('addTab');

// Check for injection errors
if (!selectedTitle || !addTab) {
  throw new Error('TabPanel must be used within a TabsContainer');
}

// Determine if this tab is the currently active one
const isActive = computed(() => selectedTitle.value === props.title);

// Register this tab with the parent container before it mounts
onBeforeMount(() => {
  addTab(props.title);
});
</script>