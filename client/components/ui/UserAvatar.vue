<template>
  <img
    :src="avatarSrc"
    :alt="name"
    class="object-cover rounded-full flex-shrink-0"
    :class="sizeClass"
    @error="onError"
  />
</template>

<script setup>
const props = defineProps({
  photo: { type: String, default: null },
  gender: { type: String, default: '' },
  name: { type: String, default: '' },
  size: { type: String, default: 'sm' },
})

const { getPhotoUrl, getDefaultPhoto } = useAvatar()

const avatarSrc = ref(getPhotoUrl(props.photo, props.gender))

watch(() => [props.photo, props.gender], () => {
  avatarSrc.value = getPhotoUrl(props.photo, props.gender)
})

const onError = () => {
  avatarSrc.value = getDefaultPhoto(props.gender)
}

const sizeClass = computed(() => ({
  'w-7 h-7': props.size === 'xs',
  'w-8 h-8': props.size === 'sm',
  'w-10 h-10': props.size === 'md',
  'w-16 h-16': props.size === 'lg',
  'w-24 h-24': props.size === 'xl',
}))
</script>
