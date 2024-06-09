<script setup lang="ts">
// import { object, string, type InferType } from 'yup'
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import type { FormError, FormErrorEvent } from '#ui/types';

// const schema = object({
// 	title: string().required(),
// 	description: string().required(),
// 	price: string().required(),
// 	image: string().required(),
// })

// type Schema = InferType<typeof schema>

const product = ref({
	title: '',
	description: '',
	price: 0,
	image: '',
});

const validate = (state: typeof product.value): FormError[] => {
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
	await v$.value.$touch();

	const isFormCorrect = await v$.value.$validate();

	if (!isFormCorrect) {
		return
	}

	const formData = new FormData();
	formData.append('title', product.value.title);
	formData.append('description', product.value.description);
	formData.append('price', product.value.price + '');
	if (product.value.image && product.value.image.length > 0) {
		formData.append('image', product.value.image[0]);
	}

	$fetch('/api/products', {
		method: 'POST',
		body: formData,
	});
}
const onError = (event: FormErrorEvent) => {
	const element = document.getElementById(event.errors[0].id);
	element?.focus();
	element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
</script>

<template>
	<div class="max-w-lg mt-20  mx-auto p-10 bg-slate-500">
		<h1 class="text-2xl font-bold mb-6">
			Add New Product
		</h1>
		<UForm
			:state="product"
			:validate="validate"
			@submit.prevent="submitForm"
			@error="onError"
		>
			<UFormGroup
				label="Title"
				name="title"
			>
				<UInput
					v-model="product.title"
					placeholder="Enter product title"
				/>
			</UFormGroup>
			<UFormGroup
				label="Description"
				name="description"
			>
				<UTextarea
					v-model="product.description"
					placeholder="Enter product description"
				/>
			</UFormGroup>

			<UFormGroup
				label="Price"
				name="price"
			>
				<UInput
					v-model="product.price"
					type="number"
					placeholder="Enter product price"
				/>
			</UFormGroup>

			<UFormGroup
				label="Image"
				name="image"
			>
				<FileInput v-model="product.image" />
			</UFormGroup>
			<div class="mt-6">
				<UButton
					type="submit"
					class="ui-button"
				>
					Add Product
				</UButton>
			</div>
		</UForm>
	</div>
</template>

<style lang="scss">
.ui-button {
  @apply bg-primary-500 text-white;
}
</style>
