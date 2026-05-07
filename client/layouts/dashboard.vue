<template>
  <div class="flex h-screen overflow-hidden bg-slate-50">
    <AppSidebar />

    <div
      v-if="uiStore.sidebarMobileOpen"
      class="fixed inset-0 z-20 bg-gray-900/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
      @click="uiStore.closeMobileSidebar()"
    />

    <div
      class="flex flex-col flex-1 overflow-hidden transition-all duration-300"
      :class="uiStore.sidebarOpen ? 'lg:ml-64' : 'lg:ml-[68px]'"
    >
      <AppNavbar />

      <main class="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-thin">
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
