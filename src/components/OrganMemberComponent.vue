<template>
  <b-row class="members-row pos-card">
    <b-col v-for="user in userState.borrelModeOrgan.organMembers"
      v-bind:key="user.id" lg="2" sm="6" @click="memberSelected(user)">
      <p>{{ user.firstName }} {{ user.lastName }}</p>
    </b-col>
  </b-row>
</template>
<script lang="ts">
import { User } from '@/entities/User';
import UserModule from '@/store/modules/user';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

@Component
export default class OrganMemberComponent extends Vue {
  private userState = getModule(UserModule);

  memberSelected(selectedMember: User) {
    this.$parent.$emit('organMemberSelected', selectedMember);
  }
}
</script>
<style lang="scss" scoped>
  .members-row {
    div {
      background-color: lightgray;
      height: fit-content;
      p {
        text-align: center;
        padding: 1rem 0;
      }
    }
  }
</style>
