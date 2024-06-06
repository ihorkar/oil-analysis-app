<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import AddSampleDialog from '@/components/dialogs/AddSampleDialog.vue'
import { AnyARecord } from 'dns';
import { runInThisContext } from 'vm';

definePage({
  meta: {
    layout: 'front',
    action: 'read',
    subject: 'AclDemo',
  },
})

interface Props {
  isDialogVisible: boolean,
  isFetchOilSamples: boolean
}

const isAddSampleDialogOpen = ref(false)
const isFetchOilSamples = ref(false)
let oilSamples = ref()
let totalSamples = ref()


const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const headers = [
  { title: 'Date', key: 'del_date' },
  { title: 'Reference', key: 'reference' },
  { title: 'Equipment Used', key: 'equipment' },
  { title: 'Model Type', key: 'model_type' },
  { title: 'Types Of Oil', key: 'oil_type' },
  { title: 'Action', key: 'actions', sortable: false },
]

const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const jwtToken = useCookie('jwt').value;
const oilSampleURI = '/api/oil-samples'

const fetchOilSamples = async () => {
  let oilSampleData = await $api(oilSampleURI, {
    headers: {
      authorization: `Bearer ${jwtToken}`
    }
  })
  oilSamples.value = oilSampleData.data.map((item: any) => {
    return {
      id: item.id,
      reference: item.attributes.sample_id,
      del_date: item.attributes.del_date,
      equipment: item.attributes.equipment,
      model_type: item.attributes.model_type,
      oil_type: item.attributes.oil_type
    }
  })
  totalSamples = oilSamples.value.length
}

fetchOilSamples()

onUpdated(() => {
  fetchOilSamples()
})
</script>

<template>
  
  <div class="d-flex flex-column justify-center align-center">
    <h2 class="text-h2 mt-50">
      Oil Samples you've submitted
    </h2>
    <VCard class="w-75 mt-12">
      <VCardText>
        <div class="d-flex justify-space-between flex-wrap gap-y-4">
          <AppTextField
            v-model="searchQuery"
            style="max-inline-size: 200px; min-inline-size: 200px;"
            placeholder="Search .."
            density="compact"
          />
          <div class="d-flex flex-row gap-4 align-center flex-wrap">
            <AppSelect
              v-model="itemsPerPage"
              density="compact"
              :items="[5, 10, 20, 50, 100]"
            />
            <VBtn
              prepend-icon="tabler-plus"
              @click="isAddSampleDialogOpen = !isAddSampleDialogOpen"
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
          :headers="headers"
          :items="oilSamples"
          :items-length="totalSamples"
          show-select
          class="text-no-wrap"
          @update:options="updateOptions"
      >
          <!-- Sample ID -->
          <template #item.reference="{ item }">
                  #{{ item.reference }}
          </template>
          
          <!-- Created Date -->
          <template #item.del_date="{ item }">
              {{ new Date(item.del_date).toDateString() }}
          </template>

          <!-- Equipment Used  -->
          <template #item.equipment="{ item }">
              {{ item.equipment }}
          </template>

          <!-- Model Type  -->
          <template #item.model_type="{ item }">
              {{ item.model_type }}
          </template>

          <!-- Types of Oil  -->
          <template #item.oil_type="{ item }">
              {{ item.oil_type }}
          </template>

          <!-- Actions -->
          <template #item.actions="{ item }">
            <IconBtn>
                <VIcon icon="tabler-dots-vertical" />
                <VMenu activator="parent">
                <VList>
                    <VListItem
                      value="delete"
                    >
                    Export PDF
                    </VListItem>
                    <VListItem
                      value="delete"
                    >
                    Export Label
                    </VListItem>
                </VList>
                </VMenu>
            </IconBtn>
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
    <AddSampleDialog v-model:isDialogVisible="isAddSampleDialogOpen" v-model:isFetchOilSamples="isFetchOilSamples" />
  </div>
</template>