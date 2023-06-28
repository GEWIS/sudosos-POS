<template>
  <div class="home-wrapper">
    <div v-if="user !== undefined && user.id !== undefined">
      <TOSNotRequired :initially-open="user.acceptedToS === 'NOT_REQUIRED'"
        :logged-out="logout"/>
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
        <MainContentCategories
          v-if="state === State.CATEGORIES"
          @forceUpdateStore="updateStore"
          @logout="logout"
          @openProductSearch="openProductSearch"/>
        <MainContentSearch
          v-if="state === State.SEARCH"
          @exit="exitProductSearch" />
        <MainContentUserSearch
          v-if="state === State.USER_SEARCH"
          @exit="exitUserSearch"
          @userSelected="userSelected" />
        <MainContentMembers
          v-if="state === State.ORGAN_MEMBER_SELECT"
          @exit="exitPickMember"
          @selected="organMemberSelected" />
      </div>
      <CheckoutBar
        ref="checkoutBar"
        @openUserSearch="openUserSearch"
        :openPickMember="openPickMember"
        @logout="logout"/>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
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
import TOSNotRequired from '@/components/TOSNotRequired.vue';
import ActivityTimerModule from '@/store/modules/activity-timer';

/**
 * The different states the home page can be in.
 */
enum State {
  CATEGORIES,
  SEARCH,
  USER_SEARCH,
  ORGAN_MEMBER_SELECT,
}

/**
 * The home page. This page contains all the main parts of the POS.
 */
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

  /**
   * Whether the organ members should be shown.
   */
  public showOrganMembers: boolean = false;

  /**
   * Gives the template access to the state enum.
   */
  State = State;

  /**
   * The handle for the auto refresh interval.
   */
  private autoRefresh: number;

  $refs!: {
    checkoutBar: CheckoutBar
  }

  /**
   * Called when the component is mounted. It will 1) add a listener that checks
   * the windows size when it is resized,
   * 2) watch if the user is checking out, 3) watch if the user is timed out, 4)
   *    add a listener that prevents the user from right clicking, 5) start the
   *    auto refresh interval, and 6) start the activity timer.
   */
  async mounted() {
    this.$watch('checkingOut', (value) => {
      if (value) {
        this.activityTimerState.stop();
      } else {
        this.activityTimerState.userActivity();
      }
    });

    this.$watch('timedOut', (value) => {
      if (value && !this.checkingOut && this.pointOfSaleState.pointOfSale.useAuthentication) {
        if (!this.cartState.isEmpty) {
          this.$refs.checkoutBar.$refs.checkoutButton.checkout();
        } else {
          this.logout();
          this.activityTimerState.setTimedOut(false);
        }
      }
    });

    document.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    this.autoRefresh = setInterval(() => this.updateStore(), 10 * 60 * 1000) as unknown as number;

    this.activityTimerState.start();
  }

  /**
   * The user that is currently logged in.
   */
  get user() {
    return this.userState.user;
  }

  /**
   * If the user is currently checking out.
   */
  get checkingOut() {
    return this.cartState.checkingOut;
  }

  /**
   * If the user is timed out.
   */
  get timedOut() {
    return this.activityTimerState.timedOut;
  }

  /**
   * Log the user out. This will reset all the states and push the user to '/'.
   */
  logout() {
    clearInterval(this.autoRefresh);
    this.userState.reset();
    this.searchState.reset();
    this.cartState.reset();
    this.activityTimerState.stop();
    this.$router.push('/');
  }

  /**
   * Get the current state of the home page.
   */
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

  /**
   * Open the product search by uodatung the search state.
   */
  openProductSearch() {
    this.searchState.updateSearching(true);
  }

  /**
   * Open the user search by updating the search state.
   */
  openUserSearch() {
    this.searchState.updateUserSearching(true);
  }

  /**
   * Exit either the product search.
   */
  exitProductSearch() {
    this.searchState.updateSearching(false);
  }

  /**
   * Exit the user search.
   */
  exitUserSearch() {
    this.searchState.updateUserSearching(false);

    this.exitBorrelModeCheckout();
  }

  /**
   * Exit the borrel mode checkout. This is only done if the user is not
   * authenticated, meaning it is in borrel mode.
   */
  exitBorrelModeCheckout() {
    // if (this.pointOfSaleState.pointOfSale.useAuthentication) {

    // }

    // TODO: Improve how this is routed
    // this.$refs.checkoutBar.$refs.checkoutButton.clearBorrelModeCheckout();
  }

  /**
   * Update the user store with the latest users and the point of sale with the
   * latest point of sale data. This is done asynchroniously and on a 10 minute
   * interval.
   */
  async updateStore() {
    await this.userState.fetchAllUsers(true);
    this.pointOfSaleState.refreshPointOfSale();
  }

  /**
   * This method is called if in the user search screen a user has been
   * selected. If a organ member is required to complete the checkout, the organ
   * member selection screen will be shown.
   * @param {User} user The user that has been selected.
   */
  userSelected(user: User): void {
    if (this.organMemberRequired()) {
      this.showOrganMembers = true;
    }
  }

  /**
   * Check if an organ member is required to complete the checkout.
   */
  organMemberRequired() {
    return !this.pointOfSaleState.pointOfSale.useAuthentication;
  }

  /**
   * This method is called if in the organ member selection screen a user has
   * been selected. The organ member selection screen will be hidden and the
   * checkout bar will be notified of the organ member selection.
   */
  organMemberSelected(user: User): void {
    this.showOrganMembers = false;
    this.$refs.checkoutBar.organMemberSelected(user);
  }

  /**
   * Open the organ member selection screen.
   */
  openPickMember() {
    this.showOrganMembers = true;
  }

  /**
   * Exit the organ member selection screen.
   */
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
