<script setup lang="ts">

interface Props {
	isDialogVisible: boolean
	changedRange: any
}

const refVForm = ref<VForm>()
const props = withDefaults(defineProps<Props>(), {})

interface Emit {
	(e: 'update:isDialogVisible', val: boolean): void
	(e: 'update:changedRange', val: any): void
}

const emit = defineEmits<Emit>()

let form = ref({
	changingRange: null
})

const onFormSubmit = () => {
	emit('update:isDialogVisible', false)
	emit('update:changedRange', form.value.changingRange)
	form.value.changingRange = null
}

const dialogModelValueUpdate = (val: boolean) => {
	emit('update:isDialogVisible', val)
}
</script>

<template>
	<VDialog :width="$vuetify.display.smAndDown ? 'auto' : 500" :model-value="props.isDialogVisible"
		@update:model-value="dialogModelValueUpdate">
		<!-- Dialog close btn -->
		<DialogCloseBtn @click="dialogModelValueUpdate(false)" />

		<VCard class="pa-sm-8 pa-5">
			<VCardText>
				<!-- 👉 Form -->
				<VForm 
					ref="refVForm"
					class="mt-6" @submit.prevent="onFormSubmit">
					<VRow>
						<VCol cols="12" class="d-flex gap-5">
							<VRadioGroup v-model="form.changingRange" inline>
                                <VRadio label="Urgent" color="error" value="Urgent" />
                                <VRadio label="Caution" color="warning" value="Caution" />
                                <VRadio label="Normal" color="success" value="Normal" />
                            </VRadioGroup>
							<VBtn type="submit">Confirm</VBtn>
						</VCol>
					</VRow>
				</VForm>
			</VCardText>
		</VCard>
	</VDialog>
</template>
