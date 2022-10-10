<template>
  <div class="wrapper">
    <div v-if="this.userState.user !== undefined && this.userState.user.id !== undefined">
      <t-o-s-not-required :initially-open="this.userState.user.acceptedToS === 'NOT_REQUIRED'"
        :logged-out="this.loggedOut"/>
    </div>
    <b-modal
      id="modal-transaction-failed"
      title="Saving transaction failed"
      ok-only
    >
      Saving the transaction failed. Please try again,
      with or without restarting the SudoSOS POS and logging in again.
    </b-modal>
    <div class="product-overview">
      <div class="product-overview-container shadow">
        <div class="product-overview-top" v-if="state === State.CATEGORIES">
          <CategorieButtons :categories="pointOfSaleState.categories" />
          <BackendStatus />
        </div>
        <div v-if="state === State.SEARCH || state === State.USER_SEARCH"
          class="nav align-items-center">
          <ExitButton @click="exitSearch()" />
          <SearchBar ref="searchBar" @update="e => updateSearchFromInput(e)" />
          <div class="nav-item active" v-if="state === State.USER_SEARCH" @click="orderSelf()">
            <div class="nav-link" v-if="!this.pointOfSaleState.pointOfSale.useAuthentication">
              Charge no-one
            </div>
            <div class="nav-link" v-else>
              Charge myself
            </div>
          </div>
        </div>
        <main class="products custom-scrollbar"
          v-if="state === State.CATEGORIES || state === State.SEARCH">
          <Products
            :products="filteredProducts"
            :searching="state === State.SEARCH" 
            @selected="item => addProduct(item, 1)" />
        </main>
        <div class="users custom-scrollbar" v-if="state === State.USER_SEARCH">
          <Users :users="filteredUsers" :validQuery="hasValidUserQuery" @selected="userSelected" />
        </div>
        <div
          class="keyboard-container"
          v-show="state === State.SEARCH || state === State.USER_SEARCH"
        >
          <Keyboard
            ref="keyboard"
            :onChange="updateSearchFromKeyboard"
            :allowNumbers="state === State.USER_SEARCH"
          />
        </div>
        <div class="bottom-bar" v-if="state === State.CATEGORIES">
          <Settings :force-update-store="updateStore" />
          <SearchBarButton @clicked="openProductSearch" /> 
          <ActivityTimer ref="activityTimer" v-if="this.shouldTrackActivity" :checkingOut="checkingOut" />
        </div>
        <div class="organ-members" v-if="state === State.ORGAN_MEMBER_SELECT">
          <div class="top-bar">
            <div class="close-button" @click="exitPickMember()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
            </div>
            <div class="title">
              Select a member of {{pointOfSaleState.pointOfSale.owner.name}} to charge as:
            </div>
          </div>
          <div class="organ-member" v-for="user in pointOfSaleState.pointOfSaleOwners"
            v-bind:key="user.id" @click="organMemberSelected(user)">
            <span>{{ user.firstName }} {{ user.lastName }}</span>
          </div>
        </div>
      </div>
      <CheckoutBar ref="checkoutBar" :subTransactionRows="rows" :openUserSearch="openUserSearch"
        :openPickMember="openPickMember" :updateRows="updateRows" :logoutFunc="logout"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator';
import Dinero from 'dinero.js';
import { getModule } from 'vuex-module-decorators';
import { Product, ProductInContainer } from '@/entities/Product';
import Settings from '@/components/Settings.vue';
import CategorieButtons from '@/components/CategorieButtons.vue';
import CheckoutBar from '@/components/CheckoutBar.vue';
import SearchModule from '@/store/modules/search';
import ExitButton from '@/components/ExitButton.vue';
import SearchBar from '@/components/SearchBar.vue';
import Products from '@/components/Products.vue';
import Users from '@/components/Users.vue';
import ActivityTimer from '@/components/ActivityTimer.vue';
import SearchBarButton from '@/components/SearchBarButton.vue';

import { SubTransactionRow } from '@/entities/SubTransactionRow';
import { User, UserType } from '@/entities/User';
import UserModule from '@/store/modules/user';

import Fuse from 'fuse.js';
import Keyboard from '@/components/Keyboard.vue';
import 'simple-keyboard/build/css/index.css';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import { Container } from '@/entities/Container';
import TOSNotRequired from '@/components/TOSNotRequired.vue';
import BackendStatus from '@/components/BackendStatus.vue';

