<template>
  <b-container fluid class="product">
    <b-row class="text-center" align-v="center">
      <b-col class="name text-left">
        {{product.name}}
      </b-col>
      <b-col class="amount">
        <a><font-awesome-icon icon="minus" class="mr-2"></font-awesome-icon></a>
        x{{subTransaction.amount}}
        <a><font-awesome-icon icon="plus" class="ml-2"></font-awesome-icon></a>
      </b-col>
      <b-col class="text-right">
        <span class="price">{{ dinero({amount: subTransactionPrice}).toFormat() }}</span>
        <a><font-awesome-icon icon="trash" class="ml-2"></font-awesome-icon></a>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SubTransaction } from '@/entities/SubTransaction';
import { Product } from '@/entities/Product';
import Formatters from '@/mixins/Formatters';

@Component
export default class CheckoutProduce extends Formatters {
  @Prop()
  subTransaction!: SubTransaction;

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

  pid = this.subTransaction.productId;

  product = this.products[this.pid];

  pricePerProduct = this.subTransaction.pricePerProduct;

  productAmount = this.subTransaction.amount;

  subTransactionPrice = this.pricePerProduct * this.productAmount;
}
</script>

<style scoped lang="scss">
    .product {
      background-color: $gewis-grey-accent;
      margin: 0.7rem 0;
      font-size: larger;

      .name {
      }

      .amount {
        font-weight: bold;
      }

      .price {
        color: $gewis-red;
      }
    }
</style>
