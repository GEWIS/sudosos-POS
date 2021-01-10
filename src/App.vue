<template>
  <div id="app">
    <b-nav :vertical="vertical" class="nav align-items-center"
           v-bind:class="{ vertical: vertical, horizontal: !vertical }">
      <b-nav-item class="gewis-logo d-none d-sm-block">
        <img src="@/assets/img/gewis-branding.svg" alt="GEWIS Logo"/>
      </b-nav-item>
      <home-menu-button :name="'beer'"/>
      <home-menu-button :name="'coffee'"/>
      <home-menu-button :name="'cookie-bite'"/>
      <home-menu-button :name="'ticket-alt'"/>

      <b-nav-item
        class="other-button"
        @click="clickSearchButton"
        :class="{active: searchState.searching}">
        <font-awesome-icon icon="search"/>
      </b-nav-item>
      <b-nav-item class="">
        <font-awesome-icon icon="ellipsis-h" />
      </b-nav-item>
    </b-nav>
    <main>
      <router-view />
      <checkout-bar />
    </main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeMenuButton from '@/components/HomeMenuButton.vue';
import CheckoutBar from '@/components/CheckoutBar.vue';
@Component({
  components: {
    HomeMenuButton,
    CheckoutBar,
  },
})
export default class App extends Vue {
  public vertical: boolean = (window.innerWidth / window.innerHeight) >= 1;


  private searchState = this.$store.state.searchState;

  mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });
  }

  checkWindowSize() {
    this.vertical = (window.innerWidth / window.innerHeight) >= 1;
  }

  clickSearchButton() {
    this.$store.commit('searchState/setSearching', !this.searchState.searching);
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
