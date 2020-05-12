<template>
  <div class="home">
    <Checkout />
    <ProductListComponent hidden></ProductListComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ProductListComponent from '@/components/ProductListComponent.vue';
import Checkout from '@/components/Checkout.vue';

export default {
  name: 'home',
  components: {
    Checkout,
    ProductListComponent,
  },
};
</script>
