<template>
  <div class="settings-bar">
    <div class="options-button" id="options-button" @click="toggleSettings" v-if="userOwnsCurrentPOS()">
      <font-awesome-icon icon="ellipsis-h"/>
    </div>
    <div class="settings-component pos-card" id="settings-component" v-if="showSettings">
      <div class="header">Settings</div>
      <div class="setting-row" v-if="userState.userPOSs.length > 0">
        <label for="posselect">Switch POS to</label>
        <select v-model="chosenPOS" name="posselect"
                v-on:change="posChanged" v-if="userState.userPOSs.length > 1">
          <option v-for="pointOfSale in userState.userPOSs"
                  v-bind:key="pointOfSale.name" :value="pointOfSale">
            {{ pointOfSale.name }}
          </option>
        </select>
        <div v-else>{{ userState.userPOSs[0].name }}</div>
      </div>
      <div class="force-reload">
        <b-button @click="clickForceReload" variant="primary">
          Force update information
        </b-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import UserModule from '@/store/modules/user';
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';
import { BasePointOfSale } from '@/entities/PointOfSale';

@Component
export default class SettingsComponent extends Vue {
  private userState = getModule(UserModule);

  private posState = getModule(PointOfSaleModule);

  private boundedListener: any;

  private chosenPOS: BasePointOfSale;

  private showSettings: boolean = false;

  constructor() {
    super();
    this.chosenPOS = this.userState.userPOSs.find((p) => p.id === this.posState.pointOfSale.id);
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  mounted() {
    this.boundedListener = this.outsideClickListener.bind(this);

    setTimeout(() => document.addEventListener('click', this.boundedListener), 1);
  }

  updated() {
    (this.$el as HTMLElement).style.top = `-${this.$el.clientHeight - 62}px`;
  }

  userOwnsCurrentPOS() {
    return this.userState.userPOSs.map((pos) => pos.id)
      .indexOf(this.posState.pointOfSale.id) >= 0;
  }

  posChanged() {
    if (!this.userOwnsCurrentPOS()) return;

    this.posState.fetchPointOfSale(this.chosenPOS.id);
  }

  outsideClickListener(e) {
    if (e.composedPath().includes(document.getElementById('options-button'))
     || e.composedPath().includes(document.getElementById('settings-component')) && this.showSettings) {
      return;
    }

    this.showSettings = false;
    document.removeEventListener('click', this.boundedListener);
  }

  clickForceReload() {
    this.$emit('forceUpdateStore');
    this.toggleSettings();
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/common.scss";

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
