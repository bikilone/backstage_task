<script setup lang="ts">
import type { Product } from '~/types/Product'

const { data: products } = await useFetch('/api/products')

const preloadImage = computed(() => {
  return (product: Product) => {
    return products.value!.indexOf(product) < 6 // preload the first 6 images covering desktop view with 3 columns and 2 rows
  }
})
</script>

<template>
  <div>
    <h1>Products</h1>
    <div class="grid gap-4 md:gap-6  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-10 my-20 md:mx-30 xl:mx-40">
      <Product
        v-for="product in products"
        :key="product.id"
        :preload-image="preloadImage(product)"
        :product="product"
      />
    </div>
  </div>
</template>
