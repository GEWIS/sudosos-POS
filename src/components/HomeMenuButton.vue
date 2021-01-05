<template>
  <b-nav-item @click="syncedActiveButton = name" :class="{active}">
    <font-awesome-icon :icon="name" />
  </b-nav-item>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, PropSync,
} from 'vue-property-decorator';

@Component
export default class HomeMenuButton extends Vue {
  // The name of this button
  @Prop() name!: String;

  // The current active button; Determines style changes
  @PropSync('activeButton', { type: String }) syncedActiveButton!: String

  get active() {
    return this.name === this.syncedActiveButton;
  }
}
</script>
<style lang="scss" scoped>
  @import "./src/styles/Nav.scss";
</style>
