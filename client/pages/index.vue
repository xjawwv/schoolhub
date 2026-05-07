<script setup>
definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()

await navigateTo(authStore.dashboardPath)
</script>
