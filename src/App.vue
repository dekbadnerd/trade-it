<template>
  <div class="min-h-screen bg-app text-ink">
    <div class="premium-bg"></div>
    <Navbar />
    <main class="mx-auto max-w-7xl px-4 pb-28 pt-36 sm:px-6 md:ml-28 md:pb-8 md:pt-8 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
