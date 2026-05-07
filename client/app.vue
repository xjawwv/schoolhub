<template>
  <NuxtLayout>
    <NuxtPage :transition="pageTransition" />
  </NuxtLayout>
</template>

<script setup>
const pageTransition = {
  name: 'page',
  mode: 'out-in',
}
</script>
