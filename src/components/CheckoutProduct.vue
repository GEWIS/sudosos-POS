<template>
  <div>{{subTransaction.productId}}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { SubTransaction } from '@/entities/SubTransaction';

@Component
export default class CheckoutProduce extends Vue {
  @Prop()
  subTransaction!: SubTransaction;
}
</script>

<style scoped lang="scss">

</style>
