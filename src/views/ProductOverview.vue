<template>
  <div class="wrapper">
    <div class="product-overview">
      <div class="product-overview-container shadow">
        <b-nav
          class="nav align-items-center">

          <home-menu-button :name="'Alcoholic drinks'" :category="1" />
          <home-menu-button :name="'Non-alcoholic'" :category="2"/>
          <home-menu-button :name="'Snacks'" :category="3"/>
          <home-menu-button :name="'Other'" :category="4" />
        </b-nav>
        <main class="products">
          <div class="product-row">
            <b-col cols="12" class="text-center borrelmode-text"
              v-if="userState.borrelModeOrgan.organName" @click="showSettings = true">
              Borrelmode actief voor {{ userState.borrelModeOrgan.organName }}
            </b-col>
            <ProductComponent
              v-for="item in filteredProducts"
              :product="item"
              :key="`${item.id}-${item.containerId}`"
            />
            <div class="no-components" v-if="filteredProducts.length == 0">
              There are no products in this category.
            </div>
          </div>
        </main>
        <div class="bottom-bar">
          <div class="options-button" @click="showSettings = !showSettings">
            <font-awesome-icon icon="ellipsis-h"/>
          </div>
          <div class="search-bar">
            <font-awesome-icon icon="search"/> Search...
          </div>
        </div>
        <settings-component v-if="showSettings" />
        <user-selection-component v-if="searchState.userSearching"/>
        <organ-member-component v-if="showOrganMembers" />
      </div>
      <checkout-bar :subTransactionRows="rows"/>
    </div>
    <div class="background-logo">
<!--      <img src="@/assets/img/base-gewis-logo.png" alt="logo" />-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Product } from '@/entities/Product';
import SearchbarWithKeyboard from '@/components/SearchbarWithKeyboard.vue';
import UserSelectionComponent from '@/components/UserSelectionComponent.vue';
import SettingsComponent from '@/components/SettingsComponent.vue';
import OrganMemberComponent from '@/components/OrganMemberComponent.vue';
import ProductComponent from '@/components/ProductComponent.vue';
import HomeMenuButton from '@/components/HomeMenuButton.vue';
import CheckoutBar from '@/components/CheckoutBar.vue';
import SearchModule from '@/store/modules/search';

import { getPointOfSale } from '@/api/pointOfSale';
import { Transaction } from '@/entities/Transaction';
import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { SubTransaction } from '@/entities/SubTransaction';
import { PointOfSale } from '@/entities/PointOfSale';
import UserModule from '@/store/modules/user';

@Component({
  components: {
    ProductComponent,
    SearchbarWithKeyboard,
    HomeMenuButton,
    CheckoutBar,
    UserSelectionComponent,
    SettingsComponent,
    OrganMemberComponent,
  },
})

export default class ProductOverview extends Vue {
    // Proxy for the state, compact notation
    private searchState = getModule(SearchModule);

    private userState = getModule(UserModule);

    private products: Product[] = [];

    public rows: SubTransactionRow[] = [];

    public pointOfSale: PointOfSale | null = null;

    public vertical: boolean = window.innerWidth / window.innerHeight >= 1;

    public showSettings: boolean = false;

    public showOrganMembers: boolean = false;

    async mounted() {
      window.addEventListener('resize', () => {
        this.checkWindowSize();
      });
      this.pointOfSale = await getPointOfSale(1);
      this.pointOfSale.containers.forEach((con) => {
        const containerId = con.id;
        (con as any).products.forEach((prod: any) => {
          prod.containerId = containerId;
          this.products.push(prod);
        });
      });

      this.searchState.updateFilterCategory(1);
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
    const currentCategory = this.searchState.filterCategory;
    if (currentCategory === 0) {
      return this.products;
    }
    return this.products.filter(
      (product: Product) => product.category.id === currentCategory,
    );
  }
}
</script>

<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/common.scss";
@import "./src/styles/Nav.scss";

.product-overview {
  flex: 1;
  display: flex;
  flex-direction: row;
  margin: 32px;
  //border-radius: $border-radius;
  //background: rgba(white, 0.8);
  //padding: 16px;
  z-index: 2;
  gap: 16px;
}

.products {
  flex-grow: 1;
}

.product-overview-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: $border-radius;
  background: rgba(white, 0.8);
  padding: 16px;
}

.product-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0;
}

.no-components {
  width: 100%;
  flex: 1;
  text-align: center;
  margin-top: 8px;
}

.bottom-bar {
  width: 100%;
  display: flex;
  align-self: flex-end;
  flex-direction: row;
  flex-grow: 0;
  flex-wrap: nowrap;
  gap: 16px;

  .options-button {
    background-color: $gewis-red;
    border-radius: $border-radius;
    display: flex;
    justify-content: center;
    align-items: center;
    width: $nav-height;
    flex-grow: 0;
    flex-shrink: 0;
    cursor: pointer;
    height: $nav-height;
    text-align: center;
    flex-basis: 62px;
    color: white;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .search-bar {
    border: 1px solid $gewis-red;
    border-radius: $border-radius;
    flex: 0 0 200px;
    width: 200px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    margin-right: 10px;

    .fa-search {
      margin-right: 10px;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}

.borrelmode-text {
  background-color: green;
  color: white;
  font-size: 1.5rem;
  padding: 0.5rem;
}

.product-name {
  background: $gewis-grey-accent;
}

@media screen and (max-width: 950px) {
  .product-overview {
    margin: 0;
    border-radius: 0;
  }
}

@media screen and (max-width: 820px) {
  .product-overview {
    flex-direction: column;
    padding: 8px;
  }

  .product-overview-container {
    border-bottom: 1px solid $bootstrap-black;
    margin-bottom: 8px;
  }
}
</style>
<style lang="scss">
.pos-card {
    width: 80%;
    left: 10%;
    position: absolute;
    background-color: white;
    top: 0;
    height: 100%;
}
</style>
