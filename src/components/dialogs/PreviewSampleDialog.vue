<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

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
  previewedSample: any
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

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

const userData = ref<UserData>(structuredClone(toRaw(props.userData)))
let sampleData = ref()

const statusOptions = [
  { status: 'Mark As Received', value: 'sales_received' }, 
  { status: 'Mark As Dispatched', value: 'test_received' }
]

const billableOptions = [
  { status: 'Non-Billable', value: false }, 
  { status: 'Billable', value: true }
]

let selectedStatus = ref()
let selectedBillable = ref()

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

const onSave = () => {
  const updateURI = `/api/oil-samples/${props.previewedSample.id}`
  const jwtToken = useCookie('jwt').value
  const res = $api(updateURI, {
    method: 'put',
    headers: {
      authorization: `Bearer ${jwtToken}`
    },
    body: { 
      data: {
        status: selectedStatus.value.value,
        billable: selectedBillable.value.value
      }
    },
    onResponseError({ response }) {
      console.log(3333333, response._data.errors)
    },
    onResponse(response) {
      dialogModelValueUpdate(false)
    },
  })
}

onUpdated(() => {
  if(props.previewedSample) {
    const { attributes } = props.previewedSample

    // Set oil sample data in modal
    sampleData.value = [
      { property: 'Sample Point', value: attributes?.sample_point },
      { property: 'Equipment Used', value: attributes?.equipment },
      { property: 'Model Type', value: attributes?.model_type },
      { property: 'Hrs Unit', value: attributes?.hours_unit },
      { property: 'Hrs Oil', value: attributes?.hours_on_oil },
      { property: 'Batch Number', value: attributes?.batch_numbers },
      { property: 'Sample ID', value: attributes?.sample_id },
      { property: 'Lubricants Name', value: attributes?.lub_name },
    ]

    //Format oil sample data
    let prevStatus
    let prevBillableStatus

    if(attributes.status === 'sales_received') {
      prevStatus = statusOptions[0]
    } else {
      prevStatus = statusOptions[1]
    }
    prevBillableStatus = billableOptions.filter((item: any) => {
      return item.value === attributes.billable
    })
    selectedStatus.value = prevStatus
    selectedBillable.value = prevBillableStatus
  }
})
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 677"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-8 pa-5">
      <VCardItem>
        <VCardTitle class="d-flex justify-space-between align-center text-h3 mb-3">
          <div>
            <div class="mb-1">{{ previewedSample.attributes.reference }}</div>
            <div class="text-h6">{{ previewedSample.attributes.oil_type }} | {{ previewedSample.attributes.lub_name }}</div>
          </div>
          <QrcodeVue :value="previewedSample.attributes.reference" :size="80" level="H"></QrcodeVue>
        </VCardTitle>
      </VCardItem>

      <VDivider class="mx-5"/>

      <VCardItem>
          <VList class="card-list py-6">
            <VListItem
              v-for="item in sampleData"
              :key="item.property"
            >
              <template #prepend>
                <span class="text-body-1 text-high-emphasis">
                  {{ item.property }}
                </span>
              </template>
              <template #append>
                <span class="text-body-1 text-high-emphasis">
                  {{ item.value }}
                </span>
              </template>
            </VListItem>
          </VList>
      </VCardItem>

      <VDivider class="mx-5"/>

      <VCardItem>
        <div class="d-flex justify-space-between">
          <div class="d-flex gap-3">
            <AppSelect
              v-model="selectedStatus"
              :items="statusOptions"
              item-title="status"
              return-object
              single-line
              placeholder="Select State"
            />
            <AppSelect
              v-model="selectedBillable"
              :items="billableOptions"
              item-title="status"
              return-object
              single-line
              placeholder="Select State"
            />
          </div>
          <VBtn @click="onSave">
            Save
          </VBtn>
        </div>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<style scoped>
  .app-select {
    background-color: rgb(var(--v-theme-primary)) !important;
    color: rgb(var(--v-theme-on-primary)) !important;
    border-radius: 6px;
  }
  .v-field--variant-outlined .v-field__outline .v-field__outline__start {
    border: none;
  }
</style>