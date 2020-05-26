<template>
  <b-container fluid class="h-100">
    <!-- Checkout header -->
    <b-row class="head" align-v="center">
      <b-col cols="10">
        <b-row align-h="start" align-v="center" class="pb-2 pt-2">
          <b-col cols="3">
            <font-awesome-icon icon="user"></font-awesome-icon>
          </b-col>
          <b-col cols="9" class="text-left username">
            <b-row cols="12">
              <!-- TODO: is dit handig? -->
              <!-- Zie: https://code.luasoftware.com/tutorials/bootstrap/bootstrap-hide-element-based-on-viewport-size/ -->
              <span>Marcin</span>
              <span class="d-none d-md-block ml-2">van de Ven</span>
              <span class="d-block d-md-none ml-2">(1234)</span>
            </b-row>
          </b-col>
        </b-row>
        <b-row align-h="start" align-v="center" class="pt-2">
          <b-col cols="3">
            <font-awesome-icon icon="wallet" ></font-awesome-icon>
          </b-col>
          <b-col cols="9" class="text-left balance">
            <b-row cols="12">{{ dinero({amount: 1337}).toFormat() }}</b-row>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="2" class="text-left pl-1">
        <font-awesome-icon icon="sign-out-alt" size="2x"></font-awesome-icon>
      </b-col>
    </b-row>

    <!-- Checkout list -->
    <b-row class="pb-2" cols="12"><b-col>
      <CheckoutList></CheckoutList>
    </b-col></b-row>

    <!-- Checkout calculation -->
    <b-row class="bottom-fix w-100" cols="12">
    <b-row class="summary ml-2 mr-2 summary-border">
        <b-col class="text-left ml-n2">Total</b-col>
        <b-col class="text-right mr-n2 price">
          {{ dinero({amount: 337}).toFormat() }}
        </b-col>
      </b-row>
      <b-row class="summary ml-2 mr-2 ">
        <b-col class="text-left ml-n2">Balance after</b-col>
        <b-col class="text-right mr-n2 balance">
          {{ dinero({amount: 1337}).toFormat() }}
        </b-col>
      </b-row>

    <!-- Checkout button -->

    <b-row align-v="center" class="bottom-button checkout-button">
      <b-col class="text-center">
        <font-awesome-icon icon="check" ></font-awesome-icon> Checkout
      </b-col>
    </b-row>

    <!-- Checkout options -->
    <b-row align-v="center" class="bottom-button checkout-options ">
      <b-col cols="6" class="option-border text-center">
        Checkout &amp; Continue
      </b-col>
      <b-col cols="6" class="text-center">
        Charge someone
      </b-col>
    </b-row>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CheckoutList from '@/components/CheckoutList.vue';
import Formatters from '@/mixins/Formatters';

@Component({
  components: { CheckoutList },
})
export default class Checkout extends Formatters {

}
</script>

<style scoped lang="scss">
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
    font-size: x-large;
  }

  .checkout-button {
    background: $gewis-green;
  }


  @media(min-width: 768px){ // Tablets
    .bottom-button {
      padding: 1rem;
      font-size: x-large;
      font-weight: bolder;
    }
    .checkout-button {
      padding-left: 3rem;
      padding-right: 3rem;
    }
  }

  @media(min-width: 992px){ // Desktops
    .bottom-button {
      padding: 1rem;
      padding-left: 2rem;
      padding-right: 2rem;
      font-size: xx-large;
      font-weight: bolder;
    }
  }


</style>
