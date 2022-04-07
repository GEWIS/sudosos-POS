<template>
  <div class="settings-component">
    <div class="setting-row">
      <input type="checkbox" id="borrelmode-checkbox" v-model="borrelMode" @change="modeChanged">
      <label for="borrelmode-checkbox">Activeer borrelmode</label>
      <select v-model="chosenOrgan" name="organselect">
        <option v-for="organ in availableOrgans" v-bind:key="organ.id" :value="organ">
          {{ organ.name }}
        </option>
      </select>
    </div>
  </div>
</template>
<script lang="ts">
import UserModule from '@/store/modules/user';
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

@Component
export default class SettingsComponent extends Vue {
  private userState = getModule(UserModule);

  private borrelMode: boolean = false;

  private availableOrgans: Array<Object> = [
    {
      id: 1,
      name: 'BAC',
    },
    {
      id: 2,
      name: 'ACACACACACACACACACACACACAC',
    },
    {
      id: 3,
      name: 'GEHACK',
    },
  ];

  private chosenOrgan: any = {};

  modeChanged() {
    if (this.borrelMode === true && this.chosenOrgan !== {}) {
      this.userState.setBorrelModeOrgan(this.chosenOrgan);
    }
  }
}
</script>
<style lang="scss" scoped>
  .settings-component {
    width: 80%;
    left: 10%;
    position: absolute;
    background-color: white;
    top: 0;
    height: 100%;

    .setting-row {
      margin-right: auto;
      margin-left: auto;
      width: fit-content;
      font-size: 2rem;

      input[type=checkbox] {
        height: 2rem;
        width: 2rem;
      }

      label {
        margin: 1rem 2rem;
      }
    }
  }
</style>
