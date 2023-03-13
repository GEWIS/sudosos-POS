<template>
  <div class="activity-timeout" v-if="!isCheckingOut">
    Automatically logging out in {{timeoutTime}} seconds.
  </div>
  <div class="activity-timeout" v-else>
    No automatic logout during checkout.
  </div>
</template>
<script lang="ts">
import {
  Vue, Component, Prop,
} from 'vue-property-decorator';
import ActivityTimerModule from '@/store/modules/activity-timer';
import CartModule from '@/store/modules/cart';
import { getModule } from 'vuex-module-decorators';

/**
 * Component that handles the activity timer.
 */
@Component
export default class AcivityTimer extends Vue {
  private activityTimerState = getModule(ActivityTimerModule);

  private cartState = getModule(CartModule);

  /**
   * If the user is currently checking out.
   */
  get isCheckingOut() {
    return this.cartState.checkingOut;
  }

  /**
   * The number of seconds that are still left on the timer. When this number
   * reaches 0, the user will be logged out.
   */
  get timeoutTime() {
    return this.activityTimerState.activityTimeoutTimeSeconds;
  }
}
</script>
<style lang="scss" scoped>
.activity-timeout {
  align-self: center;
  font-size: $font-size - 2px;
}
</style>
