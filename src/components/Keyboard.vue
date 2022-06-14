<template>
  <div class="keyboard">
    <div class="keyrow" v-if="allowNumbers">
        <div class="padding" :style="{'flex-grow':0.1}"></div>
        <div v-for="key in keys[3]" :key="key" cols="4" class="key" @click.stop="keyClicked(key)">
            <div class="key-text">{{ key }}</div>
        </div>
        <div class="padding" :style="{'flex-grow':0.1}"></div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':0.1}"></div>
        <div v-for="key in keys[0]" :key="key" cols="4" class="key" @click.stop="keyClicked(key)">
            <div class="key-text">{{ key }}</div>
        </div>
        <div class="padding" :style="{'flex-grow':0.1}"></div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':1}"></div>
        <div v-for="key in keys[1]" :key="key" cols="4" class="key" @click.stop="keyClicked(key)" :style="{'flex-grow':3}">
            <div class="key-text">{{ key }}</div>
        </div>
        <div class="padding" :style="{'flex-grow':2.5}"></div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':1}"></div>
        <div v-for="key in keys[2]" :key="key" cols="4" class="key" @click.stop="keyClicked(key)" :style="{'flex-grow':1}">
            <div class="key-text">{{ key }}</div>
        </div>
    <div class="padding" :style="{'flex-grow':2.5}"></div>
    </div>
    <div class="keyrow">
        <div class="padding" :style="{'flex-grow':4}"></div>
        <div class="key" @click.stop="keyClicked('space')" :style="{'flex-grow':6, 'max-width': '200px'}">
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
  Component, PropSync, Prop, Vue,
} from 'vue-property-decorator';

@Component
export default class Keyboard extends Vue {
  @Prop() onChange!: (value: string) => void;

  @Prop() allowNumbers!: boolean;

  private keys: (number|string)[][] = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  ];

  private input: string = '';

  // eslint-disable-next-line class-methods-use-this
  keyClicked(key: number|string) {
    if (key === 'backspace') {
      if(this.input.length > 0) {
        this.input = this.input.slice(0, -1);
      }
    } else if (key === 'space') {
      this.input += ' ';
    } else {
      this.input += key;
    }

    this.onChange(this.input);
  }

  getInput() {
    return this.input;
  }

  setInput(value: string) {
    this.input = value;
  }
}
</script>
<style lang="scss" scoped>
@import "./src/styles/global/_variables.scss";

.keyboard {
  display: flex;
  align-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 2px;

  .keyrow {
    display: flex;
    flex-direction: row;
    flex: 1 1 100%;
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
    height: 50px;
    max-width: 70px;

    .key-text {
      font-size: 1.5rem;
      color: white;
    }
  }
}
</style>
