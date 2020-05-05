<template>
  <div>
    <ProductSwitcher :productCategories="productCategories"/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import { Component, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import ProductSwitcher from '@/components/ProductSwitcher.vue';
import { ProductCategory } from '@/entities/ProductCategory';

@Component({
  components: {
    ProductSwitcher,
  },
})
export default class Home extends Vue {
// *************************************************
  //
  //               Begin test data
  //
  // *************************************************
  beugel: Product = {
    id: '1',
    name: 'Grolsch beugel',
    ownerId: '1',
    price: 110,
    picture: 'https://deklokdranken.blob.core.windows.net/product-images/101007.jpg',
    traySize: 20,
    category: 'drink',
    isAlcoholic: true,
    negative: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tripel: Product = {
    id: '2',
    name: 'Grimbergen tripel (voor de sfeer)',
    ownerId: '1',
    price: 90,
    picture: 'https://deklokdranken.blob.core.windows.net/product-images/105120.jpg',
    traySize: 24,
    category: 'drink',
    isAlcoholic: true,
    negative: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  radler: Product = {
    id: '3',
    name: 'Radler',
    ownerId: '1',
    price: 50,
    picture: 'https://deklokdranken.blob.core.windows.net/product-images/1021123.jpg',
    traySize: 1,
    category: 'drink',
    isAlcoholic: true,
    negative: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  cola: Product = {
    id: '4',
    name: 'Cola',
    ownerId: '2',
    price: 70,
    picture: 'https://deklokdranken.blob.core.windows.net/product-images/201003.jpg',
    traySize: 1,
    category: 'drink',
    isAlcoholic: false,
    negative: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  cassis: Product = {
    id: '5',
    name: 'Cassis',
    ownerId: '2',
    price: 70,
    picture: 'https://deklokdranken.blob.core.windows.net/product-images/205053.jpg',
    traySize: 1,
    category: 'drink',
    isAlcoholic: false,
    negative: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  fristi: Product = {
    id: '6',
    name: 'Fristi',
    ownerId: '2',
    price: 90,
    picture: 'https://deklokdranken.blob.core.windows.net/product-images/242052.jpg',
    traySize: 1,
    category: 'drink',
    isAlcoholic: false,
    negative: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beers: Product[] = [this.beugel, this.tripel, this.radler];

  sodas: Product[] = [this.cola, this.cassis, this.fristi];

  beerProducts: ProductCategory = {
    id: '1',
    name: 'zuiphulp',
    products: this.beers,
  };

  sodaProducts: ProductCategory = {
    id: '2',
    name: 'laf',
    products: this.sodas,
  };

  productCategories: ProductCategory[] = [this.beerProducts, this.sodaProducts];

  // *************************************************
  //
  //               End test data
  //
  // *************************************************
}
</script>
