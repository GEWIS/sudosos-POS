<template>
  <div class="wrapper">
    <div v-if="this.userState.user !== undefined && this.userState.user.id !== undefined">
      <t-o-s-not-required :initially-open="this.userState.user.acceptedToS === 'NOT_REQUIRED'"
        :logged-out="this.logout"/>
    </div>
    <b-modal
      id="modal-transaction-failed"
      title="Saving transaction failed"
      ok-only>
      Saving the transaction failed. Please try again,
      with or without restarting the SudoSOS POS and logging in again.
    </b-modal>
    <div class="product-overview">
      <div class="product-overview-container shadow">
        <div class="product-overview-top" v-if="state === State.CATEGORIES">
          <CategorieButtons :categories="pointOfSaleState.categories" />
          <BackendStatus />
        </div>
        <div v-if="state === State.SEARCH"
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
            :searching="state === State.SEARCH" />
        </main>
        <div
          class="keyboard-container"
          v-show="state === State.SEARCH"
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
          <ActivityTimer ref="activityTimer" v-if="this.shouldTrackActivity" :checkingOut="checkingOut" @timeout="logout" />
        </div>
        <MainContentUserSearch v-if="state === State.USER_SEARCH" @exit="exitSearch" @userSelected="userSelected" />
        <MainContentMembers v-if="state === State.ORGAN_MEMBER_SELECT" @exit="exitPickMember" @selected="organMemberSelected" />
      </div>
      <CheckoutBar ref="checkoutBar" :openUserSearch="openUserSearch"
        :openPickMember="openPickMember" :logoutFunc="logout"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { Product, ProductInContainer } from '@/entities/Product';
import Settings from '@/components/maincontent/products/Settings.vue';
import CategorieButtons from '@/components/maincontent/products/CategorieButtons.vue';
import CheckoutBar from '@/components/checkoutbar/CheckoutBar.vue';
import SearchModule from '@/store/modules/search';
import ExitButton from '@/components/maincontent/common/ExitButton.vue';
import SearchBar from '@/components/maincontent/common/SearchBar.vue';
import Products from '@/components/maincontent/common/Products.vue';
import Users from '@/components/maincontent/usersearch/Users.vue';
import ActivityTimer from '@/components/maincontent/products/ActivityTimer.vue';
import SearchBarButton from '@/components/maincontent/products/SearchBarButton.vue';
import MainContentMembers from '@/components/maincontent/MainContentMembers.vue';
import MainContentUserSearch from '@/components/maincontent/MainContentUserSearch.vue';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import CartModule from '@/store/modules/cart';
import Fuse from 'fuse.js';
import Keyboard from '@/components/maincontent/common/Keyboard.vue';
import 'simple-keyboard/build/css/index.css';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import { Container } from '@/entities/Container';
import TOSNotRequired from '@/components/TOSNotRequired.vue';
import BackendStatus from '@/components/maincontent/products/BackendStatus.vue';

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
    SearchBarButton,
    MainContentMembers,
    MainContentUserSearch,
  },
})
export default class ProductOverview extends Vue {
  private searchState = getModule(SearchModule);

  private userState = getModule(UserModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

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

  userSelected(user: User): void {
    if (this.organMemberRequired()) {
      this.showOrganMembers = true;
    }
  }

  organMemberRequired() {
    // @ts-ignore
    return this.$refs.checkoutBar.$refs.checkoutButton.isBorrelModeCheckout()
      && !this.pointOfSaleState.pointOfSale.useAuthentication;
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
  height: 60px;
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
