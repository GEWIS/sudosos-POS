<template>
  <div class="activity-timeout" v-if="!checkingOut">
    Automatically logging out in {{activityTimeoutTimeSeconds}} seconds.
  </div>
  <div class="activity-timeout" v-else>
    No automatic logout during checkout.
  </div>
</template>
<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

@Component
export default class AcivityTimer extends Vue {
  @Prop() checkingOut!: boolean;

  private activityTimeoutTime: number = 0;

  private activityTimeoutDelay: number = 30000;

  private activityTimeoutStep: number = 1000;

  private activityTimeoutHandle: number;

  private activityTimeoutTimerHandle: number;

  mounted() {
    this.userActivity();

    window.addEventListener('mouseup', () => {
      this.userActivity();
    });
  }

  unmounted() {
    this.clearTimeouts();
  }

  get activityTimeoutTimeSeconds() {
    return Math.ceil(this.activityTimeoutTime / 1000);
  }

  userActivity() {
    if (this.activityTimeoutHandle !== undefined) {
      clearTimeout(this.activityTimeoutHandle);
      this.activityTimeoutHandle = undefined;
    }

    this.activityTimeoutTime = this.activityTimeoutDelay;

    // @ts-ignore
    this.activityTimeoutHandle = setTimeout(() => {
      this.$emit('timeout');
    }, this.activityTimeoutDelay);

    this.activityTimeoutTimer();
  }

  activityTimeoutTimer() {
    if (this.activityTimeoutTime <= 0) {
      return;
    }

    if (this.activityTimeoutTimerHandle !== undefined) {
      clearTimeout(this.activityTimeoutTimerHandle);
      this.activityTimeoutTimerHandle = undefined;
    }

    // @ts-ignore
    this.activityTimeoutTimerHandle = setTimeout(() => {
      this.activityTimeoutTime -= this.activityTimeoutStep;
      this.activityTimeoutTimer();
    }, this.activityTimeoutStep);
  }

  clearTimeouts() {
    if (this.activityTimeoutHandle !== undefined) {
      clearTimeout(this.activityTimeoutHandle);
      this.activityTimeoutHandle = undefined;
    }

    if (this.activityTimeoutTimerHandle !== undefined) {
      clearTimeout(this.activityTimeoutTimerHandle);
      this.activityTimeoutTimerHandle = undefined;
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-timeout {
  align-self: center;
}
</style>