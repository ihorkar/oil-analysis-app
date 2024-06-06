<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

import ECommerceAddCustomerDrawer from '@/pages/customer/view/ECommerceAddCustomerDrawer.vue'
import PreviewSampleDialog from '@/pages/customer/view/PreviewSampleDialog.vue'

const searchQuery = ref('')
const isPreviewSampleDialogVisible = ref(false)

let oilSamples = ref()
let totalSamples = ref()
let originalOilSamples = ref()
const previewedSample = ref()

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const logisticData = ref()

// Data table Headers
const headers = [
  { title: 'Reference', key: 'reference' },
  { title: 'Model Type', key: 'modelType' },
  { title: 'Equipment Type', key: 'equType' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const resolveStatus = (status: string) => {
  if (status === 'sales_received') {
    return { text: 'In-Route', color: 'info' }
  } else {
    if (status === 'completed') {
      return { text: 'Completed', color: 'success' }
    } if (status === 'created') {
      return { text: 'Request', color: 'primary' }
    } else {
      return { text: 'Under Process', color: 'warning' }
    }      
  } 
}

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const previewSample = (id: number) => {
  isPreviewSampleDialogVisible.value = true;
  const sample = originalOilSamples.value.find((item: any) => {
    return item.id === id
  })
  previewedSample.value = sample
}

const downloadLabel = (id: number) => {
  const sample = originalOilSamples.value.find((item: any) => {
    return item.id === id
  })
  let downloadLabel: any = document.getElementById('labelDownloadLink')
  downloadLabel.href = sample.attributes.label;
  downloadLabel.download = `${sample.attributes.reference}.png`
  downloadLabel.click();
}

const downloadPDFReport = (id: number) => {
  const sample = originalOilSamples.value.filter((item: any) => {
    return item.id === id
  })
  let downloadReport: any = document.getElementById('labelDownloadLink')
  downloadReport.href = sample[0].attributes.report;
  downloadReport.download = `${sample[0].attributes.reference}-report.pdf`
  downloadReport.click();
}

const jwtToken = useCookie('jwt').value;
const userId = useCookie('userData').value?.id
const oilSampleURI = `/api/oil-samples?filters[customer_id][$eq]=${userId}`

const fetchOilSamples = async () => {
  let oilSampleData = await $api(oilSampleURI, {
    headers: {
      authorization: `Bearer ${jwtToken}`
    }
  })
  originalOilSamples.value = oilSampleData.data
  oilSamples.value = oilSampleData.data.map((item: any) => {
    return {
      id: item.id,
      reference: item.attributes.reference,
      modelType: item.attributes.model_type,
      equType: item.attributes.equipment,
      status: item.attributes.status,
      oilType: item.attributes.oil_type
    }
  })
  totalSamples = oilSamples.value.length

  // Setting logistic data
  const totalNum = oilSampleData.data.filter((item: any) => {
    const date = new Date(item.attributes.timestamp)
    const now = new Date()
    if(date.getFullYear() == now.getFullYear()) {
      return true
    }
  });
  const inRouteSamples = oilSampleData.data.filter((item: any) => {
    const date = new Date(item.attributes.timestamp)
    const now = new Date()
    if(date.getMonth() == now.getMonth() && item.attributes.status === 'sales_received') {
      return true
    }
  })
  const underProcessSamples = oilSampleData.data.filter((item: any) => {
    const date = new Date(item.attributes.timestamp)
    const now = new Date()
    return date.getMonth() == now.getMonth() && (item.attributes.status !== 'sales_received' && item.attributes.status !== 'completed' && item.attributes.status !== 'created')
  })
  const completedSamples = oilSampleData.data.filter((item: any) => {
    const date = new Date(item.attributes.timestamp)
    const now = new Date()
    if(date.getFullYear() == now.getFullYear() && item.attributes.status === 'completed') {
      return true
    }
  })
  const logisticInfo = [
    { icon: 'tabler-ticket', color: 'primary', title: 'Total Requests', value: totalNum.length, isHover: false },
    { icon: 'tabler-car', color: 'info', title: 'In-Route Samples', value: inRouteSamples.length, isHover: false },
    { icon: 'tabler-hourglass', color: 'warning', title: 'Under Process', value: underProcessSamples.length, isHover: false },
    { icon: 'tabler-thumb-up', color: 'success', title: 'Completed Reports', value: completedSamples.length, isHover: false },
  ]
  logisticData.value = logisticInfo
}

const trackModalVisible = () => {
  fetchOilSamples()
}

fetchOilSamples()

onUpdated(() => {
  fetchOilSamples()
})
</script>

<template>
  <VRow class="match-height">
    <VCol cols="12">
      <VRow>
        <VCol
          v-for="(data, index) in logisticData"
          :key="index"
          cols="12"
          md="3"
          sm="6"
        >
          <div>
            <VCard
              class="logistics-card-statistics cursor-pointer"
              :style="data.isHover ? { 'border-block-end': `2px solid rgba(var(--v-theme-${data.color}))` } : { 'border-block-end': `2px solid rgba(var(--v-theme-${data.color}), var(--v-disabled-opacity))` }"
              @mouseenter="data.isHover = true"
              @mouseleave="data.isHover = false"
            >
              <VCardText>
                <div class="d-flex align-center gap-x-4 mb-2">
                  <VAvatar
                    variant="tonal"
                    :color="data.color"
                    rounded
                  >
                    <VIcon
                      :icon="data.icon"
                      size="28"
                    />
                  </VAvatar>
                  <h5 class="text-h5 font-weight-medium">
                    {{ data.value }}
                  </h5>
                </div>
                <div class="text-body-1">
                  {{ data.title }}
                </div>
              </VCardText>
            </VCard>
          </div>
        </VCol>
      </VRow>
    </VCol>
    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex justify-space-between flex-wrap gap-y-4">
            <VCardTitle>Oil Samples</VCardTitle>
            <div class="d-flex flex-row gap-4 align-center flex-wrap">
              <AppTextField
                v-model="searchQuery"
                style="max-inline-size: 200px; min-inline-size: 200px;"
                placeholder="Search .."
                density="compact"
              />
              <VBtn
                prepend-icon="tabler-plus"
                @click="$router.push('/customer/add')"
              >
                Add Sample
              </VBtn>
            </div>
          </div>
        </VCardText>

        <VDivider />
        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :items="oilSamples"
          :headers="headers"
          :items-length="totalSamples"
          show-select
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.reference="{ item }">
            <div class="d-flex align-center gap-x-3">
              <div>
                <h6 class="text-h6 cursor-pointer" @click="previewSample(item.id)">
                  {{ item.reference }}
                </h6>
                <div class="text-sm text-disabled">
                  {{ item.oilType }}
                </div>
              </div>
            </div>
          </template>

          <template #item.modelType="{ item }">
            {{ item.modelType }}
          </template>

          <template #item.equType="{ item }">
            {{ item.equType }}
          </template>

          <template #item.status="{ item }">
            <VChip
                v-bind="resolveStatus(item.status)"
                label
            />
          </template>

          <template #item.totalSpent="{ item }">
            <span class="text-body-1 font-weight-medium text-high-emphasis">${{ item.totalSpent }}</span>
          </template>

          <template #item.actions="{ item }">
              <IconBtn>
                  <VIcon icon="tabler-dots-vertical" />
                  <VMenu activator="parent">
                    <VList>
                      <VListItem
                          value="view"
                          @click="previewSample(item.id)"
                      >
                        View
                      </VListItem>
                      <VListItem
                          value="view"
                          @click="downloadPDFReport(item.id)"
                      >
                        Download Report
                      </VListItem>
                      <VListItem
                          value="delete"
                          @click="downloadLabel(item.id)"
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
    <PreviewSampleDialog v-model:is-dialog-visible="isPreviewSampleDialogVisible" @update:is-dialog-visible="trackModalVisible" v-model:previewedSample="previewedSample"/>
    <a id="labelDownloadLink"></a>
  </VRow>
</template>
