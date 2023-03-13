<template>
  <div class="text-center product-card" @click="$emit('selected')">
    <div class="product">
      <img :src="image" :alt="product.name" />
      <p class="w-100 product-name mb-0">{{ product.name }}</p>
      <p class="w-100 product-price mb-0">€{{ productPrice }}</p>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';
import { Product } from '@/entities/Product';

/**
 * Component for a product card. When clicked, the selected event is emitted.
 */
@Component
export default class ProductComponent extends Vue {
  /**
   * The product to display. This is a required prop.
   */
  @Prop() product!: Product;

  /**
   * The image to display.
   */
  public image: string = null;

  /**
   * Before the component is mounted, the image source is set.
   */
  beforeMount() {
    if (!this.product.picture) {
      this.image = 'https://imgur.com/CS0aauU.png';
    } else {
      this.image = `${process.env.VUE_APP_IMAGE_BASE}products/${this.product.picture}`;
    }
  }

  get productPrice() {
    return (this.product.priceInclVat.getAmount() / 100).toFixed(2);
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
      object-fit: contain;
    }
  }
}

.product-name {
  font-weight: bold;
  font-size: 16px;
  height: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 13px;
  height: 15px;
}
</style>
