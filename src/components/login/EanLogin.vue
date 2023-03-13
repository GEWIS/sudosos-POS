<template>
  <div class="ean-scanner" />
</template>
<script lang="ts">
import {
  Component, Prop, Vue,
} from 'vue-property-decorator';

/**
 * Component for scanning EAN codes.
 */
@Component
export default class EanLogin extends Vue {
  /**
   * The function to call when a EAN code is scanned.
   */
  @Prop() handleLogin: (eanCode: string) => void;

  /**
   * The captured key events.
   */
  private captures: KeyboardEvent[] = [];

  /**
   * Register the input listener when the component is mounted.
   */
  mounted() {
    document.addEventListener('keydown', this.onInput);
  }

  /**
   * Handle the input event. When the enter key is pressed, the captured
   * key events are reduced to a string and passed to the handleLogin
   * function. The captures are then reset.
   */
  onInput(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      const code = this.captures.reduce((input, e) => input + e.key, '');
      this.handleLogin(code);
      this.captures = [];
    } else {
      this.captures.push(event);
    }
  }

  /**
   * Unregister the input listener when the component is unmounted.
   */
  unmounted() {
    document.removeEventListener('keydown', this.onInput);
  }
}
</script>
