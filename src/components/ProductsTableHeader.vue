<template>
  <b-row class="products-table-header">
    <b-col cols="2">
      <p class="first-col">#</p>
    </b-col>
    <b-col cols="6"><p>Item</p></b-col>
    <b-col cols="4"><p>Price</p></b-col>
  </b-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class ProductsTableHeader extends Vue {}
</script>
<style lang="scss" scoped>
.products-table-header {
  border-bottom: 4px solid #525659;
  div{
    padding: 0;
    p {
      // align the first item center
      &.first-col {
        text-align: center;
      }
      font-size: 1.5em;
      margin-bottom: 0;
      margin-top: 0.5em;
    }
  }
}
</style>
