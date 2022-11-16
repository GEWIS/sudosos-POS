<template>
  <div class="content-container">
    <div class="content-top">
      <ExitButton @click="$emit('exit')" />
      <div class="title">
        Select a member of {{pointOfSaleState.pointOfSale.owner.name}} to charge as:
      </div>
    </div>
    <div class="content-center custom-scrollbar">
      <div class="organ-member" v-for="user in pointOfSaleState.pointOfSaleOwners"
        v-bind:key="user.id" @click="$emit('selected', user)">
        <span>{{ user.firstName }} {{ user.lastName }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ExitButton from '@/components/maincontent/common/ExitButton.vue';
import { getModule } from 'vuex-module-decorators';
import PointOfSaleModule from '@/store/modules/point-of-sale';

@Component({
  components: {
    ExitButton,
  },
})
export default class MainContentMembers extends Vue {
  private pointOfSaleState = getModule(PointOfSaleModule);
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