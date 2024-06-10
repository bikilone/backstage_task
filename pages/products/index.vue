<script setup lang="ts">
import type { Product } from '~/types/Product';

const { data: products } = await useFetch('/api/products');

const preloadImage = computed(() => {
	return (product: Product) => {
		return products.value!.indexOf(product) < 6; // preload the first 6 images covering desktop view with 3 columns and 2 rows
	}
});
</script>

<template>
	<div class="mx-10 md:mx-30 xl:mx-40">
		<div class="flex flex-col items-center mt-10 md:flex-row">
			<h1 class="inline-block">
				Products
			</h1>
			<NuxtLink
				to="/products/create"
				class="btn md:ml-auto mt-10 md:mt-0"
			>Create new product</NuxtLink>
		</div>
		<div
			v-if="products?.length"
			class="grid gap-4 md:gap-6  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  my-10 lg:my-20"
		>
			<Product
				v-for="product in products"
				:key="product.id"
				:preload-image="preloadImage(product)"
				:product="product"
			/>
		</div>
		<div
			v-else
			class="text-center text-lg mt-20"
		>
			No products found
		</div>
	</div>
</template>
