<template>
  <div class="settings-component pos-card" id="settings-component">
    <div class="header">Settings</div>
    <div class="setting-row">
      <input type="checkbox" id="borrelmode-checkbox" v-model="borrelMode" @change="modeChanged">
      <label for="borrelmode-checkbox">Activate borrelmode for</label>
      <select v-model="chosenOrgan" name="organselect" @change="modeChanged">
        <option v-for="organ in userState.allOrgans" v-bind:key="organ.organName" :value="organ">
          {{ organ.organName }}
        </option>
      </select>
    </div>
  </div>
</template>
<script lang="ts">
import { Organ } from '@/entities/Organ';
import UserModule from '@/store/modules/user';
import { Component, Vue, Prop, PropSync, } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

@Component
export default class SettingsComponent extends Vue {
  private userState = getModule(UserModule);

  private borrelMode: boolean = false;

  private chosenOrgan: Organ = {} as Organ;

  private boundedListener: any;

  @Prop() visible: boolean;

  mounted() {
    if (this.userState.borrelModeOrgan && this.userState.borrelModeOrgan.organName) {
      this.chosenOrgan = this.userState.borrelModeOrgan;
      this.borrelMode = true;
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--gewis-red', 'green');
    }
    else {
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--gewis-red', 'rgba(212, 0, 0, 1)');
    }

    this.boundedListener = this.outsideClickListener.bind(this);

    setTimeout(() => document.addEventListener("click", this.boundedListener), 1);
  }

  modeChanged() {
    if (this.borrelMode === true && this.chosenOrgan.organName !== undefined) {
      this.userState.setBorrelModeOrgan(this.chosenOrgan);
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--gewis-red', 'green');
    }
    else {
      this.userState.setBorrelModeOrgan({});
      // @ts-ignore
      document.querySelector(':root').style.setProperty('--gewis-red', 'rgba(212, 0, 0, 1)');
    }
  }

  outsideClickListener(e) {
    if (e.composedPath().includes(document.getElementById("options-button"))
     || e.composedPath().includes(document.getElementById("settings-component")) 
     || !this.$parent.$data.showSettings) {
      return;
    }

    console.log("clicked outside");

    this.$parent.$data.showSettings = false;
    document.removeEventListener("click", this.boundedListener);
  }
}
</script>
<style lang="scss" scoped>
  @import "./src/styles/common.scss";

  .settings-component {
    position: absolute;
    top: -100%;
    left: 75px;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: $border-radius;
    border: 1px solid $gewis-red;
    height: auto;
    gap: 16px;
    padding-bottom: 16px;
    width: 600px;

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
      font-size: 2rem;
      padding: 0 16px;

      input[type=checkbox] {
        height: 2rem;
        width: 2rem;
      }

      label {
        margin: 0 16px;
      }
    }
  }
</style>
