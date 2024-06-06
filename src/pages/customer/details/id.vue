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
  { title: 'Reference', key: 'reference' },
  { title: 'Sample Point', key: 'samplePoint' },
  { title: 'Oil Brand', key: 'oilBrand' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const samples = computed(() => [
    {
      id: 1,
      reference: 'QDJO19302020',
      samplePoint: 'RIG0001',
      oilBrand: 'Total Lubricants',
      status: 'Completed',
    },
    {
      id: 2,
      reference: 'QDJO19302020',
      samplePoint: 'RIG0001',
      oilBrand: 'Total Lubricants',
      status: 'Completed',
    },
    {
      id: 3,
      reference: 'QDJO19302020',
      samplePoint: 'RIG0001',
      oilBrand: 'Total Lubricants',
      status: 'Completed',
    },
    {
      id: 4,
      reference: 'QDJO19302020',
      samplePoint: 'RIG0001',
      oilBrand: 'Total Lubricants',
      status: 'Completed',
    },
    {
      id: 5,
      reference: 'QDJO19302020',
      samplePoint: 'RIG0001',
      oilBrand: 'Total Lubricants',
      status: 'Completed',
    },
])

const totalSamples = computed(() => 5)

const resolveStatus = (status: string) => {
  if (status === 'In-Route')
    return { text: status, color: 'info' }
  if (status === 'Under Process')
    return { text: status, color: 'warning' }
  if (status === 'Completed')
    return { text: status, color: 'success' }
}

const samplePointsOptions = ['JV-1 Lovanda', 'JV-2 Lovanda']
const equUsedOptions = ['Air Compressor #1', 'Air Compressor #2']
const modelTypesOptions = ['Atlas Copco GA 110', 'Atlas Copco GA 120']
const typesOfOilOptions = ['Oil Type 1', 'Oil Type 2']

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isCPasswordVisible = ref(false)

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
      <h3 class="text-h3 text-disabled mb-5">
        Microsoft<span class="font-weight-medium"> / Add New </span>
      </h3>
      <VCard>
        <VRow>
          <VCol
            cols="12"
            md="4"
            :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'"
          >
            <VCardText>
              <!-- 👉 Stepper -->
              <AppStepper
                v-model:current-step="currentStep"
                direction="vertical"
                :items="numberedSteps"
              />
            </VCardText>
          </VCol>
          <!-- 👉 stepper content -->
          <VCol
            cols="12"
            md="8"
          >
            <VCardText>
              <VForm>
                <VWindow
                  v-model="currentStep"
                  class="disable-tab-transition"
                >
                  <VWindowItem>
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">
                          Sample Details
                        </h6>
                        <p class="mb-0">
                          Add all the necessary information below
                        </p>
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppSelect
                        :items="samplePointsOptions"
                          placeholder="Select"
                          label="Sample Point*"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppSelect
                          :items="equUsedOptions"
                          placeholder="Select"
                          label="Equipment Used*"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppSelect
                          :items="modelTypesOptions"
                          placeholder="Select"
                          label="Model Type*"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.email"
                          placeholder="Optional"
                          label="Hrs Unit"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.email"
                          placeholder="Optional"
                          label="Hrs Oil"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.email"
                          placeholder="Optional"
                          label="Batch Number"
                        />
                      </VCol>
                    </VRow>
                  </VWindowItem>

                  <VWindowItem>
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">
                          Lubricants Details
                        </h6>
                        <p class="mb-0">
                          Add all the necessary information below
                        </p>
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.firstName"
                          label="Lubricant Name"
                          placeholder="Optional"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.lastName"
                          label="Oil Brand*"
                          placeholder="Oil Brand Name"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppSelect
                          :items="typesOfOilOptions"
                          placeholder="Select"
                          label="Types of Oil*"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.lastName"
                          label="Expected Report Date"
                          placeholder="Optional"
                        />
                      </VCol>

                      <VCol
                        cols="12"
                        md="6"
                      >
                        <AppTextField
                          v-model="formData.lastName"
                          label="Sample ID"
                          placeholder="Optional"
                        />
                      </VCol>
                    </VRow>
                  </VWindowItem>

                  <VWindowItem>
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">
                          Label Generation
                        </h6>
                        <p class="mb-0">
                          Please stick one label on the bottle and another on the can
                        </p>
                      </VCol>

                      <VCol cols="auto">
                        <div class="d-flex align-center gap-x-4 v-label">
                          <QrcodeVue value="QGUL2024000004HYD" :size="80" level="H"></QrcodeVue>
                          <div>
                            <div class="text-body-1 text-high-emphasis font-weight-medium">
                              QGUL2024000004HYD
                            </div>
                            <div class="label-date text-body-2 text-disabled">
                              2022-09-27 18:00:00.000
                            </div>
                            <div class="label-provider text-body-2 text-disabled">
                              website.com
                            </div>
                          </div>
                        </div>
                      </VCol>
                    </VRow>
                  </VWindowItem>
                </VWindow>

                <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                  <VBtn
                    color="secondary"
                    variant="tonal"
                    :disabled="currentStep === 0"
                    @click="currentStep--"
                  >
                    <VIcon
                      icon="tabler-arrow-left"
                      start
                      class="flip-in-rtl"
                    />
                    Previous
                  </VBtn>

                  <VBtn
                    v-if="numberedSteps.length - 1 === currentStep"
                    color="primary"
                    @click="onSubmit"
                  >
                    Generate
                  </VBtn>

                  <VBtn
                    v-else
                    @click="currentStep++"
                  >
                    Next

                    <VIcon
                      icon="tabler-arrow-right"
                      end
                      class="flip-in-rtl"
                    />
                  </VBtn>
                </div>
              </VForm>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex justify-space-between flex-wrap gap-y-4">
            <VCardTitle>Oil Samples</VCardTitle>
            <AppTextField
              v-model="searchQuery"
              style="max-inline-size: 200px; min-inline-size: 200px; flex-grow: 0;"
              placeholder="Search .."
              density="compact"
            />
          </div>
        </VCardText>

        <VDivider />
        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :items="samples"
          :headers="headers"
          :items-length="totalSamples"
          show-select
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.reference="{ item }">
            <div class="d-flex align-center gap-x-3">
              <div class="d-flex flex-column">
                <RouterLink
                  :to="{ name: 'customer-details-id', params: { id: 555 } }"
                  class="font-weight-medium"
                >
                  {{ item.reference }}
                </RouterLink>
                <span class="text-sm text-disabled">Compressor Oil</span>
              </div>
            </div>
          </template>

          <template #item.samplePoint="{ item }">
            {{ item.samplePoint }}
          </template>

          <template #item.oilBrand="{ item }">
            {{ item.oilBrand }}
          </template>

          <template #item.status="{ item }">
            <VChip
                v-bind="resolveStatus(item.status)"
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
                        View
                      </VListItem>
                      <VListItem
                          value="delete"
                          @click="deleteOrder(item.id)"
                      >
                        Label
                      </VListItem>
                  </VList>
                  </VMenu>
              </IconBtn>
          </template>

          <template #bottom>
            <VDivider />

            <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
              <p class="text-sm text-disabled mb-0">
                {{ paginationMeta({ page, itemsPerPage }, totalSamples) }}
              </p>

              <VPagination
                v-model="page"
                :length="Math.ceil(totalSamples / itemsPerPage)"
                :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalSamples / itemsPerPage), 5)"
              >
                <template #prev="slotProps">
                  <VBtn
                    variant="tonal"
                    color="default"
                    v-bind="slotProps"
                    :icon="false"
                  >
                    Previous
                  </VBtn>
                </template>

                <template #next="slotProps">
                  <VBtn
                    variant="tonal"
                    color="default"
                    v-bind="slotProps"
                    :icon="false"
                  >
                    Next
                  </VBtn>
                </template>
              </VPagination>
            </div>
          </template>
        </VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
  <PreviewSampleDialog v-model:isDialogVisible="isPreviewSampleDialogVisible" />
</template>

<style scoped>
.v-label {
  padding: 20px;
  border: 1px solid;
}
/* .v-label .label-provider, .v-label .label-date {
  font-size: 0.6rem;
} */
</style>