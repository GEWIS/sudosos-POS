<template>
  <div class="checkout-list mx-2">
    <CheckoutProduct v-for="subTransaction in subTransactionsList"
         :subTransaction="subTransaction"
         :key="subTransaction.id">
    </CheckoutProduct>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SubTransaction } from '@/entities/SubTransaction';
import CheckoutProduct from '@/components/CheckoutProduct.vue';
import FakeSubTransactions from '@/assets/FakeSubTransactions';

@Component({
  components: { CheckoutProduct },
})
export default class CheckoutList extends Vue {
  subTransactionsList: SubTransaction[] = [];

  beforeMount() {
    this.subTransactionsList = FakeSubTransactions.fetchSubTransactions();
  }
}
</script>

<style scoped lang="scss">
  .checkout-list {
    scroll-behavior: smooth;
  }
</style>
