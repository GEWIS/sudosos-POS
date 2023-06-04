<template>
  <div class="nav-item search-bar" @click="focusOnSearch()">
    <font-awesome-icon icon="search"/>
    <span class="text" ref="text"></span>
    <div class="indicator"></div>
    <input
      type="text" class="search-input" ref="searchInput"
      @input="() => onInput()"
    />
  </div>
</template>
<script lang="ts">
import {
  Vue, Component,
} from 'vue-property-decorator';

/**
 * Component for a search bar. When the user types in the search bar, the
 * update event is emitted with the current query.
 */
@Component
export default class SearchBar extends Vue {
  $refs!: {
    searchInput: HTMLInputElement
    text: HTMLSpanElement
  }

  /**
   * The current query.
   */
  private query: string = '';

  /**
   * Update the query. This also updates the text in the search bar.
   * @param {string} query The new query.
   */
  updateQuery(query: string) {
    this.query = query;
    this.$refs.text.innerText = query;
  }

  /**
   * Get the current query.
   * @return {string} The current query.
   */
  getQuery(): string {
    return this.query;
  }

  /**
   * Called when the user types in the search bar. Updates the query and emits
   * the update event.
   */
  onInput() {
    this.updateQuery(this.$refs.searchInput.value);
    this.$emit('update', this.query);
  }

  /**
   * Focus on the search bar if the user clicks on the search bar.
   */
  focusOnSearch() {
    this.$refs.searchInput.focus();
  }
}
</script>
<style scoped lang="scss">
.search-bar {
  border: 1px solid $gewis-red;
  border-radius: $border-radius;
  flex: 1 1 100px;
  display: flex;
  flex-direction: row;
  align-items: left;
  justify-content: left;
  cursor: pointer;
  font-size: 20px;
  line-height: 28px;
  padding: 1rem 2rem;

  .text {
    height: 28px;
  }

  .indicator {
    content: "";
    width: 2px;
    height: 20px;
    margin-top: 5px;
    background: $bootstrap-black;
    margin-left: 3px;
    display: inline-block;
    animation: search-cursor-blink 1.5s steps(2) infinite;
  }

  .fa-search {
    margin: 4px 10px 4px 0;
    width: 20px;
    height: 20px;
  }

  .search-input {
    width: 0;
    height: 0;
    border: none !important;
    outline: none !important;
    color: rgba(0,0,0,0);
  }
}
</style>
