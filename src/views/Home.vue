<template>
  <div>
    <ProductSwitcher />
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import ProductSwitcher from '@/components/ProductSwitcher.vue';

@Component({
  components: {
    ProductSwitcher,
  },
})
export default class Home extends Vue {

}
</script>
