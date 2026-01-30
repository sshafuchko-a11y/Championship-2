<template>
  <div id="app">
    <Layout />
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <RouterView />
      </transition>
    </main>
  </div>
</template>

<script setup>
import Layout from '@/components/Layout.vue'
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.main-content {
  padding: 20px;
}
</style>