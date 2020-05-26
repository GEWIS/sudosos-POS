<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
<!--    </div>-->
    <Checkout />
    <ProductListComponent hidden></ProductListComponent>
<!--    <router-view/>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductListComponent from '@/components/ProductListComponent.vue';
import Checkout from '@/components/Checkout.vue';

  @Component({
    components: { Checkout, ProductListComponent },
  })

export default class App extends Vue {
}
</script>

<style lang="scss">
  html,
  body {
    height: 100%;
  }

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
