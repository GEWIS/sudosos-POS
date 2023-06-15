<template>
  <div class="keyboard">
    <div class="keyrow" v-if="allowNumbers">
        <div v-for="key in keys[3]"
          :key="key" cols="4" class="key"
          @click.stop="keyClicked(key)">
            <div class="key-text">{{ key }}</div>
        </div>
    </div>
    <div class="keyrow">
        <div v-for="key in keys[0]"
        :key="key" cols="4" class="key"
        @click.stop="keyClicked(key)">
            <div class="key-text">{{ key }}</div>
        </div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':1}"></div>
        <div v-for="key in keys[1]"
          :key="key" cols="4" class="key"
          @click.stop="keyClicked(key)"
          :style="{'flex-grow':3}">
            <div class="key-text">{{ key }}</div>
        </div>
        <div class="padding" :style="{'flex-grow':2.5}"></div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':1}"></div>
        <div v-for="key in keys[2]"
          :key="key" cols="4" class="key"
          @click.stop="keyClicked(key)"
          :style="{'flex-grow':1}">
            <div class="key-text">{{ key }}</div>
        </div>
    <div class="padding" :style="{'flex-grow':2.5}"></div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':4}"></div>
        <div class="key"
          @click.stop="keyClicked('space')"
          :style="{'flex-grow':6, 'max-width': '200px'}">
            <div class="key-text">space</div>
        </div>
        <div class="key" @click.stop="keyClicked('backspace')" :style="{'flex-grow':2}">
            <div class="key-text">🠨</div>
        </div>
        <div class="padding" :style="{'flex-grow':4}"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-facing-decorator';

/**
 * Component for a keyboard that can be used to input text.
 */
@Component
export default class Keyboard extends Vue {
  /**
   * The function that is called when the input changes.
   */
  @Prop() onChange!: (value: string) => void;

  /**
   * If the keyboard should allow numbers.
   */
  @Prop() allowNumbers!: boolean;

  /**
   * The keys that are displayed on the keyboard. This is a 2D array, where the
   * first dimension is the row and the second dimension contains the keys in
   * that row.
   */
  public readonly keys: (number|string)[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ];

  /**
   * The current input.
   */
  private input: string = '';

  /**
   * This function is called when a key is clicked. If the key is a backspace,
   * the last character is removed from the input. If the key is a space, a
   * space is added to the input. Otherwise, the key is added to the input.
   * Then, the input is emitted as change event.
   * @param {number|string} key The key that was clicked.
   */
  keyClicked(key: number|string) {
    if (key === 'backspace') {
      if (this.input.length > 0) {
        this.input = this.input.slice(0, -1);
      }
    } else if (key === 'space') {
      this.input += ' ';
    } else {
      this.input += key;
    }

    this.$emit('change', this.input);
  }
}
</script>
<style lang="scss" scoped>
.keyboard {
  display: flex;
  align-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 2px;
  max-width: 720px;

  .keyrow {
    display: flex;
    flex-direction: row;
    width: 100%;
    gap: 2px;
  }

  .key {
    flex: 1 1 0px;
    cursor: pointer;
    background: $gewis-red;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    max-width: 70px;

    .key-text {
      font-size: 1.5rem;
      color: white;
    }
  }
}
</style>
