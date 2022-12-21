<template>
  <div class="content-container">
    <div class="content-top">
      <ExitButton @click="$emit('exit')" />
      <div class="title">
        Select a member of {{pointOfSale.owner.name}} to charge as:
      </div>
    </div>
    <div class="content-center custom-scrollbar">
      <div class="organ-member" v-for="user in pointOfSaleOwners"
        v-bind:key="user.id" @click="$emit('selected', user)">
        <span>{{ user.firstName }} {{ user.lastName }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { 
  Component, Vue 
} from 'vue-property-decorator';
import ExitButton from '@/components/maincontent/common/ExitButton.vue';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';

/**
 * Component for the main content containing a clickable list of all the members
 * that can create a transaction for the current point of sale. It will close
 * this component and emit the selected member or emit the exit event if the
 * exit button is clicked.
 */
@Component({
  components: {
    ExitButton,
  },
})
export default class MainContentMembers extends Vue {
  private pointOfSaleState = getModule(PointOfSaleModule);

  /**
   * The list of members that can create a transaction for the current point of sale.
   */
  get pointOfSaleOwners() {
    return this.pointOfSaleState.pointOfSaleOwners;
  }

  /**
   * The current point of sale.
   */
  get pointOfSale() {
    return this.pointOfSaleState.pointOfSale;
  }
}
</script>
<style lang="scss" scoped>
.title {
  flex: 1;
  font-size: 20px;
  padding: 16px;
  text-align: center;
}

.content-center {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
  align-content: center;

  .organ-member {
    flex: 1 0 30%;
    padding: 8px 4px;
    font-size: 20px;
    height: 80px;
    max-width: 33%;
    border: 1px solid $gewis-red;
    border-radius: $border-radius;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    span {
      line-height: 30px;
    }
  }
}
</style>