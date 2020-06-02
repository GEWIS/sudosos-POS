<!-- TODO: Fix text/button sizing on different layouts and delete this line -->
<template>
  <div class="h-100 pb-4 mr-0" style="overflow: hidden">
    <div id="wrapper">
    <!-- Checkout header -->
    <b-row class="head" align-v="center">
      <b-col cols="10">
        <b-row align-h="start" align-v="center" class="pb-2 pt-2">
          <b-col cols="3">
            <font-awesome-icon icon="user"></font-awesome-icon>
          </b-col>
          <b-col cols="9" class="text-left username text-sizing">
              <span class="d-inline">Marcin</span>
              <span class="d-none d-md-inline ml-2">van de Ven</span>
              <span class="d-inline d-md-none ml-2">(1234)</span>
          </b-col>
        </b-row>
        <b-row align-h="start" align-v="center" class="pt-2">
          <b-col cols="3">
            <font-awesome-icon icon="wallet" ></font-awesome-icon>
          </b-col>
          <b-col cols="9" class="text-left balance text-sizing">
            {{ dinero({amount: 1337}).toFormat() }}
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="2" class="text-left pl-1">
        <font-awesome-icon icon="sign-out-alt" size="2x"></font-awesome-icon>
      </b-col>
    </b-row>

    <!-- Checkout list -->
    <b-row>
      <b-col>
      <CheckoutList></CheckoutList>
    </b-col>
    </b-row>

      <div id="push"></div>
    </div>

    <div id="checkout-buttons">

    <!-- Checkout calculation -->
    <b-row class="summary mx-2 summary-border text-sizing">
        <b-col cols="6" class="text-left ml-n2">Total</b-col>
        <b-col cols="6" class="text-right mr-n2 price">
          {{ dinero({amount: 337}).toFormat() }}
        </b-col>
      </b-row>

      <b-row class="summary mx-2 text-sizing">
        <b-col cols="6" class="text-left ml-n2">Balance after</b-col>
        <b-col cols="6" class="text-right mr-n2 balance">
          {{ dinero({amount: 1337}).toFormat() }}
        </b-col>
      </b-row>

    <!-- Checkout button -->

    <b-row align-v="center" class="bottom-button checkout-button text-sizing">
      <b-col cols="12" class="text-center">
        <font-awesome-icon icon="check" ></font-awesome-icon> Checkout
      </b-col>
    </b-row>

    <!-- Checkout options -->
    <b-row align-v="center" class="bottom-button checkout-options text-sizing">
      <b-col cols="6" class="option-border text-center">
        Checkout &amp; Continue
      </b-col>
      <b-col cols="6" class="text-center">
        Charge someone
      </b-col>
    </b-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import CheckoutList from '@/components/CheckoutList.vue';
import Formatters from '@/mixins/Formatters';

@Component({
  components: { CheckoutList },
})
export default class Checkout extends Formatters {

}
</script>

<style scoped lang="scss">
  @import '~bootstrap/scss/bootstrap';

  #wrapper {
    min-height: 100%;
    margin-bottom: -234px;
    overflow: hidden;
  }

  #checkout-buttons,
  #push {
    height: 234px;
  }

  .head {
    background: $gewis-black;
    color: white;
    font-size: x-large;
    padding: 0.5rem;
  }

  .balance {
    color: $gewis-green;
  }

  .price {
    color: $gewis-red;
  }

  .summary {
    font-size: x-large;
  }

  .summary-border {
    border-top: 0.13rem solid black;
  }

  .bottom-fix {
    position: fixed;
    display: flow;
    bottom: 0;
  }

  .checkout-options {
    background: $gewis-black;
    .option-border {
      border-right: 0.13rem solid white;
    }
  }

  .bottom-button { // Small
    color: white;
    padding: 1rem;
    font-size: large;
  }

  .text-sizing {
    font-size: large;
  }


  .checkout-button {
    background: $gewis-green;
  }

  @include media-breakpoint-up(sm) { // Larger phones
    .text-sizing {
      font-size: larger;
    }
  }

  @include media-breakpoint-up(md) { // Tablets
    .bottom-button {
      padding: 1rem;
    }
    .checkout-button {
      padding-left: 3rem;
      padding-right: 3rem;
    }
    .text-sizing {
      font-size: x-large;
    }
  }

  @include media-breakpoint-up(lg) { // Desktops
    .bottom-button {
      padding: 1rem 2rem;
      font-weight: bolder;
    }
    .text-sizing {
      font-size: xx-large;
    }
  }
</style>
