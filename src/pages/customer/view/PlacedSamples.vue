<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

const searchQuery = ref('')

// Data table options
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
  { title: 'Sample', key: 'sampleID' },
  { title: 'Date', key: 'date' },
  { title: 'Billable', key: 'billable' },
  { title: 'Status', key: 'status' }

]

const samples = computed(() => [
    {
      id: 1,
      sampleID: 5434,
      customer: 'Gabrielle Feyer',
      email: 'gfeyer0@nyu.edu',
      isBillable: 'No',
      status: 'Delivered',
      date: '5/16/2022',
      time: '2:11 AM',
    },
])

const totalSamples = computed(() => 1)

const resolveBillable = (billable: string) => {
  if(billable === 'Yes') 
    return { text: billable, color: 'success'}
  if(billable === 'No')
    return { text: billable, color: 'warning'}
}

const resolveStatus = (status: string) => {
  if (status === 'Delivered')
    return { text: status, color: 'success' }
  if (status === 'Out for Delivery')
    return { text: status, color: 'primary' }
  if (status === 'Ready to Pickup')
    return { text: status, color: 'info' }
  if (status === 'Dispatched')
    return { text: status, color: 'warning' }

}
</script>


<template>
  <VCard>
    <VCardText>
      <div class="d-flex justify-sm-space-between justify-start flex-wrap gap-4 align-center">
        <h5 class="text-h5">Samples placed</h5>
        <VTextField
          v-model="searchQuery"
          density="compact"
          placeholder="Serach Order"
          style=" max-inline-size: 200px; min-inline-size: 200px;"
        />
      </div>
    </VCardText>

    <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :headers="headers"
        :items="samples"
        :items-length="totalSamples"
        show-select
        class="text-no-wrap"
        @update:options="updateOptions"
    >
        <!-- Sample ID -->
        <template #item.sampleID="{ item }">
            <RouterLink
                :to="{ name: 'sales-details-id', params: { id: item.sampleID } }"
                class="font-weight-medium"
            >
                #{{ item.sampleID }}
            </RouterLink>
        </template>

        <!-- Created Date -->
        <template #item.date="{ item }">
            {{ new Date(item.date).toDateString() }}
        </template>

        <!-- Billable  -->
        <template #item.billable="{ item }">
            <!-- <div class="d-flex align-center">
                <span class="text-sm text-disabled">{{ item.isBillable }}</span>
            </div> -->
            <VChip
                v-bind="resolveBillable(item.isBillable)"
                label
            />
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
            <VChip
                v-bind="resolveStatus(item.status)"
                label
            />
        </template>

        <!-- pagination -->
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
</template>
