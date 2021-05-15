<template>
  <b-row class="checkout-button"
    :class="{'checking-out': checkingOut}"
    @click="buttonClicked">
    <p>{{ buttonText }}</p>
  </b-row>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CheckoutButton extends Vue {
  private countdown: number = 3;

  private buttonText: string = 'Checkout';

  private checkingOut: boolean = false;

  private timeout: number = 0;

  checkout() {
    if (this.countdown > 0) {
      this.buttonText = this.countdown.toString();
      this.timeout = window.setTimeout(() => {
        this.countdown -= 1;
        this.checkout();
      }, 1000);
    } else {
      this.buttonText = 'Transaction done';
      this.finishTransaction();
    }
  }

  finishTransaction() {
    this.$router.push('/login');
  }

  buttonClicked() {
    if (this.checkingOut) {
      clearTimeout(this.timeout);
      this.countdown = 3;
      this.buttonText = 'Checkout';
      this.checkingOut = false;
    } else {
      this.checkingOut = true;
      this.checkout();
    }
  }
}
</script>
<style lang="scss" scoped>
  .checkout-button {
    cursor: pointer;
    height: 12%;
    background-color: #93e78e;
    display: flex;
    justify-content: center;
    align-items: center;

    &.checking-out {
      background-color: #ed5a5a;
      animation: checkout-background 1s 3;

      p {
        color: white;
      }
    }
    p {
      font-size: 2rem;
      color: #525659;
      font-weight: 700;
      margin: 0;
    }

    @keyframes checkout-background {
      from { background-color: #ed5a5a;}
      to { background-color: #F40000;}
    }
  }
</style>
