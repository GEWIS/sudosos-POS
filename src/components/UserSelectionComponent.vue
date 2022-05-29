<template>
  <div class="user-selection-component">
    <div class="selection-list">
      <p v-for="user in filteredUsers" :key="user.id" @click="userClicked(user)">
        {{ user.firstName }} {{ user.lastName }} - {{ user.gewisID }}
      </p>
    </div>
    <searchbar-with-keyboard :input.sync="searchedName" :showSearchbar="true"/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import SearchbarWithKeyboard from '@/components/SearchbarWithKeyboard.vue';
import UserModule from '@/store/modules/user';
import SearchModule from '@/store/modules/search';
import { User } from '@/entities/User';

@Component({
  components: {
    SearchbarWithKeyboard,
  },
})
export default class UserSelectionComponent extends Vue {
  private userState = getModule(UserModule);

  private searchState = getModule(SearchModule);

  searchedName: string = '';

  get filteredUsers() {
    return this.userState.allUsers.filter((user) => {
      const fullname = (`${user.firstName}${user.lastName}${user.gewisID}`).toLowerCase();
      return fullname.includes(this.searchedName.toLowerCase());
    });
  }

  userClicked(user: User): void {
    this.searchState.setChargingUser(user);
    this.searchState.setUserSearching(false);
    this.$parent.$emit('userSelected');
  }
}
</script>
<style lang="scss" scoped>
  .user-selection-component {
    position: absolute;
    width: 80%;
    left: 10%;
    top: 0;
    background-color: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 20px;
    height: 100%;
    z-index: 5;
    p {
      font-size: 2rem;
    }
  }
</style>
<style lang="scss">
  .user-selection-component {
    .searchbar-container {
      width: 70%;
      left: 15%;
    }
  }
</style>
