<script setup>
definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
authStore.initFromStorage()

await navigateTo(authStore.dashboardPath)
</script>
