<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EanLogin extends Vue {
  @Prop() handleLogin: (eanCode: string) => void;

  private captures: KeyboardEvent[] = [];

  mounted() {
    document.addEventListener('keydown', this.registerInput);
  }

  registerInput(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      const code = this.captures.reduce((input, e) => input + e.key, '');
      this.handleLogin(code);
      this.captures = [];
    } else {
      this.captures.push(event);
    }
  }

  unmounted() {
    document.removeEventListener('keydown', this.registerInput);
  }
}
</script>
