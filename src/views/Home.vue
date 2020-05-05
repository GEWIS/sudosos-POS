<template>
  <div class="home">
    <ProductListComponent />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ProductListComponent from '@/components/ProductListComponent.vue';

export default {
  name: 'home',
  components: {
    ProductListComponent,
  },
};
</script>
