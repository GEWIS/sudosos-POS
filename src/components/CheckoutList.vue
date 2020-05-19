<template>
  <div class="checkout-list">
    <CheckoutProduct v-for="subTransaction in subTransactionsList"
         :subTransaction="subTransaction"
         :key="subTransaction.id"
         class="subTransaction-item">
    </CheckoutProduct>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Product } from '@/entities/Product';
import { SubTransaction } from '@/entities/SubTransaction';
import CheckoutProduct from '@/components/CheckoutProduct.vue';

function fetchSubTransactions() : SubTransaction[] {
  const subTransactions = [
    {
      transactionId: '001',
      productId: '1',
      storageId: '1',
      amount: 4,
      pricePerProduct: 110,
    } as SubTransaction,
    {
      transactionId: '001',
      productId: '2',
      storageId: '1',
      amount: 2,
      pricePerProduct: 90,
    } as SubTransaction,
    {

      transactionId: '001',
      productId: '3',
      storageId: '2',
      amount: 1,
      pricePerProduct: 50,
    } as SubTransaction,
    {
      transactionId: '001',
      productId: '2',
      storageId: '1',
      amount: 2,
      pricePerProduct: 90,
    } as SubTransaction,
  ] as SubTransaction[];

  return subTransactions;
}
@Component({
  components: { CheckoutProduct },
})
export default class CheckoutList extends Vue {
  subTransactionsList: SubTransaction[] = [];

  beforeMount() {
    this.subTransactionsList = fetchSubTransactions();
  }
}
</script>

<style scoped lang="scss">
  .checkout-list {
    background: $gewis-grey-light;
    scroll-behavior: smooth;
  }
</style>
