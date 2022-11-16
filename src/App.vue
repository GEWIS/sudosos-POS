<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import SearchModule from '@/store/modules/search';
import UserModule from '@/store/modules/user';
import TransactionModule from '@/store/modules/transaction';

export default class App extends Vue {
  public vertical: boolean = (window.innerWidth / window.innerHeight) >= 1;

  searchState = getModule(SearchModule);

  userState = getModule(UserModule);

  transactionState = getModule(TransactionModule);

  mounted() {
    window.addEventListener('resize', () => {
      this.checkWindowSize();
    });
  }

  checkWindowSize() {
    this.vertical = (window.innerWidth / window.innerHeight) >= 1;
  }

  clickSearchButton() {
    this.searchState.updateSearching(!this.searchState.searching);
  }
}
</script>

<style lang="scss">
@import "@/styles/common.scss";
@import "@/styles/Nav.scss";
</style>
