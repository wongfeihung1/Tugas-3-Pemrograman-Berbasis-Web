<template>
  <div>
    <AppNavbar v-if="$route.name !== 'login'" />
    <RouterView />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'

export default {
  name: 'App',
  components: {
    AppNavbar
  }
}
</script>
