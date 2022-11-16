<template>
  <div class="nav-item search-bar" @click="focusOnSearch()">
    <font-awesome-icon icon="search"/>
    <span class="text" ref="text"></span>
    <div class="indicator"></div>
    <input
      type="text" class="search-input" ref="searchInput"
      @input="e => emitUpdate(e)"
    />
  </div>
</template>
<script lang="ts">
import { Vue, Ref, Component } from 'vue-property-decorator'

@Component
export default class SearchBar extends Vue {
  $refs!: {
    searchInput: HTMLInputElement
    text: HTMLSpanElement
  }

  private query: string = "";

  updateQuery(query: string) {
    this.query = query;
    // TODO: fix that this does not use model and direct rerendering (currently like this because of weird behavior)
    this.$refs.text.innerText = query;
  }

  getQuery(): string {
    return this.query;
  }

  emitUpdate(e) {
    this.updateQuery(e.target.value);
    this.$emit('update', this.query);
  }

  focusOnSearch() {
    this.$refs.searchInput.focus();
  }
}
</script>
<style scoped lang="scss">
@import "~bootstrap/scss/bootstrap";
@import "./src/styles/Nav.scss";

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