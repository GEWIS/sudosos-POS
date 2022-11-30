import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from '@/store';

@Module({
  dynamic: true, namespaced: true, store, name: 'ActivityTimerModule',
})
export default class ActivityTimerModule extends VuexModule {
  private timeoutTime: number = 0;

  private timeoutDelay: number = 30000;

  private timeoutStep: number = 1000;

  public timeoutHandle: number = 0;

  public timeoutClockHandle: number = 0;

  public timedOut: boolean = false;

  @Action
  start() {
    console.log("start");
    this.context.dispatch('userActivity');

    window.addEventListener('mouseup', () => {
      this.context.dispatch('userActivity');
    });
  }

  @Action
  stop() {
    this.context.commit('clearTimeouts');
  }

  get activityTimeoutTimeSeconds() {
    return Math.ceil(this.timeoutTime / 1000);
  }

  get hasTimedOut() {
    return this.timedOut;
  }

  @Action
  userActivity() {
    if (this.timeoutHandle > 0) {
      console.log("Clear the timeout timer");
      clearTimeout(this.timeoutHandle);
    }

    this.context.commit('setTimeoutTime', this.timeoutDelay);

    console.log("Set new timeout timer");
    this.context.commit('setTimeoutHandle', setTimeout(() => {
      this.context.commit('setTimedOut', true);
    }, this.timeoutDelay));

    this.context.dispatch('timeoutClock');
  }

  @Action
  timeoutClock() {
    console.log("Timeout ", this.timeoutTime);
    if (this.timeoutTime <= 0) {
      return;
    }

    console.log("No timeout yet", this.timeoutClockHandle);

    if (this.timeoutClockHandle > 0) {
      clearTimeout(this.timeoutClockHandle);
      this.context.commit('setTimeoutClockHandle', undefined);
    }

    this.context.commit('setTimeoutClockHandle', setTimeout(() => {
      this.context.commit('decreaseTimeoutTime', this.timeoutStep);
      this.context.dispatch('timeoutClock');
    }, this.timeoutStep));
  }

  @Mutation
  setTimeoutHandle(handle: number) {
    this.timeoutHandle = handle;
  }

  @Mutation
  setTimeoutClockHandle(handle: number) {
    this.timeoutClockHandle = handle;
  }

  @Mutation
  setTimedOut(timedOut: boolean) {
    this.timedOut = timedOut;
    console.log("timed out?",this.timedOut);
  }

  @Mutation
  setTimeoutTime(time: number) {
    this.timeoutTime = time;
  }

  @Mutation
  decreaseTimeoutTime(amount: number) {
    this.timeoutTime -= amount;
  }

  @Mutation
  clearTimeouts() {
    console.log("clearTimeouts ", this.timeoutHandle, this.timeoutClockHandle);
    if (this.timeoutHandle !== undefined) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }

    if (this.timeoutClockHandle !== undefined) {
      clearTimeout(this.timeoutClockHandle);
      this.timeoutClockHandle = undefined;
    }
  }
}