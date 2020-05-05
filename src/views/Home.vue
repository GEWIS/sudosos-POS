<template>
  <div class="home">
    <ProductOverview />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';
import ProductOverview from '@/components/ProductOverview.vue';

export default {
  name: 'home',
  components: {
    ProductOverview,
  },
};
</script>
