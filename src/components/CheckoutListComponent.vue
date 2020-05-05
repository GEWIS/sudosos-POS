<template>
  <div class="checkout-product-list">Test</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CheckoutListComponent extends Vue {
}
</script>

<style scoped lang="scss">
  .checkout-product-list {
    background: $gewis-grey-light;
  }
</style>
