<template>
  <div class="container">
    <div v-if="!validQuery">
      <p>Start typing to search for someone...</p>
    </div>
    <div v-else-if="users.length === 0">
      <p>No users were found for your query</p>
    </div>
    <div v-else class="content">
      <User v-for="user in users" :user="user" :key="`${user.id}`" @selected="$emit('selected', user)" />
    </div>
  </div>
</template>
<script lang="ts">
import {Vue, Prop,Component} from 'vue-property-decorator'
import UserComponent from '@/components/maincontent/usersearch/User.vue'
import {User} from '@/entities/User'

@Component({
  components: {
    User: UserComponent,
  },
})
export default class Users extends Vue {
  @Prop() users!: User[];
  @Prop() validQuery!: boolean;
}
</script>
<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/Nav.scss";

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
}

.content {
  flex: 1 1 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>