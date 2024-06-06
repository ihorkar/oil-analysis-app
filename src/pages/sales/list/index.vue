<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import avatar8 from '@images/avatars/avatar-8.png'
import PreviewSampleDialog from '@/components/dialogs/PreviewSampleDialog.vue'

const logisticData = ref([
  { icon: 'tabler-ticket', color: 'primary', title: 'Received Today', value: 42, isHover: false },
  { icon: 'tabler-car', color: 'info', title: 'Dispatched Today', value: 8, isHover: false },
  { icon: 'tabler-hourglass', color: 'warning', title: 'Delivered Today', value: 27, isHover: false },
  { icon: 'tabler-thumb-up', color: 'success', title: 'Reviewed Today', value: 13, isHover: false },
])

// Data table Headers
const headers = [
  { title: 'Reference', key: 'data' },
  { title: 'Customer Company', key: 'company' },
  { title: 'Oil Brand', key: 'oilBrand' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const searchQuery = ref('')
const isPreviewSampleDialogVisible = ref(false)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

let oilSamples = ref()
let totalSamples = ref()
let originalOilSamples: any
const previewedSample = ref()

const resolveStatus = (status: string) => {
  if (status === 'sales_received')
    return { text: 'Received', color: 'primary' }
  if (status === 'test_received')
    return { text: 'Dispatched', color: 'info' }
  if (status === 'test_assigned' || status === 'reviewed')
    return { text: 'Under process', color: 'warning' }
  if (status === 'completed')
    return { text: 'Completed', color: 'success' }
}

const getDate = (dateValue: any) => {
    const year = String(dateValue.getFullYear())
    const month = String(dateValue.getMonth() + 1)
    const date = String(dateValue.getDate())
    
    return `${year}-${month}-${date}`
}

const previewSample = (id: number) => {
  isPreviewSampleDialogVisible.value = true;
  const sample = originalOilSamples.find((item: any) => {
    return item.id === id
  })
  previewedSample.value = sample
}

const downloadPDFReport = (id: number) => {
  const sample = originalOilSamples.filter((item: any) => {
    return item.id === id
  })
  let downloadReport: any = document.getElementById('labelDownloadLink')
  downloadReport.href = sample[0].attributes.report;
  downloadReport.download = `${sample[0].attributes.reference}-report.pdf`
  downloadReport.click()
}

const exportCSV = async (id: number) => {
  const sample = originalOilSamples.filter((item: any) => {
    return item.id === id
  })
  // Get CSV File
  const getCSVFileURI = '/api/oil-samples/get-csv'
  let csvData = await $api(getCSVFileURI, {
    method: 'post',
    headers: {
      authorization: `Bearer ${jwtToken}`
    },
    body: {
      data: {reference: sample[0].attributes.reference}
    },
    onResponse(res) {
      const blob = new Blob([res.response._data], { type: 'text/csv' });
      let downloadCSVFile: any = document.getElementById('labelDownloadLink')
      const url = window.URL.createObjectURL(blob);
      downloadCSVFile.href = url;
      downloadCSVFile.download = `${sample[0].attributes.reference}.csv`
      downloadCSVFile.click()
    },
    onResponseError(error) {
      console.log(222, error)
    }
  })
}

const jwtToken = useCookie('jwt').value;
const oilSampleURI = '/api/oil-samples'

const fetchOilSamples = async () => {
  let oilSampleData = await $api(oilSampleURI, {
    headers: {
      authorization: `Bearer ${jwtToken}`
    }
  })
  originalOilSamples = oilSampleData.data
  oilSamples.value = oilSampleData.data.filter((item: any) => {
    return item.attributes.status !== 'created'
  }).map((item: any) => {
    return {
      id: item.id,
      data: item.attributes,
      company: item.attributes.company,
      oilBrand: item.attributes.oil_brand,
      status: item.attributes.status
    }
  })
  totalSamples = oilSamples.value.length

  // Setting logistic data
  const todayOilSamples = originalOilSamples.filter((item: any) => {
    const inputDate = getDate(new Date(item.attributes.timestamp))
    const todaydate = getDate(new Date())
    return inputDate === todaydate
  })
  const todayReceivedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'sales_received'
  })
  const todayDispatchedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'test_received'
  })
  const todayUnderProcessOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status !== 'sales_received' && item.attributes.status !== 'test_received'
  })
  const todayCompletedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'completed'
  })
  const logisticInfo = [
    { icon: 'tabler-ticket', color: 'primary', title: 'Received Today', value: todayReceivedOilSamples.length, isHover: false },
    { icon: 'tabler-car', color: 'info', title: 'Dispatched Today', value: todayDispatchedOilSamples.length, isHover: false },
    { icon: 'tabler-hourglass', color: 'warning', title: 'Delivered Today', value: todayUnderProcessOilSamples.length, isHover: false },
    { icon: 'tabler-thumb-up', color: 'success', title: 'Reviewed Today', value: todayCompletedOilSamples.length, isHover: false },
  ]
  logisticData.value = logisticInfo
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
                        <div>
                            <AppTextField
                                v-model="searchQuery"
                                style="max-inline-size: 200px; min-inline-size: 200px;"
                                placeholder="Search .."
                                density="compact"
                            />
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
                    <template #item.data="{ item }">
                        <div class="d-flex align-center gap-x-3">
                            <div class="d-flex flex-column">
                              <div>
                                <h6 class="text-h6 cursor-pointer" @click="previewSample(item.id)">
                                  {{ item.data.reference }}
                                </h6>
                                <div class="text-sm text-disabled">
                                  {{ item.data.oil_type }}
                                </div>
                              </div>
                            </div>
                        </div>
                    </template>

                    <template #item.company="{ item }">
                        {{ item.company }}
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
                                        v-if="item.status === 'completed'"
                                        value="view"
                                        @click="downloadPDFReport(item.id)"
                                    >
                                        Download Report
                                    </VListItem>
                                    <VListItem
                                        v-if="item.status === 'completed'"
                                        value="view"
                                        @click="exportCSV(item.id)"
                                    >
                                        Export CSV
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
        <PreviewSampleDialog v-model:is-dialog-visible="isPreviewSampleDialogVisible" v-model:previewedSample="previewedSample"/>
        <a id="labelDownloadLink"></a>
    </VRow>
</template>