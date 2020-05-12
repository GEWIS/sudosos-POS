<template>
  <div>
    <b-row class="mx-0">
      <ProductComponent v-for="item in products"
                        :product="item"
                        :key="item.id"
      />
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import ProductComponent from '@/components/ProductComponent.vue';

  @Component({
    components: {
      ProductComponent,
    },
  })
export default class ProductListComponent extends Vue {
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
      picture: 'https://www.supermarktaanbiedingen.com/public/images/product/2017/39/0-508102fls-grolsch-premium-pilsner-beugel-45cl.jpg',
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

    private alcoholFree: Product = {
      id: '3',
      name: 'Alcoholvrije Athena-meuk',
      ownerId: '2',
      price: 50,
      picture: 'https://www.cocktailicious.nl/wp-content/uploads/2019/10/sex-on-the-beach.jpg',
      traySize: 1,
      category: 'drink',
      isAlcoholic: false,
      negative: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    private cocktail: Product = {
      id: '4',
      name: 'Athena-meuk met alcohol',
      ownerId: '2',
      price: 150,
      picture: 'https://www.mitra.nl/cms/userfiles/cocktails/298-mojito43.png',
      traySize: 1,
      category: 'drink',
      isAlcoholic: true,
      negative: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // *************************************************
    //
    //               End test data
    //
    // *************************************************
    products: Product[] = [this.beugel, this.tripel, this.alcoholFree, this.cocktail];
}

</script>

<style scoped lang="scss">
  .product-card {
    margin: 0.5rem 0;

    .product {
      background-color: $gewis-grey-light;

      > img {
        width: auto;
        height: auto;
        max-height: 5rem;
        background-color: $gewis-grey-light;
      }
    }
  }

  .product-name {
    background: $gewis-grey-accent;
  }
</style>
