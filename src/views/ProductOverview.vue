<template>
  <div class="wrapper">
    <div class="product-overview">
      <div class="product-overview-container shadow">
        <b-nav v-if="state == State.CATEGORIES"
          class="align-items-center">
          <home-menu-button :name="'Alcoholic drinks'" :category="1" />
          <home-menu-button :name="'Non-alcoholic'" :category="2"/>
          <home-menu-button :name="'Snacks'" :category="3"/>
          <home-menu-button :name="'Other'" :category="4" />
        </b-nav>
        <div v-if="state == State.SEARCH || state == State.USER_SEARCH"
          class="nav align-items-center">
          <div class="nav-item active exit-search-button" @click="exitSearch()">
            <div class="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
            </div>
          </div>
          <div class="nav-item search-text" @click="focusOnSearch()">
            <font-awesome-icon icon="search"/>
            <span class="text">{{state == State.SEARCH ? query : userQuery}}</span>
            <div class="indicator"></div>
            <input type="text" id="search-input1" v-model="query" @input="updateSearchFromInput" v-if="state == State.SEARCH" />
            <input type="text" id="search-input2" v-model="userQuery" @input="updateSearchFromInput" v-if="state == State.USER_SEARCH" />
          </div>
          <div class="nav-item active" v-if="state == State.USER_SEARCH" @click="orderSelf()">
            <div class="nav-link">
              Order myself
            </div>
          </div>
        </div>
        <main class="products custom-scrollbar" v-if="state == State.CATEGORIES || state == State.SEARCH">
          <div class="product-row">
            <ProductComponent
              v-for="item in filteredProducts"
              :product="item"
              :key="`${item.id}-${item.containerId}`"
            />
            <div class="no-components" v-if="filteredProducts.length == 0">
              <div v-if="searchState.searching">There are no products for this query.</div>
              <div v-else>There are no products in this category.</div>
            </div>
          </div>
        </main>
        <div class="users custom-scrollbar" v-if="state == State.USER_SEARCH">
          <div class="users-row">
            <div class="user" v-for="item in filteredUsers" :key="`${item.gewisID}`" @click="userSelected(item)">
              <div class="user-button">Select</div>
              <div class="user-text">{{item.firstName}} {{item.lastName}} - {{item.gewisID}}</div>
            </div>
          </div>
        </div>
        <div class="keyboard-container" :style="{'display': (state == State.SEARCH || state == State.USER_SEARCH) ? 'initial' : 'none'}">
          <keyboard ref="keyboard" :onChange="updateSearchFromKeyboard" :allowNumbers="state == State.USER_SEARCH"/>
        </div>
        <div class="bottom-bar" v-if="state == State.CATEGORIES">
          <div class="options-button" id="options-button" @click="showSettings = !showSettings">
            <font-awesome-icon icon="ellipsis-h"/>
          </div>
          <settings-component v-if="showSettings" :visible="showSettings" />
          <div class="search-bar" @click="openProductSearch()">
            <font-awesome-icon icon="search"/> Search...
          </div>
        </div>
        <div class="organ-members" v-if="state == State.ORGAN_MEMBER_SELECT">
          <div class="top-bar">
            <div class="close-button" @click="exitPickMember()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
            </div>
            <div class="title">Select a member of {{userState.borrelModeOrgan.organName}} to charge as:</div>
          </div>
          <div class="organ-member" v-for="user in userState.borrelModeOrgan.organMembers"
            v-bind:key="user.id" @click="organMemberSelected(user)">
            <span>{{ user.firstName }} {{ user.lastName }}</span>
          </div>
        </div>
      </div>
      <checkout-bar ref="checkoutBar" :subTransactionRows="rows" :openUserSearch="openUserSearch"/>
    </div>
    <div class="background-logo">
<!--      <img src="@/assets/img/base-gewis-logo.png" alt="logo" />-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Dinero from 'dinero.js';
import { getModule } from 'vuex-module-decorators';
import { Product } from '@/entities/Product';
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
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';

