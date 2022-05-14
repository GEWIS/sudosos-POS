<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import Dinero from 'dinero.js';
import HomeMenuButton from '@/components/HomeMenuButton.vue';
import SearchModule from '@/store/modules/search';
import UserModule from '@/store/modules/user';
import CheckoutBar from '@/components/CheckoutBar.vue';
import { PointOfSale } from './entities/PointOfSale';

@Component({
  components: {
    HomeMenuButton,
    CheckoutBar,
  },
})
export default class App extends Vue {
  public vertical: boolean = (window.innerWidth / window.innerHeight) >= 1;

  searchState = getModule(SearchModule);

  userState = getModule(UserModule);

  mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });
  }

  checkWindowSize() {
    this.vertical = (window.innerWidth / window.innerHeight) >= 1;
  }

  clickSearchButton() {
    this.searchState.updateSearching(!this.searchState.searching);
  }
}
</script>

<style lang="scss">
  @import "~bootstrap/scss/bootstrap";
  @import "./src/styles/Nav.scss";

  .vertical {
    height: 100vh;
    width: 6rem;
    position: fixed;
    top: 0;

    > li {
      width: 100%;

      &.other-button {
        margin-top: auto;
      }
    }
  }

  .vertical ~ main {
    margin-left: 6rem;
    display: flex;
    .product-overview-container{
      flex-grow: 1;
    }
    .checkoutbar {
      width: 16rem;
    }
  }

  .horizontal ~ main {
    .searchbar-container {
      left: 0;
      width: 100%;
    }
  }

  .horizontal {
    width: 100%;

    > li {
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
