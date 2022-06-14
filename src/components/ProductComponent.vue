<template>
  <div class="text-center product-card" @click="productClicked">
    <div class="product">
      <img :src="image" :alt="product.name" />
      <p class="w-100 product-name mb-0">{{ product.name }}</p>
      <p class="w-100 product-price mb-0">€{{ (product.price.getAmount() / 100).toFixed(2) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import Formatters from '@/mixins/Formatters';

@Component
export default class ProductComponent extends Formatters {
  @Prop() product!: Product;

  image: string = null;

  beforeMount() {
    if (!this.product.picture) {
      this.image = 'https://imgur.com/CS0aauU.png';
    } else {
      this.image = `https://sudosos.gewis.nl/static/products/${this.product.picture}`;
    }
  }

  productClicked() {
    (this.$parent as any).addProduct(this.product, 1);
  }
}

</script>

<style scoped lang="scss">
.product-card {
  padding: 0 0 8px 0;
  height: fit-content;
  background: white;
  border-radius: $border-radius;
  overflow: hidden;
  width: 128px;

  .product {
    > img {
      width: 128px;
      height: 128px;
      background-color: $gewis-grey-light;
      border-top-left-radius: $border-radius;
      border-top-right-radius: $border-radius;
    }
  }
}

.product-name {
  font-weight: bold;
  font-size: 16px;
  height: 22px;
  overflow: hidden;
  word-wrap: break-word;
}

.product-price {
  font-size: 13px;
  height: 15px;
}
</style>
