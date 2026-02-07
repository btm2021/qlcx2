<template>
  <Nuxt />
</template>

<script>
export default {
  name: 'AuthLayout',
  middleware: ['guest']
}
</script>
