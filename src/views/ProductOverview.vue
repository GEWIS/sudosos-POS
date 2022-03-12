<template>
  <div>
    <b-nav
      :vertical="vertical"
      class="nav align-items-center"
      v-bind:class="{ vertical: vertical, horizontal: !vertical }"
    >
      <b-nav-item class="gewis-logo d-none d-sm-block">
        <img src="@/assets/img/gewis-branding.svg" alt="GEWIS Logo" />
      </b-nav-item>
      <home-menu-button :name="'beer'" />
      <home-menu-button :name="'coffee'" />
      <home-menu-button :name="'cookie-bite'" />
      <home-menu-button :name="'ticket-alt'" />

      <b-nav-item
        class="other-button"
        @click="clickSearchButton"
        :class="{ active: searchState.searching }"
      >
        <font-awesome-icon icon="search" />
      </b-nav-item>
      <b-nav-item class="">
        <font-awesome-icon icon="ellipsis-h" />
      </b-nav-item>
    </b-nav>
    <main class="product-overview-container">
      <b-row class="product-row">
        <ProductComponent
          v-for="item in filteredProducts"
          :product="item"
          :key="item.id"
        />
      </b-row>
      <searchbar-with-keyboard
        :input.sync="query"
        :showSearchbar="searchState.searching"
      >
      </searchbar-with-keyboard>
      <checkout-bar :subTransactionRows="rows"/>
    </main>
    <user-selection-component v-if="searchState.userSearching"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Product } from '@/entities/Product';
import SearchbarWithKeyboard from '@/components/SearchbarWithKeyboard.vue';
import UserSelectionComponent from '@/components/UserSelectionComponent.vue';
import ProductComponent from '@/components/ProductComponent.vue';
import HomeMenuButton from '@/components/HomeMenuButton.vue';
import CheckoutBar from '@/components/CheckoutBar.vue';
import SearchModule from '@/store/modules/search';
import { getProducts } from '@/api/products';
import { getPointOfSale, getPointOfSaleProducts } from '@/api/pointOfSale';
import { Transaction } from '@/entities/Transaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { SubTransaction } from '@/entities/SubTransaction';
import { PointOfSale } from '@/entities/PointOfSale';

@Component({
  components: {
    ProductComponent,
    SearchbarWithKeyboard,
    HomeMenuButton,
    CheckoutBar,
    UserSelectionComponent,
  },
})
export default class ProductOverview extends Vue {
    // Proxy for the state, compact notation
    private searchState = getModule(SearchModule);

    private products: Product[] = [];

    public rows: SubTransactionRow[] = [];

    public pointOfSale: PointOfSale | null = null;

    public vertical: boolean = window.innerWidth / window.innerHeight >= 1;

    async mounted() {
    // Initialize the product overview with beer
      this.searchState.updateFilterName('Alcoholic');
      window.addEventListener('resize', () => {
        this.checkWindowSize();
      });
      this.pointOfSale = await getPointOfSale(1);
      this.pointOfSale.containers.forEach((con) => {
        const containerId = con.id;
        con.products.forEach((prod) => {
          prod.containerId = containerId;
          this.products.push(prod);
        });
      });
    }

    checkWindowSize() {
      this.vertical = window.innerWidth / window.innerHeight >= 1;
    }

    clickSearchButton() {
      this.searchState.setSearching(!this.searchState.searching);
    }

    addProduct(product: Product, amount: number) {
      const productIndex = this.rows.findIndex((row) => row.product.id === product.id);
      if (productIndex > -1) {
        this.rows[productIndex].amount += amount;
      } else {
        const row = {
          product,
          amount,
          price: product.price,
        } as SubTransactionRow;
        this.rows.push(row);
      }
    }

  // What is the user searching for?
  query: string = '';

  // Filter the products by the desired criteria
  get filteredProducts() {
    if (this.searchState.searching) {
      return this.products
        .filter((product: Product) => product
          .name.toLowerCase().includes(this.query.toLowerCase()));
    }
    // @ts-ignore
    const currentName = this.searchState.filterName;
    console.log(this.products);
    return this.products.filter(
      (product: Product) => product.category.name === currentName,
    );
  }
}
</script>

<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/Nav.scss";

.vertical {
  height: 100vh;
  width: 6rem;
  position: fixed;
  top: 0;

  > li {
    width: 100%;

    &.other-button {
      margin-top: auto;
    }
  }
}

.vertical ~ main {
  margin-left: 6rem;
  display: flex;
  .product-overview-container {
    flex-grow: 1;
  }
  .checkoutbar {
    width: 16rem;
  }
  .product-row {
    flex: 1;
    margin: 0
  }
}

.horizontal ~ main {
  .searchbar-container {
    left: 0;
    width: 100%;
  }
}

.horizontal {
  width: 100%;

  > li {
    height: 100%;
    width: calc(100% / 6);

    > a {
      margin: auto 0;
      padding: 0;

      > svg {
        font-size: 30px;
      }
    }

    &.gewis-logo > a {
      padding: 0.5rem 0.2rem !important;

      > img {
        margin-top: -0.4rem !important;
        height: 100%;
      }
    }
  }
}
.product-card {
  margin: 0.5rem 0;

  .product {
    background-color: $gewis-grey-light;

    > img {
      width: auto;
      height: auto;
      max-height: 5rem;
      background-color: $gewis-grey-light;
    }
  }
}

.product-name {
  background: $gewis-grey-accent;
}
@include media-breakpoint-down(lg) {
  .horizontal > .gewis-logo > a > img {
    max-height: 59px !important;
  }
}

@include media-breakpoint-up(sm) {
  .horizontal > li {
    width: calc(100% / 7);
  }
}
</style>
