<template>
  <div class="user">
    test123
    <!--<div
    class="user-button"
    :class="{ hidden: item.acceptedToS === 'NOT_ACCEPTED' }">
        Select
    </div>
    <div class="user-icon"
        v-bind:class="(item.acceptedToS === 'NOT_ACCEPTED') ? 'disabled' : ''">
        <font-awesome-icon icon="exclamation-triangle"
                        size="lg" v-if="item.acceptedToS === 'NOT_ACCEPTED'"/>
        <font-awesome-icon icon="baby"
                        size="lg" v-if="!item.ofAge && userIsPerson(item)"/>
    </div>
    <div class="user-text"
        v-bind:class="(item.acceptedToS === 'NOT_ACCEPTED') ? 'tos-not-accepted' : ''"
    >
        {{item.firstName}} {{item.lastName}} - {{item.gewisID}}
    </div>-->
  </div>
</template>
<script lang="ts">
import {Vue, Prop} from 'vue-property-decorator'
import { User, UserType } from '@/entities/User';

export default class UserComponent extends Vue {
  //@Prop() user!: User;
  
  // eslint-disable-next-line class-methods-use-this
  isPerson(): boolean {
    return true;
    //return [UserType.MEMBER, UserType.LOCAL_USER, UserType.LOCAL_ADMIN].includes(this.user.type);
  }
}
</script>
<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/Nav.scss";

.user {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 40px;

  .user-text {
    flex: 1;
    font-size: 20px;
    overflow: hidden;
    word-wrap: break-word;
    line-height: 40px;
  }

  .tos-not-accepted {
    color: lightgray;
  }

  .user-button {
    background: $gewis-red;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    padding: 8px 16px;
    margin-right: 8px;

    &.hidden {
      visibility: hidden;
    }
  }

  .user-icon {
    display:flex;
    justify-content:center;
    align-items:center;

    * {
      margin-right: 8px;
    }

    &.disabled {
      color: lightgrey;
    }
  }
}
</style>