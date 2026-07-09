<template>
  <div class="min-h-screen bg-void text-ivory">
    <div class="premium-bg"></div>
    <Navbar />
    <main class="mx-auto max-w-7xl px-4 pb-28 pt-5 sm:px-6 md:pb-8 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>