import FuzzySearch from 'fuzzy-search';
import Keyboard from '@/components/Keyboard.vue';
import 'simple-keyboard/build/css/index.css';

enum State {
  CATEGORIES,
  SEARCH,
  USER_SEARCH,
  ORGAN_MEMBER_SELECT,
}

@Component({
  components: {
    ProductComponent,
    HomeMenuButton,
    CheckoutBar,
    SettingsComponent,
    OrganMemberComponent,
    Keyboard,
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

  State: any = State;

  private userQuery: string = '';

  private query: string = '';

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

  get state() {
    if(this.showOrganMembers) {
      return State.ORGAN_MEMBER_SELECT;
    }
    else if(this.searchState.userSearching) {
      return State.USER_SEARCH;
    }
    else if(this.searchState.searching) {
      return State.SEARCH;
    }
    
    return State.CATEGORIES;
  }

  openProductSearch() {
    this.searchState.updateSearching(true);
    // @ts-ignore
      this.$refs.keyboard.setInput("");

    this.$nextTick(() => this.focusOnSearch());
  }

  openUserSearch() {
    this.searchState.updateUserSearching(true);
    // @ts-ignore
      this.$refs.keyboard.setInput("");

    this.$nextTick(() => this.focusOnSearch());
  }

  exitSearch() {
    if(this.state == State.SEARCH) {
      this.searchState.updateSearching(false);
    }
    else if(this.state == State.USER_SEARCH) {
      this.searchState.updateUserSearching(false);
    }

    if(this.state == State.SEARCH) {
      // @ts-ignore
      this.$refs.keyboard.setInput(this.query);
    }
  }

  focusOnSearch() {
    if(this.state == State.SEARCH) {
      document.getElementById("search-input1").focus();
      
    }
    else if(this.state == State.USER_SEARCH) {
      document.getElementById("search-input2").focus();
    }
  }

  checkWindowSize() {
    this.vertical = window.innerWidth / window.innerHeight >= 1;
  }

  updateSearchFromKeyboard(text) {
    if(this.state == State.SEARCH) {
      this.query = text;
    }
    else if(this.state == State.USER_SEARCH) {
      this.userQuery = text;
    }
  }

  updateSearchFromInput(e) {
    if(this.state == State.SEARCH) {
      this.query = e.target.value;
    }
    else if(this.state == State.USER_SEARCH) {
      this.userQuery = e.target.value;
    }
  }

  clickSearchButton() {
    this.searchState.setSearching(!this.searchState.searching);
  }

  addProduct(product: Product, amount: number) {
    const productIndex = this.rows.findIndex((row) => row.product.id === product.id);
    if (productIndex > -1) {
      this.rows[productIndex].amount += amount;
    } else {
      const price = Dinero({ amount: product.price.getAmount() });
      const row = {
        product,
        amount,
        price: product.price,
      } as SubTransactionRow;
      this.rows.push(row);
    }
  }

  // Filter the products by the desired criteria
  get filteredProducts() {
    if (this.searchState.searching) {
      return new FuzzySearch(
        this.products, 
        ["name", "category.name"], 
        {caseSensitive: false, sort: true}
      ).search(this.query);
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

  get filteredUsers() {
    return new FuzzySearch(
      this.userState.allUsers, 
      ["firstName", "lastName", "gewisID"], 
      {caseSensitive: false, sort: true}
    ).search(this.userQuery).filter((v, i, a) => a.findIndex(l => v.gewisID === l.gewisID) === i);
  }

  userSelected(user: User): void {
    if(user === undefined) {
      this.searchState.clearChargingUser();
    }
    else {
      this.searchState.setChargingUser(user);
    }

    this.searchState.setUserSearching(false);

    if(this.userState.borrelModeOrgan && this.userState.borrelModeOrgan.organName !== undefined) {
      console.log(this.userState.borrelModeOrgan);
      this.showOrganMembers = true;
    }
  }

  orderSelf(): void {
    this.userSelected(undefined);
  }

  organMemberSelected(user: User): void {
    this.showOrganMembers = false;
    // @ts-ignore
    this.$refs.checkoutBar.organMemberSelected(user);
  }

  exitPickMember() {
    this.showOrganMembers = false;
  }
}
</script>

<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/common.scss";
@import "./src/styles/Nav.scss";

@keyframes search-cursor-blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.product-overview {
  flex: 1;
  display: flex;
  flex-direction: row;
  margin: 16px;
  padding: 16px;
  z-index: 2;
  gap: 16px;
  overflow: hidden;
}

.products {
  flex-grow: 1;
  overflow: auto;
  margin: 16px 0;
}

$scroll-bar-width: 40px;

.custom-scrollbar {
  scrollbar-width: $scroll-bar-width;

  &::-webkit-scrollbar {
    width: $scroll-bar-width;
  }
  &::-webkit-scrollbar-thumb {
    border: 1px solid $gewis-red;
    min-height: $scroll-bar-width;
    background: white;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    width: $scroll-bar-width;
    background: $gewis-red;
  }
  /* Buttons */
  &::-webkit-scrollbar-button:single-button {
    background-color: $gewis-red;

    display: block;
    background-size: 20px;
    background-repeat: no-repeat;
  }

  /* Up */
  &::-webkit-scrollbar-button:single-button:vertical:decrement {
    height: 32px;
    width: $scroll-bar-width;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background-position: center 10px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(255, 255, 255)'><polygon points='50,00 0,50 100,50'/></svg>");
  }

  /* Down */
  &::-webkit-scrollbar-button:single-button:vertical:increment {
    height: 32px;
    width: $scroll-bar-width;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    background-position: center 10px;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(255, 255, 255)'><polygon points='0,0 100,0 50,50'/></svg>");
  }
}

.users {
  flex-grow: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
  

  .users-row {
    flex: 1 1 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .user {
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 40px;

    .user-text {
      flex: 1;
      font-size: 20px;
      overflow: hidden;
      word-wrap: break-word;
      line-height: 40px;
    }

    .user-button {
      background: $gewis-red;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      padding: 8px 16px;
      margin-right: 8px;
    }
  }
}

.organ-members {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
  align-content: center;

  .top-bar {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .close-button {
      border-radius: $border-radius;
      background-color: $gewis-red;
      padding: 1rem;
      
      svg {
        fill: white;
        width: 30px;
        height: 30px;
      }
    }

    .title {
      flex: 1;
      font-size: 20px;
      text-align: center;
    }
  }

  .organ-member {
    flex: 1 0 30%;
    padding: 8px 4px;
    font-size: 20px;
    height: 80px;
    max-width: 33%;
    border: 1px solid $gewis-red;
    border-radius: $border-radius;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    span {
      line-height: 30px;
    }
  }
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
  position: relative;

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
      width: 20px;
      height: 20px;
    }
  }
}

.search-text {
  border: 1px solid $gewis-red;
  border-radius: $border-radius;
  flex: 1 1 100px;
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: left;
  cursor: pointer;
  font-size: 20px;
  line-height: 28px;
  padding: 1rem 2rem;

  .text {
    height: 28px;
  }

  .indicator {
    content: "";
    width: 2px;
    height: 20px;
    margin-top: 5px;
    background: $bootstrap-black;
    margin-left: 3px;
    display: inline-block;
    animation: search-cursor-blink 1.5s steps(2) infinite;
  }

  .fa-search {
    margin: 4px 10px 4px 0;
    width: 20px;
    height: 20px;
  }

  #search-input1, #search-input2 {
    width: 0;
    height: 0;
    border: none !important;
    outline: none !important;
    color: rgba(0,0,0,0);
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

.exit-search-button {
  height: 62px;

  .nav-link {
    padding: 1rem !important;
    height: 62px;
  }

  svg {
    width: 30px;
    height: 30px;
    fill: white;
  }
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

@media screen and (max-width: 520px) {
  .search-text {
    padding: .5rem 1rem;
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
