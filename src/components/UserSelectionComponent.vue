<template>
  <div class="user-selection-component">
    <div class="selection-list">
      <p v-for="user in users" :key="user.id" @click="userClicked(user)">
        {{ user.name }}
      </p>
    </div>
    <searchbar-with-keyboard :input.sync="searchedName" :showSearchbar="true"/>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SearchbarWithKeyboard from '@/components/SearchbarWithKeyboard.vue';
import { User, UserType } from '@/entities/User';

@Component({
  components: {
    SearchbarWithKeyboard,
  },
})
export default class UserSelectionComponent extends Vue {
  private rickWouters: User = {
    id: 1,
    gewisID: 7987,
    name: 'Rick Wouters',
    active: true,
    saldo: 4646,
    type: UserType.MEMBER,
  };

  private marcinsVriendinnetje: User = {
    id: 2,
    gewisID: 2005,
    name: 'Marcin\'s vriendinnetje',
    active: true,
    saldo: -18,
    type: UserType.MEMBER,
  };

  private wietskeBlijjenberg: User = {
    id: 3,
    gewisID: 8096,
    name: 'Wietske Blijjenberg',
    active: true,
    saldo: 4000,
    type: UserType.MEMBER,
  };

  searchedName: string = '';

  selectedUser: User|null = null;

  users: User[] = [this.rickWouters, this.marcinsVriendinnetje, this.wietskeBlijjenberg];

  get filteredUser() {
    return this.users.filter(user => user
      .name.toLowerCase().includes(this.searchedName.toLowerCase()));
  }

  userClicked(user: User) {
    this.$store.commit('searchState/setChargingUser', user);
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
