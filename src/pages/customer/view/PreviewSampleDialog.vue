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

const userData = ref<UserData>(structuredClone(toRaw(props.userData)))
let sampleData = ref()
let selectedStatus = ref()
const statusOptions = [
  { status: 'Mark As Created', value: 'created' },
  { status: 'Mark As Dispatched', value: 'sales_received' }
]

watch(props, () => {
  userData.value = structuredClone(toRaw(props.userData))
})

const onFormSubmit = () => {
  emit('update:isDialogVisible', false)
  emit('submit', userData.value)
}

const jwtToken = useCookie('jwt').value

const setStatus = () => {
  const { id } = props.previewedSample
  const updateURI = `/api/oil-samples/${id}`
  const res = $api(updateURI, {
    method: 'put',
    headers: {
      authorization: `Bearer ${jwtToken}`
    },
    body: { 
      data: {
        status: selectedStatus.value.value,
      }
    }
  })
}

const dialogModelValueUpdate = (val: boolean) => {
  emit('update:isDialogVisible', val)
}

onMounted(() => {
  
})

onUpdated(() => {
  if(props.previewedSample) {
    const { attributes } = props.previewedSample

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

    if(attributes.status == 'created') {
      selectedStatus.value = statusOptions[0]
    } else {
      selectedStatus.value = statusOptions[1]
    }

    console.log(selectedStatus.value, '1111111111')
  }
})
</script>

<template>
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 677" :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-8 pa-5" v-bind="props.previewedSample.attributes">
      <VCardItem>
        <VCardTitle class="d-flex justify-space-between align-center text-h3 mb-3">
          <div>
            <div class="mb-1">{{ props.previewedSample.attributes.reference }}</div>
            <div class="text-h6">
              {{ props.previewedSample.attributes.oil_type }} | 
              {{ props.previewedSample.attributes.lub_name }}
            </div>
          </div>
          <QrcodeVue :value="props.previewedSample.attributes.reference" :size="80" level="H"></QrcodeVue>
        </VCardTitle>
      </VCardItem>

      <VDivider />

      <VCardText>
        <!-- 👉 Form -->
        <VForm class="mt-6" @submit.prevent="onFormSubmit">
          <VRow>
            <VCol cols="12">
              <VList class="card-list">
                <VListItem v-for="item in sampleData" :key="item.property">
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
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <VCardItem>
        <div class="d-flex justify-space-between">
          <div class="d-flex gap-3">
            <AppSelect
              v-model="selectedStatus"
              :items="statusOptions"
              item-title="status"
              @update:model-value="setStatus"
              return-object
              single-line
              placeholder="Select State"
            />
          </div>
        </div>
      </VCardItem>
    </VCard>
  </VDialog>
</template>

<style scoped>
  .app-select {
    background-color: rgb(var(--v-theme-primary)) !important;
    /* background-color: grey !important; */
    color: rgb(var(--v-theme-on-primary)) !important;
    border-radius: 6px;
  }
  .v-field--variant-outlined .v-field__outline .v-field__outline__start {
    border: none;
  }
</style>