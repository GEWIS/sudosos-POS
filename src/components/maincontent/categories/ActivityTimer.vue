<template>
  <div class="activity-timeout" v-if="!cartState.checkingOut">
    Automatically logging out in {{activityTimerState.activityTimeoutTimeSeconds}} seconds.
  </div>
  <div class="activity-timeout" v-else>
    No automatic logout during checkout.
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import ActivityTimerModule from '@/store/modules/activity-timer';
import CartModule from '@/store/modules/cart';
import {getModule} from 'vuex-module-decorators';

@Component
export default class AcivityTimer extends Vue {
  @Prop() checkingOut!: boolean;

  private activityTimerState = getModule(ActivityTimerModule);

  private cartState = getModule(CartModule);
}
</script>
<style lang="scss" scoped>
.activity-timeout {
  align-self: center;
}
</style>