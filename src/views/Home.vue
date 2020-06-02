<template>
  <div class="home">
    <CheckoutList />
    <ProductListComponent hidden></ProductListComponent>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductListComponent from '@/components/ProductListComponent.vue';
import CheckoutList from '@/components/CheckoutList.vue';

@Component({
  components: {
    ProductListComponent,
    CheckoutList,
  },
})
export default class Home extends Vue {

}
</script>
