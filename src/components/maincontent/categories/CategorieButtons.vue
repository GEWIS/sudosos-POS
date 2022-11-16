<template>
  <b-nav>
    <categorie-button
    :name="category.name"
    :category="category.id"
    v-for="category in categories"
    :key="category.id"
    />
  </b-nav>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import CategorieButton from '@/components/maincontent/categories/CategorieButton.vue'
import {ProductCategory} from '@/entities/ProductCategory'

@Component({
  components: {
    CategorieButton,
  },
})
export default class CategorieButtons extends Vue {
  @Prop() categories!: ProductCategory[];
}
</script>