<template>
  <div class="app-shell min-h-screen bg-app text-ink" :class="sidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'">
    <div class="premium-bg"></div>
    <Navbar />
    <main
      class="app-main px-4 pb-28 pt-36 sm:px-6 md:pb-8 md:pt-8 lg:px-8"
    >
      <div class="mx-auto max-w-7xl">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { useLayoutStore } from './composables/useLayoutStore'

const { sidebarExpanded } = useLayoutStore()
</script>
