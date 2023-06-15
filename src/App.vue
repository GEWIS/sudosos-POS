<template>
  <div id="app">
    <b-toast v-model="showError" id="api-error" variant="danger" solid title="API Error">
      An error occurred while communicating with the server.
    </b-toast>
    <router-view />
  </div>
</template>
<script lang="ts">
import eventBus from '@/events';
import {
  Vue, Component,
} from 'vue-facing-decorator';

/**
 * The main app component.
 */
@Component
export default class App extends Vue {
  showError: boolean = false;

  /**
   * When the component is mounted, listen for the apiError event and show a
   * toast if it occurs.
   */
  mounted() {
    eventBus.$on('apiError', () => {
      this.showError = true;
    });
  }
}
</script>

<style lang="scss">
@import "@/styles/common.scss";
@import "@/styles/Nav.scss";
</style>
