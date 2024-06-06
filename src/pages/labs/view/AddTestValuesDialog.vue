

<script setup lang="ts">
import { colorToString } from '@iconify/utils';
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

interface Props {
  userData?: UserData
  isDialogVisible: boolean
}

interface Emit {
  (e: 'submit', value: UserData): void
  (e: 'update:isDialogVisible', val: boolean): void
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

const emit = defineEmits<Emit>()

const userData = ref<UserData>(structuredClone(toRaw(props.userData)))
const isUseAsBillingAddress = ref(false)

const samplePointsOptions = ['JV-1 Lovanda', 'JV-2 Lovanda']
const equUsedOptions = ['Air Compressor #1', 'Air Compressor #2']
const modelTypesOptions = ['Atlas Copco GA 110', 'Atlas Copco GA 120']
const typesOfOilOptions = ['Oil Type 1', 'Oil Type 2']

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', userData.value)
}

const onFormReset = () => {
  userData.value = structuredClone(toRaw(props.userData))

  emit('update:isDialogVisible', false)
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 960"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-8 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h3 mb-3">
          Add Test Values
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol
              cols="12"
              md="4"
            >
              <AppSelect
                  :items="samplePointsOptions"
                  label="Sample Point"
                  placeholder="Select Item"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="4"
            >
              <AppSelect
                  :items="equUsedOptions"
                  label="Equipment Used"
                  placeholder="Select Item"
              />
            </VCol>
            <!-- 👉 Billing Email -->
            <VCol
              cols="12"
              md="4"
            >
              <AppSelect
                  :items="modelTypesOptions"
                  label="Model Type"
                  placeholder="Select Item"
              />
            </VCol>

            <VCol cols="12">
                <VcardText>Physical And Chemical Properties</VcardText>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="userData.fullName"
                placeholder="Name"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="userData.username"
                placeholder="Method Used"
              />
            </VCol>
            <!-- 👉 Billing Email -->
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="userData.email"
                placeholder="Unit"
              />
            </VCol>

            <VCol cols="12">
                <VcardText>Metal Analytics</VcardText>
            </VCol>

            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="userData.fullName"
                placeholder="Name"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="userData.username"
                placeholder="Method Used"
              />
            </VCol>
            <!-- 👉 Billing Email -->
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                v-model="userData.email"
                placeholder="Unit"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit">
                Submit
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
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
