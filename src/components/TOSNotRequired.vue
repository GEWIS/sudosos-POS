<template>
  <b-modal
    id="modal-tos-not-required"
    title="Terms of Service"
    no-close-on-backdrop
    no-close-on-esc
    @cancel="handleCancel"
    @close="handleCancel">
    <div class="d-block text-center">
    By using SudoSOS, you agree to the terms of service as specified on sudosos.gewis.nl.
    </div>
  </b-modal>
</template>
<script lang="ts">
import { 
  Component, Prop, Vue 
} from 'vue-property-decorator';

/**
 * The modal that is shown when the user has not accepted the terms of service.
 */
@Component
export default class TransactionHistory extends Vue {
  /**
   * Whether the modal should be shown when the component is mounted.
   */
  @Prop() initiallyOpen: boolean;

  /**
   * The function that is called when the user clicks the cancel button.
   */
  @Prop() loggedOut: () => void;

  /**
   * When the component is mounted the modal is shown if the initiallyOpen prop
   * is true.
   */
  mounted() {
    if (this.initiallyOpen) {
      this.$bvModal.show('modal-tos-not-required');
    }
  }

  /**
   * Listens to the cancel event and calls the loggedOut function.
   */
  handleCancel() {
    this.loggedOut();
  }
}
</script>
