<template>
  <b-row class="products-table-row">
    <b-button class="row-button" @mouseup="decreaseClick" @mousedown="startDecreaseHold" @mouseleave="stopHold">-</b-button>
    <div class="row-amount">{{amount}}</div>
    <b-button class="row-button" @mouseup="increaseClick" @mousedown="startIncreaseHold" @mouseleave="stopHold">+</b-button>
    <div class="row-name">{{ item.product.name }}</div>
    <div class="row-price">€{{ (productTotal / 100).toFixed(2) }}</div>
  </b-row>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import Formatters from '@/mixins/Formatters';
import CartModule from '@/store/modules/cart';

@Component({
  components: {},
})
export default class CartProduct extends Formatters {
  @Prop() item!: SubTransactionRow;

  private cartState = getModule(CartModule);

  private holdDefaultDelay: number = 400;

  private holdMinimalDelay: number = 80;

  private holdDecreaseFactor: number = 1.5;

  private holdDelay: number = 1000;

  private held: boolean = false;

  private timeoutHandle: number;

  get amount(): number {
    return this.item.amount;
  }

  get productTotal() {
    return this.item.priceInclVat.getAmount() * this.item.amount;
  }

  increaseClick() {
    this.held = false;
    this.increaseItem();
  }

  decreaseClick() {
    this.held = false;
    this.decreaseItem();
  }

  increaseItem() {
    this.cartState.increaseProduct({product: this.item.product, amount: 1});
  }

  decreaseItem() {
    this.cartState.decreaseProduct({product: this.item.product, amount: 1});
  }

  stopHold() {
    this.held = false;
  }

  startDecreaseHold() {
    this.held = true;
    clearTimeout(this.timeoutHandle);
    this.holdDelay = this.holdDefaultDelay;
    this.decreaseHold();
  }

  startIncreaseHold() {
    this.held = true;
    clearTimeout(this.timeoutHandle);
    this.holdDelay = this.holdDefaultDelay;
    this.increaseHold();
  }

  increaseHold() {
    if (!this.held) return;

    // @ts-ignore
    this.timeoutHandle = setTimeout(() => {
      if (!this.held) return;

      this.increaseItem();
      this.decreaseDelay();
      this.increaseHold();
    }, this.holdDelay);
  }

  decreaseHold() {
    if (!this.held) return;

    // @ts-ignore
    this.timeoutHandle = setTimeout(() => {
      if (!this.held) return;

      this.decreaseItem();
      this.decreaseDelay();
      this.decreaseHold();
    }, this.holdDelay);
  }

  decreaseDelay() {
    this.holdDelay = Math.round(this.holdDelay / this.holdDecreaseFactor);

    if (this.holdDelay < this.holdMinimalDelay) {
      this.holdDelay = this.holdMinimalDelay;
    }
  }
}
</script>
<style lang="scss" scoped>
.products-table-row {
  width: 100%;
  margin: 0 0 4px 0;
  align-items: center;

  .row-button {
    width: 40px;
    height: 40px;
    line-height: 20px;
    color: white;
    font-size: 20px;
    background: $gewis-red;
    border: none;

    &:active {
      background-color: $gewis-red !important;
      border: none;
    }
  }

  .row-amount {
    margin: 0 8px;
    width: 20px;
    text-align: center;
  }

  .row-name {
    margin-left: 8px;
    flex: 1;
  }

  .row-price {
    justify-self: right;
    margin-right: 12px;
  }
}
</style>
