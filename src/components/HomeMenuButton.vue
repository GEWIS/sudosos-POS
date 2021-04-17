<template>
  <b-nav-item @click="buttonClicked" :class="{active}">
    <font-awesome-icon :icon="name" />
  </b-nav-item>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, PropSync,
} from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import SearchModule from '@/store/modules/search';

@Component
export default class HomeMenuButton extends Vue {
  // The name of this button
  @Prop() name!: string;

  private searchState = getModule(SearchModule);

  get active() {
    return this.name === this.searchState.filterName;
  }

  buttonClicked() {
    this.searchState.updateFilterName(this.name);
  }
}
</script>
<style lang="scss" scoped>
  @import "./src/styles/Nav.scss";
</style>
