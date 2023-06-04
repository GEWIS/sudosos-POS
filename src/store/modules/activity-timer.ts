import {
  Action, Module, Mutation, VuexModule,
} from 'vuex-module-decorators';
import store from '@/store';

/**
 * The module that controls the activity timer.
 */
@Module({
  dynamic: true, namespaced: true, store, name: 'ActivityTimerModule',
  })
export default class ActivityTimerModule extends VuexModule {
  /**
   * The time in milliseconds until the user is considered inactive.
   */
  private timeoutTime: number = 0;

  /**
   * The default time in milliseconds until the user is considered inactive.
   */
  private timeoutDelay: number = 30000;

  /**
   * The time in milliseconds between each timeout clock tick.
   */
  private timeoutStep: number = 1000;

  /**
   * The handle to the timeout timer.
   */
  public timeoutHandle: number = 0;

  /**
   * The handle to the timeout clock timer.
   */
  public timeoutClockHandle: number = 0;

  /**
   * Whether the user has timed out.
   */
  public timedOut: boolean = false;

  /**
   * ACTION. Starts the activity timer. It will regiser a mouseup event listener and
   * dispatch the userActivity action every time the mouse is clicked.
   */
  @Action
  start() {
    this.context.dispatch('userActivity');

    window.addEventListener('mouseup', () => {
      this.context.dispatch('userActivity');
    });
  }

  /**
   * ATION. Stops the activity timer. It will clear the timeout timers.
   */
  @Action
  stop() {
    this.context.commit('clearTimeouts');
  }

  /**
   * COMPUTED. Gets the time in seconds until the user is considered inactive.
   */
  get activityTimeoutTimeSeconds() {
    return Math.ceil(this.timeoutTime / 1000);
  }

  /**
   * COMPUTED. Gets whether the user has timed out.
   */
  get hasTimedOut() {
    return this.timedOut;
  }

  /**
   * ACTION. This function is called if there was any user activity. It will clear the
   * timeout timer and set a new one. It will also clear the timeout clock timer
   * and set a new one.
   */
  @Action
  userActivity() {
    if (this.timeoutHandle > 0) {
      clearTimeout(this.timeoutHandle);
    }

    this.context.commit('setTimeoutTime', this.timeoutDelay);

    this.context.commit('setTimeoutHandle', setTimeout(() => {
      this.context.commit('setTimedOut', true);
    }, this.timeoutDelay));

    this.context.dispatch('timeoutClock');
  }

  /**
   * ACTION. This function is called every timeoutStep milliseconds. It will decrease
   * the timeoutTime by the timeoutStep amount. If the timeoutTime is less than or equal
   * to 0, it will clear the timeout clock timer.
   */
  @Action
  timeoutClock() {
    if (this.timeoutTime <= 0) {
      return;
    }

    if (this.timeoutClockHandle > 0) {
      clearTimeout(this.timeoutClockHandle);
      this.context.commit('setTimeoutClockHandle', undefined);
    }

    this.context.commit('setTimeoutClockHandle', setTimeout(() => {
      this.context.commit('decreaseTimeoutTime', this.timeoutStep);
      this.context.dispatch('timeoutClock');
    }, this.timeoutStep));
  }

  /**
   * MUTATION. Sets the handle of the timeout timer.
   * @param {number} handle The handle of the timeout timer.
   */
  @Mutation
  setTimeoutHandle(handle: number) {
    this.timeoutHandle = handle;
  }

  /**
   * MUTATION. Sets the handle of the timeout clock timer.
   * @param {number} handle The handle of the timeout clock timer.
   */
  @Mutation
  setTimeoutClockHandle(handle: number) {
    this.timeoutClockHandle = handle;
  }

  /**
   * MUTATION. Sets the flag that indicates whether the user has timed out.
   * @param {boolean} timedOut Whether the user has timed out.
   */
  @Mutation
  setTimedOut(timedOut: boolean) {
    this.timedOut = timedOut;
  }

  /**
   * MUTATION. Sets the time in milliseconds until the user is considered inactive.
   * @param {number} time The time in milliseconds until the user is considered inactive.
   */
  @Mutation
  setTimeoutTime(time: number) {
    this.timeoutTime = time;
  }

  /**
   * MUTATION. Decreases the timeoutTime by the given amount.
   * @param {number} amount The amount to decrease the timeoutTime by.
   */
  @Mutation
  decreaseTimeoutTime(amount: number) {
    this.timeoutTime -= amount;
  }

  /**
   * MUTATION. Clears the timeout timers.
   */
  @Mutation
  clearTimeouts() {
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