enum State {
  CATEGORIES,
  SEARCH,
  USER_SEARCH,
  ORGAN_MEMBER_SELECT,
}

@Component({
  components: {
    BackendStatus,
    TOSNotRequired,
    CategorieButtons,
    CheckoutBar,
    Settings,
    Keyboard,
    ExitButton,
    SearchBar,
    Products,
    Users,
    ActivityTimer,
  },
})
export default class ProductOverview extends Vue {
  private searchState = getModule(SearchModule);

  private userState = getModule(UserModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

  public rows: SubTransactionRow[] = [];

  public vertical: boolean = window.innerWidth / window.innerHeight >= 1;

  public showSettings: boolean = false;

  public showOrganMembers: boolean = false;

  public checkingOut: boolean = false;

  State: any = State;

  private autoRefresh;

  private userQuery: string = '';

  private query: string = '';

  $refs!: {
    searchBar: SearchBar
    checkoutBar: CheckoutBar
    keyboard: Keyboard
    activityTimer: ActivityTimer
  }

  async mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });

    // @ts-ignore
    this.$refs.checkoutBar.$refs.checkoutButton.$watch('checkingOut', (value) => {
      this.checkingOut = value;

      if (value) {
        this.$refs.activityTimer.clearTimeouts();
      } else {
        this.$refs.activityTimer.userActivity();
      }
    });

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this.autoRefresh = setInterval(this.updateStore.bind(this), 10 * 60 * 1000);
  }

  get products(): ProductInContainer[] {
    const products: ProductInContainer[] = [];
    if (this.pointOfSaleState.pointOfSale.containers) {
      this.pointOfSaleState.pointOfSale.containers.forEach((con) => {
        const containerId = con.id;
        (con as any as Container).products.forEach((prod: ProductInContainer) => {
          prod.containerId = containerId;
          products.push(prod);
        });
      });
    }
    return products;
  }

  get shouldTrackActivity(): boolean {
    return this.pointOfSaleState.pointOfSale.useAuthentication;
  }

  updateStore() {
    this.userState.fetchAllUsers(true);
    this.pointOfSaleState.refreshPointOfSale();
  }

  logout() {
    clearInterval(this.autoRefresh);
    this.userState.reset();
    this.searchState.reset();
    this.$refs.activityTimer.clearTimeouts();
    this.$router.push('/');
  }

  get state() {
    if (this.showOrganMembers) {
      return State.ORGAN_MEMBER_SELECT;
    }
    if (this.searchState.userSearching) {
      return State.USER_SEARCH;
    }
    if (this.searchState.searching) {
      return State.SEARCH;
    }

    return State.CATEGORIES;
  }

  updateRows(rows: SubTransactionRow[]) {
    this.rows = rows;
  }

  openProductSearch() {
    this.searchState.updateSearching(true);
    // @ts-ignore
    this.$refs.keyboard.setInput('');
  }

  openUserSearch() {
    this.searchState.updateUserSearching(true);
    // @ts-ignore
    this.$refs.keyboard.setInput('');
  }

  exitSearch() {
    if (this.state === State.SEARCH) {
      this.searchState.updateSearching(false);
    } else if (this.state === State.USER_SEARCH) {
      this.searchState.updateUserSearching(false);

      this.exitBorrelModeCheckout();
    }

    if (this.state === State.SEARCH) {
      // @ts-ignore
      this.$refs.keyboard.setInput(this.query);
    }
  }

  exitBorrelModeCheckout() {
    if (this.pointOfSaleState.pointOfSale.useAuthentication) {
      return;
    }

    // TODO: Improve how this is routed
    // @ts-ignore
    this.$refs.checkoutBar.$refs.checkoutButton.clearBorrelModeCheckout();
  }

  focusOnSearch() {
    if (this.state === State.SEARCH) {
      document.getElementById('search-input1').focus();
    } else if (this.state === State.USER_SEARCH) {
      document.getElementById('search-input2').focus();
    }
  }

  checkWindowSize() {
    this.vertical = window.innerWidth / window.innerHeight >= 1;
  }

  updateSearchFromKeyboard(value) {
    if (this.state === State.SEARCH) {
      this.query = value;
    } else if (this.state === State.USER_SEARCH) {
      this.userQuery = value;
    }

    this.$refs.searchBar.updateQuery.bind(this.$refs.searchBar)(value);
  }

  updateSearchFromInput(value) {
    if (this.state === State.SEARCH) {
      this.query = value;
    } else if (this.state === State.USER_SEARCH) {
      this.userQuery = value;
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
      const price = Dinero({ amount: product.priceInclVat.getAmount() });
      const row = {
        product,
        amount,
        priceInclVat: product.priceInclVat,
      } as SubTransactionRow;
      this.rows.push(row);
    }
  }

  // Filter the products by the desired criteria
  get filteredProducts(): ProductInContainer[] {
    const { products } = this;
    if (this.searchState.searching) {
      return new Fuse(
        products,
        {
          keys: ['nameWithoutAccents', 'category.name'],
          isCaseSensitive: false,
          shouldSort: true,
          threshold: 0.2,
        },
      ).search(this.query).map((r) => r.item);
    }

    const sortFn = (a: Product, b: Product) => {
      if (a.name[0] === '_' && b.name[0] !== '_') return -1;
      if (a.name[0] !== '_' && b.name[0] === '_') return 1;
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    };

    // @ts-ignore
    const currentCategory = this.searchState.filterCategory;
    if (currentCategory === 0) {
      return products.sort(sortFn);
    }
    return products.filter(
      (product: Product) => product.category.id === currentCategory,
    ).sort(sortFn);
  }

  get hasValidUserQuery(): boolean {
    return this.userQuery.length >= 3;
  }

  get filteredUsers() {
    if (this.userQuery.length < 3) return [];
    return new Fuse(
      this.userState.allUsers,
      {
        keys: ['nameWithoutAccents', 'gewisID'],
        isCaseSensitive: false,
        shouldSort: true,
        threshold: 0.2,
      },
    ).search(this.userQuery)
      .map((r) => r.item)
      .filter((item, index, self) => self.findIndex((u) => u.id === item.id) === index)
      .sort((a, b) => {
        if (a.acceptedToS === 'NOT_ACCEPTED' && b.acceptedToS !== 'NOT_ACCEPTED') {
          return 1;
        }
        if (a.acceptedToS !== 'NOT_ACCEPTED' && b.acceptedToS === 'NOT_ACCEPTED') {
          return -1;
        }
        return 0;
      })
      .slice(0, 50);
  }

  userSelected(user: User): void {
    if (user === undefined) {
      this.searchState.removeChargingUser();
    } else {
      if (user.acceptedToS === 'NOT_ACCEPTED') return;
      this.searchState.updateChargingUser(user);
    }

    this.searchState.setUserSearching(false);
    this.searchState.fetchTransactionHistory();

    if (this.organMemberRequired()) {
      this.showOrganMembers = true;
    }
  }

  organMemberRequired() {
    // @ts-ignore
    return this.$refs.checkoutBar.$refs.checkoutButton.isBorrelModeCheckout()
      && !this.pointOfSaleState.pointOfSale.useAuthentication;
  }

  orderSelf(): void {
    this.userSelected(undefined);
  }

  organMemberSelected(user: User): void {
    this.showOrganMembers = false;
    this.userQuery = '';
    // @ts-ignore
    this.$refs.checkoutBar.organMemberSelected(user);
  }

  openPickMember() {
    this.showOrganMembers = true;
  }

  exitPickMember() {
    this.showOrganMembers = false;
    this.exitBorrelModeCheckout();
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
  padding: 32px;
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

    .tos-not-accepted {
      color: lightgray;
    }

    .user-button {
      background: $gewis-red;
      color: white;
      border-radius: 5px;
      cursor: pointer;
      padding: 8px 16px;
      margin-right: 8px;

      &.hidden {
        visibility: hidden;
      }
    }

    .user-icon {
      display:flex;
      justify-content:center;
      align-items:center;

      * {
        margin-right: 8px;
      }

      &.disabled {
        color: lightgrey;
      }
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

.product-overview-top {
  display: flex;

  div {
    flex: 1;
  }
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

  .activity-timeout {
    align-self: center;
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

.keyboard-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;

  .keyboard {
    flex: 0 1 720px;
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
    padding: 16px !important;
    height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
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
