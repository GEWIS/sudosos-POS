<template>
  <div class="content-container">
    <div class="content-top">
      <ExitButton @click="$emit('exit')" />
      <SearchBar ref="searchBar" @update="value => updateSearchFromInput(value)" />
      <div class="nav-item active" @click="() => orderSelf()">
        <div class="nav-link" v-if="!pointOfSale.useAuthentication">
          Charge no-one
        </div>
        <div class="nav-link" v-else>
          Charge myself
        </div>
      </div>
    </div>
    <div class="content-center">
      <Scrollable>
        <Users :users="filteredUsers" :validQuery="hasValidUserQuery" @selected="user => userSelected(user)" />
      </Scrollable>
    </div>
    <div class="content-bottom">
      <div class="keyboard-container">
        <Keyboard
          ref="keyboard"
          @change="input => updateSearchFromKeyboard(input)"
          :allowNumbers="true" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { User } from '@/entities/User';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import SearchModule from '@/store/modules/search';
import UserModule from '@/store/modules/user';
import Fuse from 'fuse.js';
import { 
  Component, Vue 
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import SearchBar from '@/components/maincontent/common/SearchBar.vue';
import Keyboard from '@/components/maincontent/common/Keyboard.vue';
import ExitButton from '@/components/maincontent/common/ExitButton.vue';
import Users from '@/components/maincontent/usersearch/Users.vue';
import Scrollable from '@/components/maincontent/common/Scrollable.vue';

/**
 * Component for the main content containing an overview of the users that
 * fulfill the search query.
 */
@Component({
  components: {
    SearchBar,
    Keyboard,
    ExitButton,
    Users,
    Scrollable,
  },
})
export default class MainContentUserSearch extends Vue {
  /**
   * The current search query.
   */
  private query: string = "";

  private userState = getModule(UserModule);
  private searchState = getModule(SearchModule);
  private pointOfSaleState = getModule(PointOfSaleModule);

  $refs!: {
    searchBar: SearchBar;
  }

  /**
   * The point of sale.
   */
  get pointOfSale() {
    return this.pointOfSaleState.pointOfSale;
  }

  /**
   * The users that fulfill the search query. It uses Fuse to search the users
   * by name and gewisID. Then it will filter out the duplicates and sort the
   * users by whether they have accepted the terms of service. It will also only
   * show the first 50 results.
   */
  get filteredUsers(): User[] {
    if (this.query.length < 3) return [];
    return new Fuse(
      this.userState.allUsers,
      {
        keys: ['nameWithoutAccents', 'gewisID'],
        isCaseSensitive: false,
        shouldSort: true,
        threshold: 0.2,
      },
    ).search(this.query)
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

  /**
   * Whether the search query is valid. It is valid if it is at least 3
   * characters long.
   */
  get hasValidUserQuery(): boolean {
    return this.query.length >= 3;
  }

  /**
   * Called when a user is selected. It will update the charging user and fetch
   * the transaction history. If no user is selected, it will charge the user
   * that is logged in. If a selected user does not accept the terms of service,
   * it will not charge that user. Lastly, it will emit the userSelected event.
   * @param {User} user The selected user.
   */
  userSelected(user: User): void {
    if (user === undefined) {
      this.searchState.removeChargingUser();
    } else {
      if (user.acceptedToS === 'NOT_ACCEPTED') return;
      this.searchState.updateChargingUser(user);
    }

    this.searchState.setUserSearching(false);
    this.searchState.fetchTransactionHistory();

    this.$emit('userSelected', user);
  }

  /**
   * Called when the user wants to charge himself. It will call the userSelected
   * method with undefined as the user.
   */
  orderSelf(): void {
    this.userSelected(undefined);
  }

  /**
   * Called when the keyboard is used to update the search query. It will update
   * the query and update the search bar.
   * @param {string} value The new search query.
   */
  updateSearchFromKeyboard(value: string): void {
    this.query = value;
    this.$refs.searchBar.updateQuery(value);
  }

  /**
   * Called when the search bar is used to update the search query. It will
   * update the query and update the keyboard.
   * @param {string} value The new search query.
   */
  updateSearchFromInput(value: string): void {
    this.query = value;
  }
}
</script>
<style lang="scss" scoped>
.content-bottom {
  justify-content: center;
}

.keyboard-container {
  flex: 0 1 720px;
}

.wrap {
  width: 100%;
  overflow-y: scroll;
}

</style>