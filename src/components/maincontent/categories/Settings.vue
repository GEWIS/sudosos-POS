<template>
  <div class="settings-bar" :style="{display: userOwnsPOS() ? 'initial' : 'none'}">
    <div class="options-button" id="options-button" @click="() => toggleSettings()" v-if="userOwnsPOS()">
      <font-awesome-icon icon="ellipsis-h"/>
    </div>
    <div class="settings-component pos-card" id="settings-component" v-if="showSettings">
      <div class="header">Settings</div>
      <div class="setting-row" v-if="userPOSs.length > 0">
        <label for="posselect">Switch POS to</label>
        <select v-model="chosenPOS" name="posselect"
                v-on:change="posChanged" v-if="userPOSs.length > 1">
          <option v-for="pointOfSale in userPOSs"
                  v-bind:key="pointOfSale.name" :value="pointOfSale">
            {{ pointOfSale.name }}
          </option>
        </select>
        <div v-else>{{ userPOSs[0].name }}</div>
      </div>
      <div class="force-reload">
        <b-button @click="() => clickedForceReload()" variant="primary">
          Force update information
        </b-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import UserModule from '@/store/modules/user';
import {
  Component, Vue,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import { BasePointOfSale } from '@/entities/PointOfSale';

/**
 * Component for the settings menu.
 */
@Component
export default class SettingsComponent extends Vue {
  private userState = getModule(UserModule);

  private posState = getModule(PointOfSaleModule);

  /**
   * The currently chosen point of sale.
   */
  public chosenPOS: BasePointOfSale;

  /**
   * If the settings menu is currently visible.
   */
  public showSettings: boolean = false;

  /**
   * When the component is created the chosen point of sale is set to the current.
   */
  constructor() {
    super();
    this.chosenPOS = this.userState.userPOSs.find((p) => p.id === this.posState.pointOfSale.id);
  }

  /**
   * When the component is mounted the pageClicked listener is added to the
   * document.
   */
  mounted() {
    setTimeout(() => document.addEventListener('click', this.pageClicked), 1);
  }
  
  /**
   * When the component is updated the settings menu is moved to the correct
   * height.
   */
  updated() {
    (this.$el as HTMLElement).style.top = `-${this.$el.clientHeight - 62}px`;
  }

  /**
   * When the component is unmounted the pageClicked listener is removed from the
   * document.
   */
  unmounted() {
    document.removeEventListener('click', this.pageClicked);
  }

  /**
   * The points of sale that the user is allowed to see.
   */
  get userPOSs() {
    return this.userState.userPOSs;
  }

  /**
   * Toggles the visibility of the settings menu.
   */
  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  /**
   * Checks if the user should be able to see the point of sale in posState.
   */
  userOwnsPOS() {
    return this.userState.userPOSs.map((pos) => pos.id)
      .indexOf(this.posState.pointOfSale.id) >= 0;
  }

  /**
   * If the user can see the selected point of sale it is set as the current
   * point of sale.
   */
  posChanged() {
    if (!this.userOwnsPOS()) return;

    this.posState.fetchPointOfSale(this.chosenPOS.id);
  }

  /**
   * Listens to clicks on the page and closes the settings menu if the click
   * was outside the settings menu while it is visible.
   */
  pageClicked(e: MouseEvent) {
    if (e.composedPath().includes(document.getElementById('options-button'))
     || e.composedPath().includes(document.getElementById('settings-component')) && this.showSettings) {
      return;
    }

    this.clickedOutside();
  }

  /**
   * Called when the user clicked outside of the settings menu.
   */
  clickedOutside() {
    this.showSettings = false;
  }

  /**
   * Listens to the forceReload button and emits the forceUpdateStore event.
   * This also closes the settings menu.
   */
  clickedForceReload() {
    this.$emit('forceUpdateStore');
    this.toggleSettings();
  }
}
</script>
<style lang="scss" scoped>
.options-button {
  background-color: $gewis-red;
  border-radius: $border-radius;
  display: flex;
  justify-content: center;
  align-items: center;
  width: $nav-height;
  flex-grow: 0;
  flex-shrink: 0;
  cursor: pointer;
  height: $nav-height;
  text-align: center;
  flex-basis: 62px;
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
}

.settings-component {
  position: absolute;
  bottom: -41px;
  left: 74px;
  display: flex;
  flex-direction: column;
  justify-content: left;
  background: white;
  border-radius: $border-radius;
  border: 1px solid $gewis-red;
  height: auto;
  gap: 16px;
  padding-bottom: 16px;
  width: fit-content;
  transform: translateY(-25%);

  .header {
    background: $gewis-red;
    color: white;
    padding: 8px 0;
    font-size: 1.2em;
    border-top-left-radius: $border-radius - 2px;
    border-top-right-radius: $border-radius - 2px;
    text-align: center;
  }

  .setting-row {
    width: fit-content;
    display: flex;
    font-size: 20px;
    padding: 0 16px;

    input[type=checkbox] {
      height: 28px;
      width: 28px;
    }

    label {
      margin: 0 8px 0 16px;
    }
  }

  .force-reload {
    padding: 0 1rem;
  }
}
</style>
