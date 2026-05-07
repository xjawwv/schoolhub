<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <AppSidebar />

    <div
      v-if="uiStore.sidebarMobileOpen"
      class="fixed inset-0 z-20 bg-black/50 lg:hidden"
      @click="uiStore.closeMobileSidebar()"
    />

    <div class="flex flex-col flex-1 overflow-hidden">
      <AppNavbar />

      <main class="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin">
        <slot />
      </main>
    </div>

    <AppToast />
    <AppConfirm />
  </div>
</template>

<script setup>
const uiStore = useUiStore()
</script>
