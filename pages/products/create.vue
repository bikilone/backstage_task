<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const toast = useToast();
const product = reactive({
	title: '',
	description: '',
	price: '',
	image: '',
});

const isFormDisabled = computed(() => {
	return !product.title || !product.description || !product.price || !product.image;
});

const validate = (state: typeof product) => {
	const errors = [];

	if (!state.title) errors.push({ path: 'title', message: 'Required' });
	if (!state.description) errors.push({ path: 'description', message: 'Required' });
	if (!state.price) errors.push({ path: 'price', message: 'Required' });
	if (!state.image) errors.push({ path: 'image', message: 'Required' });

	return errors;
}

const rules = {
	title: { required },
	description: { required },
	price: { required },
	image: { required },
};

const v$ = useVuelidate(rules, product);

const submitForm = async () => {
	const isFormCorrect = await v$.value.$validate();

	if (!isFormCorrect) {
		return
	}

	const formData = new FormData();
	formData.append('title', product.title);
	formData.append('description', product.description);
	formData.append('price', product.price + '');
	if (product.image && product.image.length > 0) {
		formData.append('image', product.image[0]);
	}
	try {
		const response = await $fetch('/api/products', {
			method: 'POST',
			body: formData,
		});
		toast.add({
			title: response.statusMessage,
			color: 'green',
		});
	}
	catch (e) {
		toast.add({
			title: e?.statusMessage,
			color: 'red',
		})
	}
}
</script>

<template>
	<div class="w-full h-full flex flex-col justify-center">
		<div class="w-3/4 md:w-1/2 xl:w-1/4 mx-auto p-10 bg-slate-500 ">
			<h1 class="text-2xl font-bold mb-6">
				Add New Product
			</h1>
			<UForm
				:state="product"
				:validate="validate"
				@submit.prevent="submitForm"
			>
				<UFormGroup
					label="Title*"
					name="title"
				>
					<UInput
						v-model="product.title"
						placeholder="Enter product title"
					/>
				</UFormGroup>
				<UFormGroup
					label="Description*"
					name="description"
				>
					<UTextarea
						v-model="product.description"
						placeholder="Enter product description"
					/>
				</UFormGroup>

				<UFormGroup
					label="Price*"
					name="price"
				>
					<UInput
						v-model="product.price"
						type="number"
						placeholder="Enter product price"
					/>
				</UFormGroup>

				<UFormGroup
					label="Image*"
					name="image"
				>
					<FileInput v-model="product.image" />
				</UFormGroup>
				<div class="mt-6">
					<UButton
						:disabled="isFormDisabled"
						type="submit"
						class="ui-button"
					>
						Add Product
					</UButton>
				</div>
			</UForm>
		</div>
		<NuxtLink
			to="/products"
			class="btn mx-auto mt-10"
		>Go to products</NuxtLink>
	</div>
</template>

<style lang="scss">
.ui-button {
  @apply bg-primary-500 text-white;
}
</style>
