<template>
  <b-modal
    id="modal-tos-not-required"
    title="Terms of Service"
    no-close-on-backdrop
    no-close-on-esc
    @cancel="handleCancel"
    @close="handleCancel"
  >
    <div class="d-block text-center">
    By using SudoSOS, you agree to the terms of service as specified on sudosos.gewis.nl.
    </div>
  </b-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class TransactionHistory extends Vue {
  @Prop() initiallyOpen: boolean;

  @Prop() loggedOut: () => void;

  mounted() {
    if (this.initiallyOpen) {
      this.$bvModal.show('modal-tos-not-required');
    }
  }

  handleCancel() {
    this.loggedOut();
  }
}
</script>
