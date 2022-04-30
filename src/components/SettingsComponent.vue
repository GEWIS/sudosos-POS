<template>
  <div class="settings-component pos-card">
    <div class="setting-row">
      <input type="checkbox" id="borrelmode-checkbox" v-model="borrelMode" @change="modeChanged">
      <label for="borrelmode-checkbox">Activeer borrelmode</label>
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
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

@Component
export default class SettingsComponent extends Vue {
  private userState = getModule(UserModule);

  private borrelMode: boolean = false;

  private chosenOrgan: Organ = {} as Organ;

  mounted() {
    if (this.userState.borrelModeOrgan.organName) {
      this.chosenOrgan = this.userState.borrelModeOrgan;
      this.borrelMode = true;
    }
  }

  modeChanged() {
    if (this.borrelMode === true && this.chosenOrgan.organName !== undefined) {
      this.userState.setBorrelModeOrgan(this.chosenOrgan);
    }
  }
}
</script>
<style lang="scss" scoped>
  .settings-component {
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
