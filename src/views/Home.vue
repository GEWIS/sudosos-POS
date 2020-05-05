<template>
  <div class="home">
    <CheckoutList />
    <ProductListComponent hidden></ProductListComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ProductListComponent from '@/components/ProductListComponent.vue';
import CheckoutList from '@/components/CheckoutList.vue';

export default {
  name: 'home',
  components: {
    CheckoutList,
    ProductListComponent,
  },
};
</script>
