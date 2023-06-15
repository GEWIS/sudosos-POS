<template>
  <div class="keypad" :class="{inline}">
    <div v-for="key in keys" :key="key" cols="4" class="key" @click.stop="() => keyClicked(key)">
      <div class="key-text">{{ key }}</div>
    </div>
    <div class="key-external" @click.stop="() => toggleExternalState()">
      <div  class="key-external-text">
        {{externalState === 'EXTERNAL' ? 'Change to GEWIS login' : 'Change to external login'}}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-facing-decorator';

/**
 * Which external state is currently active.
 */
enum ExternalState {
  // GEWIS login
  GEWIS = 'GEWIS',
  // External login
  EXTERNAL = 'EXTERNAL'
}

/**
 * Component for the login keypad.
 */
@Component
export default class Keypad extends Vue {
  /**
   * The keys, in order, that are displayed on the keypad in 4 rows of 3 keys.
   */
  public readonly keys: (number|string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '🠨', 0, '✔'];

  /**
   * The value that is currently entered.
   */
  @Prop({ default: 0 }) readonly value!: number;

  /**
   * Whether the keypad should be displayed inline or not.
   */
  @Prop({ default: false }) readonly inline!: boolean;

  /**
   * The external state that is currently active.
   */
  @Prop({ default: 'GEWIS' }) externalState: ExternalState;

  /**
   * Toggle the external state.
   */
  toggleExternalState() {
    if (this.externalState === ExternalState.GEWIS) {
      this.$emit('update:externalState', ExternalState.EXTERNAL);
    } else {
      this.$emit('update:externalState', ExternalState.GEWIS);
    }
  }

  /**
   * Handle a click on one of the keys. If the key is a backspace, a backspace
   * event is emitted. If the key is the ok button, an ok event is emitted.
   * Otherwise, the key is emitted as a string as keyPressed event.
   * @param {number|string} key The key that was clicked.
   */
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
