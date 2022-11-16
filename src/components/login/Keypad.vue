<template>
  <div class="keypad" :class="{inline}">
    <div v-for="key in keys" :key="key" cols="4" class="key" @click.stop="keyClicked(key)">
      <div class="key-text">{{ key }}</div>
    </div>
    <div class="key-external" @click.stop="toggleExternalState">
      <div  class="key-external-text">
        {{this.externalState === 'EXTERNAL' ? 'Change to GEWIS login' : 'Change to external login'}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, PropSync, Prop, Vue,
} from 'vue-property-decorator';

enum ExternalState {
  GEWIS = 'GEWIS',
  EXTERNAL = 'EXTERNAL'
}

@Component
export default class Keypad extends Vue {
  private keys: (number|string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '🠨', 0, '✔'];

  @Prop({ default: 0 }) readonly value!: number;

  @Prop({ default: false }) readonly inline!: boolean;

  @Prop({ default: 'GEWIS' }) externalState: ExternalState;

  toggleExternalState() {
    if (this.externalState === ExternalState.GEWIS) {
      this.$emit('update:externalState', ExternalState.EXTERNAL);
    } else {
      this.$emit('update:externalState', ExternalState.GEWIS);
    }
  }

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
  align-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;

  .key-external {
    flex: 1 1 30%;
    cursor: pointer;
    background: $gewis-red;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 50px;
    min-height: 50px;
    max-width: 324px;
    min-width: 324px;

    .key-external-text {
      font-size: 1.5rem;
      color: white;
    }
  }

  .green {
    background: green;
  }

  .key {
    flex: 1 1 30%;
    cursor: pointer;
    background: $gewis-red;
    border-radius: $border-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100px;
    min-height: 100px;
    max-width: 100px;
    min-width: 100px;

    .key-text {
      font-size: 1.5rem;
      color: white;
    }
  }
}
</style>
