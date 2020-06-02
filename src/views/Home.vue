<template>
  <div class="home">
    <Checkout />
    <ProductListComponent hidden></ProductListComponent>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductListComponent from '@/components/ProductListComponent.vue';
import Checkout from '@/components/Checkout.vue';

@Component({
  components: {
    Checkout,
    ProductListComponent,
  },
})
export default class Home extends Vue {

}
</script>
