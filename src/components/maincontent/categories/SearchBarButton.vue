<template>
  <div class="search-bar-button" @click="$emit('clicked')">
    <font-awesome-icon icon="search"/> Search...
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SearchBarButton extends Vue {}
</script>
<style lang="scss" scoped>
.search-bar-button {
  border: 1px solid $gewis-red;
  border-radius: $border-radius;
  flex: 0 0 200px;
  width: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  height: 100%;

  .fa-search {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
}
</style>