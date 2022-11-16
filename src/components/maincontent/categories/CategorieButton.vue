<template>
  <b-nav-item @click="buttonClicked" :class="{active}">
    {{name}}
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

  @Prop() category!: number;

  private searchState = getModule(SearchModule);

  get active() {
    return this.category === this.searchState.filterCategory;
  }

  buttonClicked() {
    this.searchState.updateFilterCategory(this.category);
  }
}
</script>
