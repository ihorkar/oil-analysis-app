<script setup lang="ts">
import PreviewSampleDialog from '@/pages/customer/view/PreviewSampleDialog.vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import QrcodeVue from 'qrcode.vue';

const route = useRoute('apps-ecommerce-customer-details-id')
// const customerData = ref<Customer>()
const userTab = ref(null)

// const { data, error } = await useApi<Customer>(`/apps/ecommerce/customers/${route.params.id}`)

// if (error.value)
//   console.log(error.value)
// else if (data.value)
//   customerData.value = data.value

const isPreviewSampleDialogVisible = ref(false)

const numberedSteps = [
  {
    title: 'Sample Details',
    subtitle: 'Equipment, Model & Point',
  },
  {
    title: 'Lubricant Details',
    subtitle: 'Brand Name, Type, Units',
  },
  {
    title: 'Label Generation',
    subtitle: 'QR Code, Reference Number',
  },
]

const searchQuery = ref('')

const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'Test', key: 'test' },
  { title: 'Units', key: 'units' },
  { title: 'Method', key: 'method' },
  { title: 'Values', key: 'values' },
  { title: 'Range', key: 'range' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const Props_analysis = computed(() => [
    {
      id: 1,
      test: 'Aluminium',
      units: 'AI',
      method: 'ASTM D6595',
      values: '0.68',
      range: 'Normal',
    },
    {
      id: 2,
      test: 'Aluminium',
      units: 'AI',
      method: 'ASTM D6595',
      values: '0.68',
      range: 'Caution',
    },
    {
      id: 3,
      test: 'Aluminium',
      units: 'AI',
      method: 'ASTM D6595',
      values: '0.68',
      range: 'High',
    },
    {
      id: 4,
      test: 'Aluminium',
      units: 'AI',
      method: 'ASTM D6595',
      values: '0.68',
      range: 'Normal',
    },
    {
      id: 5,
      test: 'Aluminium',
      units: 'AI',
      method: 'ASTM D6595',
      values: '0.68',
      range: 'Normal',
    },
])

const resolveStatus = (status: string) => {
  if (status === 'Normal')
    return { text: status, color: 'success' }
  if (status === 'Caution')
    return { text: status, color: 'error' }
  if (status === 'High')
    return { text: status, color: 'warning' }
}

let csvFile = ref()
const chooseFiles = () => {
  document.getElementById('csvFile')?.click()
}
const onFileChange = (e: any) => {
  csvFile = e.target.files[0];
  console.log(csvFile)
}

const sampleDetails = [
  { key: 'Sample Point', value: 'Rign 001293i' },
  { key: 'Model Type', value: 'Argos' },
  { key: 'Hrs Oil', value: '577' },
  { key: 'Hrs Oil', value: 'Argos' },
  { key: 'Company Name', value: 'Atlantis Unlimited' },
  { key: 'Equipment Used', value: 'Lambada Equipment' },
  { key: 'Hrs Unit', value: '56' },
  { key: 'Sample ID', value: 'GDI0564666666848' },
  { key: 'Batch Number', value: '258658-29871-85' },
  { key: 'Oil Type', value: 'Hydarulic Oil' },
]

const formData = ref({
  username: '',
  email: '',
  password: '',
  cPassword: '',
  firstName: '',
  lastName: '',
  country: undefined,
  language: undefined,
  twitter: '',
  facebook: '',
  googlePlus: '',
  linkedIn: '',

})

const selectedRadio = ref('normal')

const onSubmit = () => {
  console.log(formData.value)
}
const deleteOrder = async (id: number) => {
  await $api(`/apps/ecommerce/orders/${id}`, {
    method: 'DELETE',
  })
  // fetchOrders()
}
</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="d-flex justify-space-between">
        <div>
          <h3 class="text-h3 text-disabled mb-5">
            Technical<span class="font-weight-medium"> / Enter Results </span>
          </h3>
          <h4 class="text-h4 text-high-emphasis mb-5">
            QGDI2024000006HYD
          </h4>
        </div>
        <QrcodeVue value="QGUL2024000004HYD" :size="80" level="H"></QrcodeVue>
      </div>
      <div class="d-flex justify-space-between">
        <VBtn class="text-body-1">
          Mark As Completed
          <VIcon
            end
            icon="tabler-chevron-down"
          />
        </VBtn>
        <div class="text-body-1">
          <VFileInput id="csvFile" class="hidden" @change="(e: any) => onFileChange(e)"></VFileInput>
          {{ csvFile? csvFile : null }}
          <VBtn @click="chooseFiles">Save</VBtn>
        </div>
      </div>
    </VCol>
    <VCol cols="12">
      <VCard title="OVERALL STATUS">
        <template #append>
          <VRadioGroup v-model="selectedRadio" inline>
            <VRadio label="Urgent" color="error" value="urgent" />
            <VRadio label="Caution" color="warning" value="caution" />
            <VRadio label="Normal" color="success" value="normal" />
          </VRadioGroup>
        </template>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <AppTextarea
                placeholder="Leave a status"
              />
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard title="Sample Details">
        <template #append>
          <span class="text-sm text-disabled">Date Issued: 01-19-2024 14:30 PM</span>
        </template>
        <VDivider />
        <VCardText class="pt-6">
          <VRow>
            <VCol
              v-for="item in sampleDetails"
              :key="item.key"
              cols="6"
              md="auto"
              class="sample-item-width"
            >
              <div class="d-flex align-center gap-4">
                <div class="d-flex flex-column">
                  <span class="text-md font-weight-medium">{{ item.key }}</span>
                  <span class="text-sm">
                    {{ item.value }}
                  </span>
                </div>
              </div>
            </VCol>
            <VSpacer></VSpacer>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard>
        <VCardText>
            <VCardTitle>PHYSICAL AND CHEMICAL PROPERTIES</VCardTitle>
        </VCardText>

        <VDivider />
        <VDataTableServer
          :items="Props_analysis"
          :headers="headers"
          :items-length="1"
          show-select
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.test="{ item }">
            {{ item.test }}
          </template>

          <template #item.units="{ item }">
            {{ item.units }}
          </template>

          <template #item.method="{ item }">
            {{ item.method }}
          </template>

          <template #item.values="{ item }">
            {{ item.values }}
          </template>

          <template #item.range="{ item }">
            <VChip
                v-bind="resolveStatus(item.range)"
                label
            />
          </template>

          <template #item.actions="{ item }">
              <IconBtn>
                  <VIcon icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                  <VList>
                      <VListItem
                          value="view"
                      >
                        Edit Values
                      </VListItem>
                  </VList>
                  </VMenu>
              </IconBtn>
          </template>

          <template #bottom>

          </template>
        </VDataTableServer>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
            <VCardTitle>METAL ANALYSIS</VCardTitle>
        </VCardText>

        <VDivider />
        <VDataTableServer
          :items="Props_analysis"
          :headers="headers"
          :items-length="1"
          show-select
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.test="{ item }">
            {{ item.test }}
          </template>

          <template #item.units="{ item }">
            {{ item.units }}
          </template>

          <template #item.method="{ item }">
            {{ item.method }}
          </template>

          <template #item.values="{ item }">
            {{ item.values }}
          </template>

          <template #item.range="{ item }">
            <VChip
                v-bind="resolveStatus(item.range)"
                label
            />
          </template>

          <template #item.actions="{ item }">
              <IconBtn>
                  <VIcon icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                  <VList>
                      <VListItem
                          value="view"
                          @click="isPreviewSampleDialogVisible=!isPreviewSampleDialogVisible"
                      >
                        Edit Values
                      </VListItem>
                  </VList>
                  </VMenu>
              </IconBtn>
          </template>

          <template #bottom>

          </template>
        </VDataTableServer>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
            <VCardTitle>FITR</VCardTitle>
        </VCardText>

        <VDivider />
        <VDataTableServer
          :items="Props_analysis"
          :headers="headers"
          :items-length="1"
          show-select
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.test="{ item }">
            {{ item.test }}
          </template>

          <template #item.units="{ item }">
            {{ item.units }}
          </template>

          <template #item.method="{ item }">
            {{ item.method }}
          </template>

          <template #item.values="{ item }">
            {{ item.values }}
          </template>

          <template #item.range="{ item }">
            <VChip
                v-bind="resolveStatus(item.range)"
                label
            />
          </template>

          <template #item.actions="{ item }">
              <IconBtn>
                  <VIcon icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                  <VList>
                      <VListItem
                          value="view"
                          @click="isPreviewSampleDialogVisible=!isPreviewSampleDialogVisible"
                      >
                        Edit Values
                      </VListItem>
                  </VList>
                  </VMenu>
              </IconBtn>
          </template>

          <template #bottom>

          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
  <PreviewSampleDialog v-model:isDialogVisible="isPreviewSampleDialogVisible" />
</template>

<style scoped>
.sample-item-width {
  width: 20% !important;
}

.hidden {
  display: none;
}
</style>