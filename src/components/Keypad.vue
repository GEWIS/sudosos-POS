<template>
  <b-col class="keypad" :class="{inline}">
    <b-row v-if="!inline">
      <b-col cols="6" offset="3" class="value-container">
        <p>
          {{ value }}
        </p>
      </b-col>
    </b-row>
    <b-row class="keys-container">
      <b-col v-for="key in keys" :key="key" cols="4" class="key" @click.stop="keyClicked(key)">
        <p>{{ key }}</p>
      </b-col>
    </b-row>
  </b-col>
</template>
<script lang="ts">
import {
  Component, PropSync, Prop, Vue,
} from 'vue-property-decorator';

@Component
export default class Keypad extends Vue {
  private keys: (number|string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '←', 0, '✔'];

  @PropSync('value', { type: Number }) syncedValue!: number;

  @Prop({ default: false }) readonly inline!: boolean;

  // eslint-disable-next-line class-methods-use-this
  keyClicked(key: number|string) {
    if (key === '←') {
      console.log(this.syncedValue);
      if (this.syncedValue < 10) {
        this.syncedValue = 0;
      } else {
        this.syncedValue = Math.floor(this.syncedValue / 10);
      }
    } else if (key === '✔') {
      this.$emit('close');
    } else {
      this.syncedValue = this.syncedValue * 10 + Number(key);
    }
  }
}
</script>
<style lang="scss" scoped>
  .keypad {
    width: 20%;
    position: absolute;
    top: 20%;
    left: 40%;
    &.inline {
      width: 100%;
      height: 100%;
      position: relative;
      background: none;
      top: 0;
      left: 0;
    }

    background-color: $gewis-grey-shadow;

    .keys-container {
      margin: 16px;
      .key {
        text-align: center;
        p {
          cursor: pointer;
          font-size: 1.5rem;
          border: 2px solid black;
          padding: 1.5rem 0;
        }
      }
    }
    .value-container{
      text-align: center;
      margin-top: 1rem;
      p {
        font-size: 4rem;
        background-color: $gewis-grey;
        border-radius: 8px;
      }
    }
  }
</style>
