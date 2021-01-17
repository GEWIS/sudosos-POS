<template>
  <div class="searchbar-container" v-show="showSearchbar">
    <div class="query-container">
      <p class="query-text">{{ syncedInput }}</p>
    </div>
    <div :class="searchbarId"></div>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, PropSync, Vue,
} from 'vue-property-decorator';
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
@Component
export default class SearchbarWithKeyboard extends Vue {
  @PropSync('input', { type: String }) syncedInput!: string;

  @Prop() showSearchbar!: boolean;

  private keyboard: any = null;

  private searchbarId: string = '';

  mounted() {
    this.searchbarId = `keyboard-${Math.random().toString(36).substring(7)}`;
    this.$nextTick(() => {
      this.keyboard = new Keyboard(this.searchbarId, {
        onChange: this.onChange,
      });
    });
  }

  onChange(input: string) {
    this.syncedInput = input.charAt(0).toUpperCase() + input.slice(1);
  }
}
</script>
<style lang="scss" scoped>
  .searchbar-container {
    position: absolute;
    bottom: 0;
    left: 6rem;
    width: calc(100% - 6rem - 16rem);

    .query-container {
      p.query-text {
        font-size: 4em;
        margin-left: auto;
        margin-right: auto;
        width: fit-content;
      }
    }
  }
</style>
