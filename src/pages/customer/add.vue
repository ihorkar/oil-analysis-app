<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import QrcodeVue from 'qrcode.vue'
import html2canvas from 'html2canvas'
import { paginationMeta } from '@api-utils/paginationMeta'
import PreviewSampleDialog from '@/pages/customer/view/PreviewSampleDialog.vue'
import { nextTick } from 'vue'

interface collectionItem {
  id: number,
  name: string
}

let samplePointsOptions = ref()
let equUsedOptions = ref()
let modelTypesOptions = ref()
let oilTypesOptions = ref()

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

const currentStep = ref(0)
const isCurrentStepValid = ref(true)

const refSampleDetailsForm = ref<VForm>()
const refLubDetailsForm = ref<VForm>()
const refLabelForm = ref<VForm>()

const oilSamples = ref()
let totalSamples = ref()
const reference = ref()
const timestamp = ref()
const imageLabel = ref<HTMLElement | null>(null)

let originalOilSamples = ref()
const previewedSample = ref(null)

const isSubmitted = ref(false)

const headers = [
  { title: 'Reference', key: 'data' },
  { title: 'Sample Point', key: 'samplePoint' },
  { title: 'Oil Brand', key: 'oilBrand' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const sampleDetailsFormData = ref({
  sample_point: undefined,
  equipment: undefined,
  model_type: undefined,
  batch_numbers: '',
  hours_unit: '',
  hours_on_oil: ''
})

const lubDetailsFormData = ref({
  lub_name: '',
  oil_brand: '',
  oil_type: undefined,
  exp_date: '',
  sample_id: '',
})

const labelFormData = ref({
  reference: '',
  label: '',
  company: '',
  customer_id: '',
  timestamp: ''
})

const validateSampleDetailsForm = () => {
  refSampleDetailsForm.value?.validate().then(valid => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validateLubDetailsForm = () => {
  refLubDetailsForm.value?.validate().then(async (valid) => {
    if (valid.valid) {
      currentStep.value++
      isCurrentStepValid.value = true

      // Create reference number and timestamp
      reference.value = createReference()
      timestamp.value = createTimeStamp()

      // Set Customer ID and Company
      const user_data = useCookie('userData')
      labelFormData.value.customer_id = user_data.value?.id
      labelFormData.value.company = user_data.value?.company
      labelFormData.value.timestamp = timestamp.value

      // Generate Oil Sample Label
      imageLabel.value = document.getElementById('labelContainer')

      await nextTick()

      if (imageLabel.value) {
        const dataURL = (await html2canvas(imageLabel.value)).toDataURL()

        labelFormData.value.label = dataURL;
      }
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const validateLabelForm = () => {
  refLabelForm.value?.validate().then(valid => {
    if (valid.valid) {
      isCurrentStepValid.value = true
      createOilSample()
      isSubmitted.value = true

      // Download Oil Sample Label
      let downloadLabel: any = document.getElementById('labelDownloadLink')
      downloadLabel.href = labelFormData.value.label;
      downloadLabel.download = `${labelFormData.value.label}.png`
      downloadLabel.click()
    } else {
      isCurrentStepValid.value = false
    }
  })
}

const jwtToken = useCookie('jwt').value
const username = useCookie('userData').value?.username

const auth_header = {
  headers: {
    authorization: `Bearer ${jwtToken}`,
  },
}

const samplePointsURI = `/api/sample-points/filterSamplePointsByUserName/${username}`
const equipmentsURI = `/api/equipments/filterEquipmentByUserName/${username}`
const modelTypesURI = `/api/model-types/filterModelTypesByUserName/${username}`
const oilTypeURI = '/api/oil-types'

const samplePoints = await $api(samplePointsURI, {
  headers: {
    authorization: `Bearer ${jwtToken}`,
  },
  onResponse(res) {
    samplePointsOptions.value = res.response._data.map((item: collectionItem) => {
      return item.name
    })
  }
})

const equipments = await $api(equipmentsURI, {
  headers: {
    authorization: `Bearer ${jwtToken}`,
  },
  onResponse(res) {
    equUsedOptions.value = res.response._data.map((item: collectionItem) => {
      return item.name
    })
  },
  onResponseError(error) {

  }
})

const modelTypes = await $api(modelTypesURI, {
  headers: {
    authorization: `Bearer ${jwtToken}`,
  },
  onResponse(res) {
    modelTypesOptions.value = res.response._data.map((item: collectionItem) => {
      return item.name
    })
  },
  onResponseError(error) {

  }
})

const oilTypes = await $api(oilTypeURI, auth_header)
oilTypesOptions.value = oilTypes.data.map((item: { id: number, attributes: object }) => {
  return item.attributes.name
})

const createReference = () => {
  // Create Reference
  let firstThreeLettersOfCompanyName = ''; let i = 0; let year = ''; let test_id = '000000'; let firstThreeLettersOfOiltype = ''

  const user_data = useCookie('userData')

  const companyName = user_data.value?.company
  const companyNameSubArray = companyName.split(' ')
  do {
    firstThreeLettersOfCompanyName = firstThreeLettersOfCompanyName.concat(companyNameSubArray[i].slice(0, 1))
    i++
  } while (i < 3)
  i = 0
  year = new Date().getFullYear().toString()
  if (oilSamples.value && oilSamples.value.length > 0) {
    let maxId = originalOilSamples.value.reduce((max, obj) => obj.id > max ? obj.id : max, oilSamples.value[0].id);
    test_id = (maxId + 1).toString().padStart(6, '0')
  }
  if (lubDetailsFormData.value.oil_type) {
    const oilTypeSubArray = lubDetailsFormData.value.oil_type.split(' ')
    do {
      firstThreeLettersOfOiltype = firstThreeLettersOfOiltype.concat(oilTypeSubArray[i].slice(0, 1))
      i++
    } while (i < oilTypeSubArray.length)
  }

  const reference = `Q${firstThreeLettersOfCompanyName}${year}${test_id}${firstThreeLettersOfOiltype}`

  labelFormData.value.reference = reference

  return reference
}

const createTimeStamp = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  const seconds = String(currentDate.getSeconds()).padStart(2, '0')
  const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

const createOilSample = async () => {
  const formData = { ...sampleDetailsFormData.value, ...lubDetailsFormData.value, ...labelFormData.value }
  const res = await $api('/api/oil-samples', {
    method: 'post',
    headers: {
      authorization: `Bearer ${jwtToken}`,
    },
    body: { data: formData },
    onResponseError({ response }) {
      console.log(3333333, response._data.errors)
    },
    onResponse(response) {
      // fetchOilSamples()
    },
  })
}

const userId = useCookie('userData').value?.id
const oilSampleURI = `/api/oil-samples`

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
}

fetchOilSamples()

</script>

<template>
  <VRow>
    <VCol cols="12">
      <h3 class="text-h3 text-disabled mb-5">
        {{ useCookie('userData').value?.company }}<span class="font-weight-medium"> / Add New </span>
      </h3>
      <VCard>
        <VRow>
          <VCol cols="12" md="4" :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'">
            <VCardText>
              <!-- 👉 Stepper -->
              <AppStepper v-model:current-step="currentStep" direction="vertical" :items="numberedSteps"
                :is-active-step-valid="isCurrentStepValid" />
            </VCardText>
          </VCol>
          <!-- 👉 stepper content -->
          <VCol cols="12" md="8">
            <VCardText>
              <VWindow v-model="currentStep" class="disable-tab-transition">
                <VWindowItem>
                  <VForm ref="refSampleDetailsForm" @submit.prevent="validateSampleDetailsForm">
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">
                          Sample Details
                        </h6>
                        <p class="mb-0">
                          Add all the necessary information below
                        </p>
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppSelect v-model="sampleDetailsFormData.sample_point" :rules="[requiredValidator]"
                          :items="samplePointsOptions" placeholder="Select" label="Sample Point*" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppSelect v-model="sampleDetailsFormData.equipment" :rules="[requiredValidator]"
                          :items="equUsedOptions" placeholder="Select" label="Equipment Used*" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppSelect v-model="sampleDetailsFormData.model_type" :rules="[requiredValidator]"
                          :items="modelTypesOptions" placeholder="Select" label="Model Type*" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="sampleDetailsFormData.hours_unit" placeholder="Optional"
                          label="Hrs Unit" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="sampleDetailsFormData.hours_on_oil" placeholder="Optional"
                          label="Hrs Oil" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="sampleDetailsFormData.batch_numbers" placeholder="Optional"
                          label="Batch Number" />
                      </VCol>

                      <VCol cols="12">
                        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                          <VBtn color="secondary" variant="tonal" @click="currentStep--" :disabled="currentStep === 0">
                            <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                            Previous
                          </VBtn>

                          <VBtn type="submit" class="flex">
                            <span>Next</span>
                          </VBtn>
                        </div>
                      </VCol>
                    </VRow>
                  </VForm>
                </VWindowItem>

                <VWindowItem>
                  <VForm ref="refLubDetailsForm" @submit.prevent="validateLubDetailsForm">
                    <VRow>
                      <VCol cols="12">
                        <h6 class="text-h6 font-weight-medium">
                          Lubricants Details
                        </h6>
                        <p class="mb-0">
                          Add all the necessary information below
                        </p>
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="lubDetailsFormData.lub_name" label="Lubricant Name"
                          placeholder="Optional" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="lubDetailsFormData.oil_brand" :rules="[requiredValidator]"
                          label="Oil Brand*" placeholder="Oil Brand Name" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppSelect v-model="lubDetailsFormData.oil_type" :rules="[requiredValidator]"
                          :items="oilTypesOptions" placeholder="Select" label="Types of Oil*" @change="createReference" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppDateTimePicker v-model="lubDetailsFormData.exp_date" label="Expected Report Date"
                          placeholder="Expected Report Date" />
                      </VCol>

                      <VCol cols="12" md="6">
                        <AppTextField v-model="lubDetailsFormData.sample_id" label="Sample ID" placeholder="Optional" />
                      </VCol>

                      <VCol cols="12">
                        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                          <VBtn color="secondary" variant="tonal" @click="currentStep--">
                            <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                            Previous
                          </VBtn>

                          <VBtn type="submit">
                            Next
                          </VBtn>
                        </div>
                      </VCol>
                    </VRow>
                  </VForm>
                </VWindowItem>

                <VWindowItem>
                  <VForm ref="refLabelForm" @submit.prevent="validateLabelForm">
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
                        <div id="labelContainer" ref="imageLabel" class="d-flex align-center gap-x-4 v-label">
                          <QrcodeVue :value="reference" :size="80" level="H" />
                          <div>
                            <div class="text-h6 text-high-emphasis font-weight-medium">
                              {{ reference }}
                            </div>
                            <div class="label-date text-body-2 text-disabled">
                              {{ timestamp }}
                            </div>
                            <div class="label-provider text-body-2 text-disabled">
                              website.com
                            </div>
                          </div>
                        </div>
                      </VCol>

                      <VCol cols="12">
                        <div class="d-flex flex-wrap gap-4 justify-sm-space-between justify-center mt-8">
                          <VBtn color="secondary" variant="tonal" @click="currentStep--">
                            <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
                            Previous
                          </VBtn>

                          <VBtn type="submit" :disabled="isSubmitted">
                            Generate
                          </VBtn>
                        </div>
                      </VCol>
                    </VRow>
                  </VForm>
                </VWindowItem>
              </VWindow>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
    <!-- <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex justify-space-between flex-wrap gap-y-4">
            <VCardTitle>Oil Samples</VCardTitle>
            <div class="d-flex flex-row gap-4 align-center flex-wrap">
              <AppTextField
                v-model="searchQuery"
                style="max-inline-size: 200px; min-inline-size: 200px; flex-grow: 0;"
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
                <RouterLink
                  :to="{ name: 'customer-add' }"
                  class="font-weight-medium"
                >
                  {{ item.data.reference }}
                </RouterLink>
                <span class="text-sm text-disabled">{{ item.data.oil_type }}</span>
              </div>
            </div>
          </template>

          <template #item.samplePoint="{ item }">
            {{ item.samplePoint }}
          </template>

          <template #item.oil_type="{ item }">
            {{ item.oil_type }}
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
                    @click="previewSample(item.id)"
                  >
                    View
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
    </VCol> -->
  </VRow>
  <a id="labelDownloadLink"></a>
  <PreviewSampleDialog v-model:isDialogVisible="isPreviewSampleDialogVisible" v-model:previewedSample="previewedSample" />
</template>

<style scoped>
.v-label {
  padding: 20px;
  border: 1px solid;
}

.v-label .label-provider,
.v-label .label-date {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity)) !important
}
</style>
