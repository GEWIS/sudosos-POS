<template>
  <div id="app">
    <b-toast id="api-error" variant="danger" solid title="API Error">
      An error occurred while communicating with the server.
    </b-toast>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import eventBus from '@/eventbus';

/**
 * The main app component.
 */
export default class App extends Vue {
  /**
   * When the component is mounted, listen for the apiError event and show a
   * toast if it occurs.
   */
  mounted() {
    eventBus.$on('apiError', () => {
      this.$bvToast.show('api-error');
    });
  }
}
</script>

<style lang="scss">
@import "@/styles/common.scss";
@import "@/styles/Nav.scss";
</style>
