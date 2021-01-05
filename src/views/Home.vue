<template>
  <div class="home">
    <ProductListComponent />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductListComponent from '@/components/ProductListComponent.vue';

@Component({
  components: {
    ProductListComponent,
  },
})
export default class Home extends Vue {
  mounted() {
    // @ts-ignore
    console.log(this.$parent.currentCategory);
  }
}
</script>
