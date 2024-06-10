<script setup lang="ts">
import type { Product } from '@prisma/client';

defineProps<{ product: Product; preloadImage: boolean }>();
</script>

<template>
	<UCard class="flex flex-col">
		<template #header>
			<div class="h-50">
				<nuxt-img
					fit="contain"
					background="white"
					:src="product.image || '/placeholder.png'"
					placeholder
					width="600"
					height="400"
					:loading="preloadImage ? 'eager' : 'lazy'"
					:preload="preloadImage"
					:alt="product.title"
					placeholder-class="placeholder"
				/>
			</div>
		</template>
		<div class="p-4 flex flex-col flex-grow">
			<h3
				class="text-lg font-semibold mb-2"
			>
				{{ product.title }}
			</h3>
			<p
				class="text-gray-700 flex-grow"
			>
				{{ product.description }}
			</p>
			<p
				class="text-gray-900 font-bold mt-4"
			>
				{{ product.price }}
			</p>
		</div>
	</UCard>
</template>
