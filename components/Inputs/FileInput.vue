<script setup lang="ts">
type IProps = {
	modelValue: FileList | null;
}

const props = defineProps<IProps>()
const emits = defineEmits<{
	(e: 'update:modelValue', value: FileList | null): void;
}>()

// Layout
const model = useVModel(props, 'modelValue', emits)
const { files, open, onChange } = useFileDialog({ multiple: false })

onChange((files) => {
	model.value = files
})
</script>

<template>
	<div class="flex flex-col gap-y-3 bg-dark-100">
		<UButton
			type="button"
			class="ui-button"
			@click="open()"
		>
			Choose file
		</UButton>

		<ul>
			<li
				v-for="file in files"
				:key="file.name"
			>
				{{ file.name }}
			</li>
		</ul>
	</div>
</template>
