<template>
  <b-container fluid>
    <b-row class="head" align-v="center">
      <b-col cols="9">
        <b-row align-h="start" align-v="center" class="pb-2">
          <b-col cols="3">
            <font-awesome-icon icon="user" size="2x"></font-awesome-icon>
          </b-col>
          <b-col cols="9" class="text-left username">Marcin</b-col>
        </b-row>
        <b-row align-h="start" align-v="center" class="pt-2">
          <b-col cols="3">
            <font-awesome-icon icon="wallet" size="2x"></font-awesome-icon>
          </b-col>
          <b-col cols="9" class="text-left balance">
            {{ dinero({amount: 1337}).toFormat() }}
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="3">
        <font-awesome-icon icon="sign-out-alt" size="4x"></font-awesome-icon>
      </b-col>
    </b-row>
        <b-row><b-col>
          <CheckoutList></CheckoutList>
        </b-col></b-row>
        <b-row><b-col>
          FOOT
         </b-col></b-row>
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
    font-size: larger;
    padding: 0.5rem;
  }

  .username {
    font-size: larger;
  }

  .balance {
    font-size: larger;
    color: $gewis-green;
  }

</style>
