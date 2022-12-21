<template>
  <b-row class="cart-product">
    <b-button class="adjust-button" @mouseup="decreaseClick" @mousedown="startDecreaseHold" @mouseleave="stopHold">-</b-button>
    <div class="amount">{{amount}}</div>
    <b-button class="adjust-button" @mouseup="increaseClick" @mousedown="startIncreaseHold" @mouseleave="stopHold">+</b-button>
    <div class="name">{{ item.product.name }}</div>
    <div class="price">€{{ (productTotal / 100).toFixed(2) }}</div>
  </b-row>
</template>
<script lang="ts">
import { 
  Component, Prop 
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import Formatters from '@/mixins/Formatters';
import CartModule from '@/store/modules/cart';

/**
 * Component for displaying a product in the shopping cart.
 */
@Component({
  components: {},
})
export default class CartProduct extends Formatters {
  /**
   * The item that is currently in the shopping cart. This is a
   * SubTransactionRow and a required prop of this component.
   */
  @Prop() item!: SubTransactionRow;

  private cartState = getModule(CartModule);

  /**
   * The default delay for the adjust amount buttons. This is the first delay
   * before the amount starts to increase or decrease.
   */
  private holdDefaultDelay: number = 400;

  /**
   * The minimal delay for the adjust amount buttons. This means the maximum
   * adjustment per second is 1000 / this value.
   */
  private holdMinimalDelay: number = 80;

  /**
   * The factor in which the delay for the adjust amount buttons is decreased.
   * This is calculated as newDelay = delay / this value.
   */
  private holdDecreaseFactor: number = 1.5;

  /**
   * The current delay for the adjust amount buttons. This is the delay between
   * each adjustment.
   */
  private holdDelay: number;

  /**
   * If one of the adjust amount buttons is currently being held down.
   */
  private held: boolean = false;

  /**
   * The handle for the timeout that is used to decrease the delay for the
   * adjust amount buttons and to adjust the amount.
   */
  private timeoutHandle: number;

  /**
   * The amount of the item that is currently in the shopping cart.
   */
  get amount(): number {
    return this.item.amount;
  }

  /**
   * The total price of the item that is currently in the shopping cart.
   */
  get productTotal() {
    return this.item.priceInclVat.getAmount() * this.item.amount;
  }

  /**
   * Listener for the mouseup event on the increase button. This will stop the
   * hold and increase the amount by one.
   */
  increaseClick() {
    this.held = false;
    this.increaseItem();
  }

  /**
   * Listener for the mouseup event on the decrease button. This will stop the
   * hold and decrease the amount by one.
   */
  decreaseClick() {
    this.held = false;
    this.decreaseItem();
  }

  /**
   * Increase the amount of the item by the given amount in the shopping cart.
   * @param {number} amount The amount to increase the amount of the item by.
   */
  increaseItem(amount: number = 1) {
    this.cartState.increaseProduct({product: this.item.product, amount});
  }

  /**
   * Decrease the amount of the item by the given amount in the shopping cart.
   * @param {number} amount The amount to decrease the amount of the item by.
   */
  decreaseItem(amount: number = 1) {
    this.cartState.decreaseProduct({product: this.item.product, amount});
  }

  /**
   * A listener to stop the hold for the adjust amount buttons.
   */
  stopHold() {
    this.held = false;
  }

  /**
   * A listener to start the hold for the decrease buttons. This will start the
   * timeout that will decrease the delay and adjust the amount.
   */
  startDecreaseHold() {
    this.held = true;
    clearTimeout(this.timeoutHandle);
    this.holdDelay = this.holdDefaultDelay;
    this.decreaseHold();
  }

  /**
   * A listener to start the hold for the increase buttons. This will start the
   * timeout that will decrease the delay and adjust the amount.
   */
  startIncreaseHold() {
    this.held = true;
    clearTimeout(this.timeoutHandle);
    this.holdDelay = this.holdDefaultDelay;
    this.increaseHold();
  }

  /**
   * This function is called while the increase button is being held down. This
   * will decrease the delay and adjust the amount and thus the function is
   * called more quickly the longer the button is held.
   */
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

  /**
   * This function is called while the decrease button is being held down. This
   * will decrease the delay and adjust the amount and thus the function is
   * called more quickly the longer the button is held.
   */
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

  /**
   * Decrease the delay for the adjust amount buttons. This will decrease the
   * delay by the decrease factor and will not decrease the delay below the
   * minimal delay.
   */
  decreaseDelay() {
    this.holdDelay = Math.round(this.holdDelay / this.holdDecreaseFactor);

    if (this.holdDelay < this.holdMinimalDelay) {
      this.holdDelay = this.holdMinimalDelay;
    }
  }
}
</script>
<style lang="scss" scoped>
.cart-product {
  width: 100%;
  margin: 0;
  align-items: center;

  .adjust-button {
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

  .amount {
    margin: 0 8px;
    width: 20px;
    text-align: center;
  }

  .name {
    margin-left: 8px;
    flex: 1;
  }

  .price {
    justify-self: right;
    margin-right: 12px;
  }
}
</style>
