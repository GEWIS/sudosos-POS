<template>
  <b-nav :vertical="vertical" class="nav align-items-center"
         v-bind:class="{ vertical: vertical, horizontal:!vertical }">
    <b-nav-item class="gewis-logo d-none d-sm-block">
      <img src="@/assets/img/gewis-branding.svg" alt="GEWIS Logo"/>
    </b-nav-item>
    <b-nav-item><font-awesome-icon icon="beer" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="coffee" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="cookie-bite" /></b-nav-item>
    <b-nav-item><font-awesome-icon icon="ticket-alt" /></b-nav-item>
    <!-- TODO: Fix pull to bottom -->
    <b-nav-item class="other-button">
      <font-awesome-icon icon="search"/>
    </b-nav-item>
    <b-nav-item class="">
      <font-awesome-icon icon="ellipsis-h" />
    </b-nav-item>
  </b-nav>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import Formatters from '@/mixins/Formatters';

import '@/styles/Nav.scss';

@Component
export default class Navbar extends Formatters {
  public vertical: boolean = window.innerWidth > 768 && window.innerHeight > 615;

  mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });
  }

  checkWindowSize() {
    this.vertical = window.innerWidth > 768 && window.innerHeight > 615;
  }
}
</script>

<style scoped lang="scss">
  @import "~bootstrap/scss/bootstrap";

  .vertical {
    height: 100vh;
    width: 6rem;

    > li {
      width: 100%;

      &.other-button {
        margin-top: auto;
      }
    }
  }

  .horizontal > li {
    height: 100%;
    width: calc(100% / 6);

    > a {
      margin: auto 0;
      padding: 0;

      > svg {
        font-size: 30px;
      }
    }

    &.gewis-logo > a {
      padding: 0.5rem 0.2rem !important;

      > img {
        margin-top: -0.4rem !important;
        height: 100%;
      }
    }
  }

  @include media-breakpoint-down(lg) {
    .horizontal > .gewis-logo > a > img {
      max-height: 59px !important;
    }
  }

  @include media-breakpoint-up(sm) {
    .horizontal > li {
      width: calc(100% / 7);
    }
  }
</style>
