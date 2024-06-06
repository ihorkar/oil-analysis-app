<script setup lang="ts">
// import { el } from '@fullcalendar/core/internal-common';

interface UserData {
  id: number | null
  fullName: string
  company: string
  username: string
  role: string
  country: string
  contact: string
  email: string
  currentPlan: string
  status: string
  avatar: string
  taskDone: number | null
  projectDone: number | null
  taxId: string
  language: string
}

interface FormData {
    sample_point: string | null,
    equipment: string | null,
    model_type: string | null,
    sample_id: string,
    lub_name: string,
    batch_numbers: string,
    hours_unit: string,
    hours_on_oil: string,
    oil_type: string | null,
    del_date: string,
    oil_brand: string
}

interface Props {
  userData?: UserData
  isDialogVisible: boolean
}

const jwtToken = useCookie('jwt').value

interface Emit {
  (e: 'submit', value: UserData): void
  (e: 'update:isDialogVisible', val: boolean): void
  (e: 'update:isFetchOilSamples', value: boolean): void
}

interface collectionItem {
    id: number,
    attributes: {
        name: String
    }
}

const props = withDefaults(defineProps<Props>(), {
  userData: () => ({
    id: 0,
    fullName: '',
    company: '',
    role: '',
    username: '',
    country: '',
    contact: '',
    email: '',
    currentPlan: '',
    status: '',
    avatar: '',
    taskDone: null,
    projectDone: null,
    taxId: '',
    language: '',
  }),
})

let samplePointsOptions: Array<String>
let equUsedOptions: Array<String>
let modelTypesOptions: Array<String>
let oilTypesOptions: Array<String>

const emit = defineEmits<Emit>()

const refVForm = ref<VForm>()
const userData = ref<UserData>(structuredClone(toRaw(props.userData)))

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

const form = ref({
    sample_point: null,
    equipment: null,
    model_type: null,
    sample_id: '',
    lub_name: '',
    batch_numbers: '',
    hours_unit: '',
    hours_on_oil: '',
    oil_type: null,
    del_date: '',
    oil_brand: ''
})

const createOilSample = async (formData: FormData) => {
    const res = await $api('/api/oil-samples', {
        method: 'post',
        headers: {
            authorization: `Bearer ${jwtToken}`
        },
        body: {data: formData},
        onResponseError({ response }) {
            console.log(3333333, response._data.errors)
        },
        onResponse(response) {
            emit('update:isFetchOilSamples', true)
        }
    })
}

const onFormSubmit = () => {
    refVForm.value?.validate()
    .then(({ valid: isValid }) => {
        if (isValid){
            emit('update:isDialogVisible', false)
            createOilSample(form.value)
        }
    })  
}

const onFormCancel = () => {
  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

// onMounted(async () => {
const auth_header = {
    headers: {
        authorization: `Bearer ${jwtToken}`
    }
}

const samplePointsURI = '/api/sample-points'
const equipmentsURI = '/api/equipments'
const modelTypesURI = '/api/model-types'
const oilTypeURI = '/api/oil-types'

const samplePoints = await $api(samplePointsURI, auth_header)
const equipments = await $api(equipmentsURI, auth_header)
const modelTypes = await $api(modelTypesURI, auth_header)
const oilTypes = await $api(oilTypeURI, auth_header)

samplePointsOptions = samplePoints.data.map((item: collectionItem) => {
    return item.attributes.name;
})
equUsedOptions = equipments.data.map((item: collectionItem) => {
    return item.attributes.name;
})
modelTypesOptions = modelTypes.data.map((item: collectionItem) => {
    return item.attributes.name;
})
oilTypesOptions = oilTypes.data.map((item: collectionItem) => {
    return item.attributes.name;
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 677"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />
    {{ form.sample_point }}
    <VCard class="pa-sm-8 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          Add Oil Sample Detail
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm ref="refVForm" @submit.prevent="onFormSubmit">
            <VRow>
            <!-- 👉 Rig Name -->
            <VCol
                cols="6"
            >
                <AppSelect
                    v-model="form.sample_point"
                    :items="samplePointsOptions"
                    :rules="[requiredValidator]"
                    label="Sample Point"
                    placeholder="Select Item"
                />
            </VCol>

            <!-- 👉 Equipment Used -->
            <VCol
                cols="6"
            >
                <AppSelect
                    v-model="form.equipment"
                    :items="equUsedOptions"
                    :rules="[requiredValidator]"
                    label="Equipment Used"
                    placeholder="Select Item"
                />
            </VCol>

            <!-- 👉 Model Type -->
            <VCol
                cols="6"
            >
                <AppSelect
                    v-model="form.model_type"
                    :items="modelTypesOptions"
                    :rules="[requiredValidator]"
                    label="Model Type"
                    placeholder="Select Item"
                />
            </VCol>

            <!-- 👉 Sample Id -->
            <VCol
                cols="6"
            >
                <AppTextField
                    v-model="form.sample_id"
                    :rules="[requiredValidator]"
                    label="Sample Id"
                    placeholder="Sample Id"
                />
            </VCol>

            <!-- 👉 Country -->
            <VCol
                cols="6"
            >
                <AppTextField
                    v-model="form.lub_name"
                    :rules="[requiredValidator]"
                    label="Lubricant Name"
                    placeholder="Lubricant Name"
                />
            </VCol>

            <!-- 👉 Batch Numbers -->
            <VCol
                cols="6"
            >
                <AppTextField
                    v-model="form.batch_numbers"
                    :rules="[requiredValidator]"
                    label="Batch Numbers"
                    placeholder="Batch Numbers"
                />
            </VCol>

            <!-- 👉 Hrs Unit -->
            <VCol
                cols="6"
            >
                <AppTextField
                    v-model="form.hours_unit"
                    :rules="[requiredValidator]"
                    label="Hrs Unit"
                    placeholder="Hrs Unit"
                />
            </VCol>

            <!-- 👉 Hrs On Oil -->
            <VCol
                cols="6"
            >
                <AppTextField
                    v-model="form.hours_on_oil"
                    :rules="[requiredValidator]"
                    label="Hrs On Oil"
                    placeholder="Hrs On Oil"
                />
            </VCol>

            <!-- 👉 Types Of Oil -->
            <VCol
                cols="6"
            >
                <AppSelect
                    v-model="form.oil_type"
                    :items="oilTypesOptions"
                    :rules="[requiredValidator]"
                    label="Types Of Oil"
                    placeholder="Select Item"
                />
            </VCol>

            <!-- 👉 Deliery Date -->
            <VCol
                cols="6"
            >
                <AppDateTimePicker
                    v-model="form.del_date"
                    :rules="[requiredValidator]"
                    label="Delivery Date"
                    placeholder="Delivery Date"
                />
            </VCol>

            <!-- 👉 Oil Brand -->
            <VCol
                cols="6"
            >
                <AppTextField
                    v-model="form.oil_brand"
                    :rules="[requiredValidator]"
                    label="Oil Brand"
                    placeholder="Oil Brand"
                />
            </VCol>

            <VCol
                cols="12"
                class="d-flex gap-4"
            >
                <VBtn type="submit">
                    Submit
                </VBtn>

                <VBtn
                    type="reset"
                    color="secondary"
                    variant="tonal"
                    @click="onFormCancel"
                >
                    Cancel
                </VBtn>
            </VCol>
            </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
