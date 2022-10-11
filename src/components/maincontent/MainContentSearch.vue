<template>
  <div class="content-container">
    <div class="content-top">
      <ExitButton @click="$emit('exit')" />
      <SearchBar ref="searchBar" @update="e => updateSearchFromInput(e)" />
    </div>
    <div class="content-center">
      <Products
        :products="filteredProducts"
        :searching="true" 
        @selected="item => addProduct(item, 1)" />
    </div>
    <div class="content-bottom">
      <div class="keyboard-container">
		<Keyboard
      ref="keyboard"
          :onChange="updateSearchFromKeyboard"
          :allowNumbers="false" />
	  </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import SearchBar from '@/components/SearchBar.vue';
import Keyboard from '@/components/Keyboard.vue';
import ExitButton from '@/components/ExitButton.vue';
import Products from '@/components/Products.vue';

@Component({
  components: {
	SearchBar,
	Keyboard,
	ExitButton,
	Products,
  },
})
export default class MainContentSearch extends Vue {
  private query: string = "";

  $refs!: {
    searchBar: SearchBar;
  }
  
  updateSearchFromKeyboard(value: string): void {
    this.query = value;
    this.$refs.searchBar.updateQuery(value);
  }

  updateSearchFromInput(value: string): void {
    this.query = value;
  }
}
</script>