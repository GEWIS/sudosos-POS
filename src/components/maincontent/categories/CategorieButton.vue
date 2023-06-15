<template>
  <b-nav-item @click="clicked" :class="{active}">
    {{name}}
  </b-nav-item>
</template>
<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-facing-decorator';
import { getModule } from 'vuex-module-decorators';
import SearchModule from '@/store/modules/search';
import events from '@/events';

/**
 * Component for a button that filters the search results by category.
 */
@Component
export default class CategorieButton extends Vue {
  /**
   * The name of the category. This will be displayed on the button and is a
   * required prop.
   */
  @Prop() name!: string;

  /**
   * The category number. This is a required prop.
   */
  @Prop() category!: number;

  private searchState = getModule(SearchModule);

  /**
   * If the button is currently active. Only one button can be active at a time.
   */
  get active() {
    return this.category === this.searchState.filterCategory;
  }

  /**
   * Called when the button is clicked. Updates the filter category in the
   * search state.
   */
  clicked() {
    this.searchState.updateFilterCategory(this.category);
  }
}
</script>
