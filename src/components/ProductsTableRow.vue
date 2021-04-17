<template>
  <b-row class="products-table-row" :class="{editing}" @click="rowClicked">
    <keypad v-if="openKeypad" :value.sync="item.amount" @close="closeKeypad"/>
    <b-col cols="2">
      <p class="first-col">{{ item.amount }}</p>
    </b-col>
    <b-col cols="6">
      <p>{{ item.product.name }}</p>
    </b-col>
    <b-col cols="4">
      <p>{{ dinero({ amount: productTotal}).toFormat() }}</p>
    </b-col>
    <b-col cols="12" v-if="editing" class="edit-buttons">
      <b-row>
        <b-col class="edit-button" cols="4" @click.stop="decreaseItem">
          <span>−</span>
        </b-col>
        <b-col class="edit-button" cols="4" @click.stop="openKeypad = true">
          <span>✎</span>
        </b-col>
        <b-col class="edit-button" cols="4" @click.stop="deleteItem">
          <span>✖</span>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</template>
<script lang="ts">
import {
  Component, Prop, PropSync, Vue,
} from 'vue-property-decorator';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import Formatters from '@/mixins/Formatters';
import Keypad from '@/components/Keypad.vue';
@Component({
  components: {
    Keypad,
  },
})
export default class ProductsTable extends Formatters {
  @Prop() item!: SubTransactionRow;

  private editing: boolean = false;

  private openKeypad: boolean = false;

  mounted() {
    this.$parent.$on('productsTable/itemClicked', (clickedItem: SubTransactionRow) => {
      if (clickedItem !== this.item) {
        this.editing = false;
      }
    });
  }

  get productTotal() {
    return this.item.price.multiply(this.item.amount);
  }

  rowClicked() {
    this.editing = !this.editing;
    this.$parent.$emit('productsTable/itemClicked', this.item);
  }

  deleteItem() {
    this.$store.commit('transactionState/removeProduct', this.item.product);
  }

  closeKeypad() {
    if (this.item.amount === 0) {
      this.$store.commit('transactionState/removeProduct', this.item.product);
    }
    this.openKeypad = false;
  }

  decreaseItem() {
    if (this.item.amount > 1) {
      this.$store.commit('transactionState/addProduct', {
        product: this.item.product, amount: -1,
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.products-table-row {
  border-bottom: 4px solid white;
  margin: 0;
  &.editing {
    background-color: #525659;
    p {
      color: white;
    }
  }

  div {
    padding: 0;
    p {
      // align the first item center
      &.first-col {
        text-align: center;
      }
      margin-bottom: 0.5em;
      margin-top: 0.5em;
      font-weight: 700;
    }
  }
  .edit-buttons {
    .row {
      margin: 0;
      .edit-button {
        cursor: pointer;
        text-align: center;
        background-color: white;
        span {
          font-size: 1.5rem;
        }
      }
    }
  }
}
</style>
