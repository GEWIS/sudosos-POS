<template>
  <div class="home-wrapper">
    <div v-if="this.userState.user !== undefined && this.userState.user.id !== undefined">
      <TOSNotRequired :initially-open="this.userState.user.acceptedToS === 'NOT_REQUIRED'"
        :logged-out="this.logout"/>
    </div>
    <b-modal
      id="modal-transaction-failed"
      title="Saving transaction failed"
      ok-only>
      Saving the transaction failed. Please try again,
      with or without restarting the SudoSOS POS and logging in again.
    </b-modal>
    <div class="home">
      <div class="main-content-container box">
        <MainContentCategories v-if="state === State.CATEGORIES" @forceUpdateStore="updateStore" @logout="logout" @openProductSearch="openProductSearch"/>
        <MainContentSearch v-if="state === State.SEARCH" @exit="exitSearch" />
        <MainContentUserSearch v-if="state === State.USER_SEARCH" @exit="exitSearch" @userSelected="userSelected" />
        <MainContentMembers v-if="state === State.ORGAN_MEMBER_SELECT" @exit="exitPickMember" @selected="organMemberSelected" />
      </div>
      <CheckoutBar ref="checkoutBar" @openUserSearch="openUserSearch" :openPickMember="openPickMember" @logout="logout"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { ProductInContainer } from '@/entities/Product';
import CheckoutBar from '@/components/checkoutbar/CheckoutBar.vue';
import SearchModule from '@/store/modules/search';
import CartModule from '@/store/modules/cart';
import MainContentMembers from '@/components/maincontent/MainContentMembers.vue';
import MainContentUserSearch from '@/components/maincontent/MainContentUserSearch.vue';
import MainContentSearch from '@/components/maincontent/MainContentSearch.vue';
import MainContentCategories from '@/components/maincontent/MainContentCategories.vue';
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import 'simple-keyboard/build/css/index.css';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import { Container } from '@/entities/Container';
import TOSNotRequired from '@/components/TOSNotRequired.vue';
import ActivityTimerModule from '@/store/modules/activity-timer';

enum State {
  CATEGORIES,
  SEARCH,
  USER_SEARCH,
  ORGAN_MEMBER_SELECT,
}

@Component({
  components: {
    TOSNotRequired,
    CheckoutBar,
    MainContentMembers,
    MainContentUserSearch,
    MainContentSearch,
    MainContentCategories,
  },
})
export default class Home extends Vue {
  private searchState = getModule(SearchModule);

  private userState = getModule(UserModule);

  private pointOfSaleState = getModule(PointOfSaleModule);

  private activityTimerState = getModule(ActivityTimerModule);

  private cartState = getModule(CartModule);

  public vertical: boolean = window.innerWidth / window.innerHeight >= 1;

  public showSettings: boolean = false;

  public showOrganMembers: boolean = false;

  State: any = State;

  private autoRefresh;

  $refs!: {
    checkoutBar: CheckoutBar
  }

  async mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });

    this.$watch('checkingOut', (value) => {
      if (value) {
        this.activityTimerState.stop();
      } else {
        this.activityTimerState.userActivity();
      }
    });

    this.$watch('timedOut', (value) => {
      if (value) {
        this.logout();
      }
    });

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this.autoRefresh = setInterval(this.updateStore.bind(this), 10 * 60 * 1000);

    this.activityTimerState.start();
  }

  get checkingOut() {
    return this.cartState.checkingOut;
  }

  get timedOut() {
    return this.activityTimerState.timedOut;
  }

  logout() {
    clearInterval(this.autoRefresh);
    this.userState.reset();
    this.searchState.reset();
    this.activityTimerState.stop();
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
  }

  openUserSearch() {
    this.searchState.updateUserSearching(true);
  }

  exitSearch() {
    if (this.state === State.SEARCH) {
      this.searchState.updateSearching(false);
    } else if (this.state === State.USER_SEARCH) {
      this.searchState.updateUserSearching(false);

      this.exitBorrelModeCheckout();
    }
  }

  exitBorrelModeCheckout() {
    if (this.pointOfSaleState.pointOfSale.useAuthentication) {
      return;
    }

    // TODO: Improve how this is routed
    this.$refs.checkoutBar.$refs.checkoutButton.clearBorrelModeCheckout();
  }

  updateStore() {
    this.userState.fetchAllUsers(true);
    this.pointOfSaleState.refreshPointOfSale();
  }

  checkWindowSize() {
    this.vertical = window.innerWidth / window.innerHeight >= 1;
  }

  clickSearchButton() {
    this.searchState.setSearching(!this.searchState.searching);
  }

  userSelected(user: User): void {
    if (this.organMemberRequired()) {
      this.showOrganMembers = true;
    }
  }

  organMemberRequired() {
    return this.$refs.checkoutBar.$refs.checkoutButton.isBorrelModeCheckout()
      && !this.pointOfSaleState.pointOfSale.useAuthentication;
  }

  organMemberSelected(user: User): void {
    this.showOrganMembers = false;
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
@keyframes search-cursor-blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.home-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 2;
}

.home {
  flex: 1;
  display: flex;
  flex-direction: row;
  padding: 32px;
  z-index: 2;
  gap: 16px;
  overflow: hidden;
}

.main-content-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

@media screen and (max-width: 950px) {
  .home {
    margin: 0;
    border-radius: 0;
  }
}

@media screen and (max-width: 820px) {
  .home {
    flex-direction: column;
    padding: 8px;
  }

  .main-content-container {
    border-bottom: 1px solid $bootstrap-black;
    margin-bottom: 8px;
  }
}
</style>
