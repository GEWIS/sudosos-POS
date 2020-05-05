<template>
  <div class="home">
    <CheckoutListComponent />
    <ProductListComponent hidden></ProductListComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ProductListComponent from '@/components/ProductListComponent.vue';
import CheckoutListComponent from '@/components/CheckoutListComponent.vue';

export default {
  name: 'home',
  components: {
    CheckoutListComponent,
    ProductListComponent,
  },
};
</script>
