<template>
  <ThemeProvider>
    <SidebarProvider>
      <LocaleSwitcher />
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './components/layout/ThemeProvider.vue'
import SidebarProvider from './components/layout/SidebarProvider.vue'
import LocaleSwitcher from './components/common/LocaleSwitcherComponents.vue'
</script>
