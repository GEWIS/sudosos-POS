<template>
  <b-nav :vertical="vertical" class="nav"
         v-bind:class="{ vertical: vertical, horizontal:!vertical }">
    <b-nav-item class="gewis-logo"><img src="@/assets/img/gewis-branding.svg" alt="GEWIS Logo"/>
    </b-nav-item>
    <b-nav-item><font-awesome-icon icon="beer" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="coffee" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="cookie-bite" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="ticket-alt" /></b-nav-item>
    <b-nav-item class="other-button"><font-awesome-icon icon="ellipsis-h" /></b-nav-item>
  </b-nav>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Formatters from '@/mixins/Formatters';

import '@/styles/Nav.scss';

@Component
export default class Navbar extends Formatters {
  public vertical: boolean = window.innerWidth > 768;

  mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });
  }

  checkWindowSize() {
    this.vertical = window.innerWidth > 768;
  }
}
</script>

<style scoped>
.vertical {
  height: 100vh;
  width: 6rem;
}

.vertical > li {
  width: 100%
}

.vertical > li > a {
  width: 100%
}

.vertical > li.other-button {
  margin-top: auto;
}

.horizontal {
  width: 100vw;
  height: 4rem;
  font-size: 12px;
  line-height: 1.2;
}

.horizontal > li {
  height: 100%;
  width: calc(100% / 6)
}

.horizontal > li > a {
  height: 100%;
  margin: auto 0;
  padding: 0;
}

.horizontal > li > a > svg {
  font-size: 30px;
}

.horizontal > li.gewis-logo > a {
  padding: 0.4rem 0.2rem !important;
}

.horizontal > li.gewis-logo > a > img {
  margin-top: -0.4rem !important;
  height: 100%;
}
</style>
