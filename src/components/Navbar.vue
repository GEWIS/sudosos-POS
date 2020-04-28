<template>
  <b-nav :vertical="vertical" class="nav mt-md-0 mt-3">
    <b-nav-item><img src="@/assets/img/gewis-branding.svg" alt="GEWIS Logo"/></b-nav-item>
    <b-nav-item><font-awesome-icon icon="beer" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="coffee" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="cookie-bite" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="ellipsis-h" /></b-nav-item>
  </b-nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import '@/styles/Nav.scss';

export default class App extends Vue {
    public vertical: boolean = window.innerWidth > 600;
}
</script>

<style scoped>

</style>
