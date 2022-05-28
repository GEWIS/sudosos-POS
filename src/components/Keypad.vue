<template>
  <div class="keypad" :class="{inline}">
    <div v-for="key in keys" :key="key" cols="4" class="key" @click.stop="keyClicked(key)">
      <div class="key-text">{{ key }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, PropSync, Prop, Vue,
} from 'vue-property-decorator';

@Component
export default class Keypad extends Vue {
  private keys: (number|string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '🠨', 0, '✔'];

  @Prop({ default: 0 }) readonly value!: number;

  @Prop({ default: false }) readonly inline!: boolean;

  // eslint-disable-next-line class-methods-use-this
  keyClicked(key: number|string) {
    if (key === '🠨') {
      this.$emit('backspace');
    } else if (key === '✔') {
      this.$emit('ok');
    } else {
      this.$emit('keyPressed', key.toString());
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/global/_variables.scss";

.keypad {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;

  .key {
    flex: 1 1 30%;
    cursor: pointer;
    background: $gewis-red;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;

    .key-text {
      font-size: 1.5rem;
      color: white;
    }
  }
}
</style>
