<template>
  <b-row class="products-table-row" :class="{editing}" @click="rowClicked">
    <keypad v-show="openKeypad" :value.sync="item.amount" @close="closeKeypad"/>
    <b-col cols="2">
      <p class="first-col">{{ item.amount }}</p>
    </b-col>
    <b-col cols="6">
      <p>{{ item.product.name }}</p>
    </b-col>
    <b-col cols="4">
      <p>€{{ productTotal / 100 }}</p>
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
import { getModule } from 'vuex-module-decorators';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import Formatters from '@/mixins/Formatters';
import Keypad from '@/components/Keypad.vue';
import TransactionModule from '@/store/modules/transactions';

@Component({
  components: {
    Keypad,
  },
})
export default class ProductsTableRow extends Formatters {
  @Prop() item!: SubTransactionRow;

  transactionsState = getModule(TransactionModule);

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
    console.log(this.item);
    return this.item.price.amount * this.item.amount;
  }

  rowClicked() {
    this.editing = !this.editing;
    this.$parent.$emit('productsTable/itemClicked', this.item);
  }

  deleteItem() {
    const { rows } = this.$parent.$parent.$parent;
    this.$parent.$parent.$parent.rows = rows
      .filter((row) => row.product.id !== this.item.product.id);
  }

  closeKeypad() {
    if (this.item.amount === 0) {
      this.deleteItem();
    }
    this.openKeypad = false;
    const itemIndex = this.$parent.$parent.$parent.rows
      .findIndex((row) => row.product.id === this.item.product.id);

    this.$parent.$parent.$parent.rows[itemIndex].amount = this.item.amount;
  }

  decreaseItem() {
    if (this.item.amount > 1) {
      const itemIndex = this.$parent.$parent.$parent.rows
        .findIndex((row) => row.product.id === this.item.product.id);

      this.$parent.$parent.$parent.rows[itemIndex].amount -= 1;
    } else {
      this.deleteItem();
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
