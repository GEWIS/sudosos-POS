<template>
  <div class="content-container">
    <div class="content-top">
      <ExitButton @click="$emit('exit')" />
      <SearchBar ref="searchBar" @update="e => updateSearchFromInput(e)" />
      <div class="nav-item active" @click="orderSelf()">
        <div class="nav-link" v-if="!this.pointOfSaleState.pointOfSale.useAuthentication">
          Charge no-one
        </div>
        <div class="nav-link" v-else>
          Charge myself
        </div>
      </div>
    </div>
    <div class="content-center custom-scrollbar">
      <Users :users="filteredUsers" :validQuery="hasValidUserQuery" @selected="userSelected" />
    </div>
    <div class="content-bottom">
      <div class="keyboard-container">
        <Keyboard
          ref="keyboard"
          :onChange="updateSearchFromKeyboard"
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
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import SearchBar from './common/SearchBar.vue';
import Keyboard from './common/Keyboard.vue';
import ExitButton from './common/ExitButton.vue';
import Users from './usersearch/Users.vue';

@Component({
  components: {
    SearchBar,
    Keyboard,
    ExitButton,
    Users,
  },
})
export default class MainContentUserSearch extends Vue {
  private query: string = "";

  private userState = getModule(UserModule);
  private searchState = getModule(SearchModule);
  private pointOfSaleState = getModule(PointOfSaleModule);

  $refs!: {
    searchBar: SearchBar;
  }

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

  get hasValidUserQuery(): boolean {
    return this.query.length >= 3;
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

    this.$emit('userSelected', user);
  }

  orderSelf(): void {
    this.userSelected(undefined);
  }

  updateSearchFromKeyboard(value: string): void {
    this.query = value;
    this.$refs.searchBar.updateQuery(value);
  }

  updateSearchFromInput(value: string): void {
    this.query = value;
  }
}
</script>
<style lang="scss" scoped>
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/common.scss";
@import "./src/styles/Nav.scss";

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