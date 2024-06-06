<script setup lang="ts">
import ChangeValue from '@/pages/labs/view/ChangeValue.vue'
import ChangeRange from '@/pages/labs/view/ChangeRange.vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import QrcodeVue from 'qrcode.vue'

const route = useRoute()

const isChangeValueDialogVisible = ref(false)
const isChangeRangeDialogVisible = ref(false)

let changedValue = ref()
let changedRange = ref()
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
let changedItem = ref()

let sampleDetails = ref()
let sampleData = ref()
let issuedDate = ref()
let PCP_Params = ref()
let MA_Params = ref()
let FTIR_Params = ref()

const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'Test', key: 'param_name' },
  { title: 'Units', key: 'units' },
  { title: 'Method', key: 'method' },
  { title: 'Values', key: 'values' },
  { title: 'Range', key: 'range' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const testCategories = ['Physical and Chemical Properties', 'Metal Analysis', 'FTIR']

const statusOptions = [
  { status: 'Mark As Received', value: 'test_assigned' }, 
  { status: 'Mark As Ready for Review', value: 'reviewed' }
]

let selectedStatus = ref()

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

const jwtToken = useCookie('jwt').value

const setIssuedDate = (date: any) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}`
}

const resolveRange = (range: string) => {
	if (range === 'Normal')
		return { text: range, color: 'success' }
	if (range === 'Caution')
		return { text: range, color: 'error' }
	if (range === 'Urgent')
		return { text: range, color: 'warning' }
}

const onEditValue = (category: string, id: number) => {
  isChangeValueDialogVisible.value = !isChangeValueDialogVisible.value

  if(category == "PCP") {
    changedItem.value = PCP_Params.value.find((item: any) => {
      return item.id == id
    })
  }
  if(category == "MA") {
    changedItem.value = MA_Params.value.find((item: any) => {
      return item.id == id
    })
  }
  if(category == "FTIR") {
    changedItem.value = FTIR_Params.value.find((item: any) => {
      return item.id == id
    })
  }
}

const setChangedItem = (category: any, id: any) => {
	if (category == "PCP") {
		changedItem.value = PCP_Params.value.find((item: any) => {
			return item.id == id
		})
	}
	if (category == "MA") {
		changedItem.value = MA_Params.value.find((item: any) => {
			return item.id == id
		})
	}
	if (category == "FTIR") {
		changedItem.value = FTIR_Params.value.find((item: any) => {
			return item.id == id
		})
	}
}

const onEditRange = (category: string, id: number) => {
	isChangeRangeDialogVisible.value = !isChangeRangeDialogVisible.value
	setChangedItem(category, id)
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

const uploadCSV = () => {
  const testData = [...PCP_Params.value, ...MA_Params.value, ...FTIR_Params.value]
  const titleKeys = Object.keys(testData[0])
  const refinedData = []
  refinedData.push(titleKeys)
  testData.forEach(item => {
    refinedData.push(Object.values(item))
  })
  let csvContent = ''

  refinedData.forEach(row => {
    if(row[5] === "null" || row[5] === null) {
      const value = ''
      csvContent += `${row[0]},${row[1]},"${row[2]}",${row[3]},${row[4]},${value},${row[6]},${row[7]}\n`
    } else {
      csvContent += `${row[0]},${row[1]},"${row[2]}",${row[3]},${row[4]},${row[5]},${row[6]},${row[7]}\n`
    }
  })

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
  
  const formData = new FormData()
  const fileName = `${sampleData.value.reference}`
  formData.append('csvFile', blob, `${fileName}.csv`);
  const saveCSVURI = '/api/oil-samples/csv-upload'
  const res = $api(saveCSVURI, {
    method: 'post',
    headers: {
      authorization: `Bearer ${jwtToken}`
    },
    body: formData,
    onResponse(response) {
      console.log(111, response)
    },
    onResponseError(error) {
      console.log(222, error)
    }
  })

  const timestamp = createTimeStamp()

  const updateURI = `/api/oil-samples/${id}`
  $api(updateURI, {
    method: 'put',
    headers: {
      authorization: `Bearer ${jwtToken}`
    },
    body: { 
      data: {
        timestamp: timestamp
      }
    }
  })
}

// onUpdated(() => {
const { id } = route.query
const getURI = `/api/oil-samples/${id}`
const sample = await $api(getURI, {
  method: 'get',
  headers: {
    authorization: `Bearer ${jwtToken}`
  },
  onResponseError({ response }) {
    console.log(3333333, response._data.errors)
  },
  onResponse(response) {
    const { attributes } = response.response._data.data
    sampleDetails.value = [
      { key: 'Sample Point', value: attributes.sample_point },
      { key: 'Model Type', value: attributes.model_type },
      { key: 'Hrs Oil', value: attributes.hours_on_oil },
      { key: 'Lubicurant Name', value: attributes.lub_name },
      { key: 'Company Name', value: attributes.company },
      { key: 'Equipment Used', value: attributes.equipment },
      { key: 'Hrs Unit', value: attributes.hours_unit },
      { key: 'Sample ID', value: attributes.sample_id },
      { key: 'Batch Number', value: attributes.batch_numbers },
      { key: 'Oil Type', value: attributes.oil_type },
    ]
    sampleData.value = attributes
    issuedDate.value = setIssuedDate(new Date(attributes.createdAt))
  },
})
// })

const setStatus = () => {
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

const formatParamData = (data: any) => {
  return data.map((item: any) => (
    {
      id: item.id,
      param_name: item.param_name,
      units: item.unit,
      method: item.method,
      values: '',
      range: 'Normal',
      category: item.category
    }
  ))
}

const fetchTestParameters = async (sampleData: any) => {
  const { oil_type } = sample.data.attributes
  const fetchURI = `/api/oil-types/test-parameters?oil_type=${oil_type}`
  const res = await $api(fetchURI, {
    headers: {
      authorization: `Bearer ${jwtToken}`
    },
    onResponse(response) {
      const PCP_temp = response.response._data.filter((item: any) => {
        return item.category === 'Physical and Chemical Properties'
      })
      const MA_temp = response.response._data.filter((item: any) => {
        return item.category === 'Metal Analysis'
      })
      const FTIR_temp = response.response._data.filter((item: any) => {
        return item.category === 'FTIR'
      })
      PCP_Params.value = formatParamData(PCP_temp)
      MA_Params.value = formatParamData(MA_temp)
      FTIR_Params.value = formatParamData(FTIR_temp)
    },
    onResponseError({error}) {
      console.log(22222, error)
    }
  })
}

const removeLastElement = (arr: any) => {
	const removedElement = arr.pop()
	return [arr, removedElement]
}

const fetchCSVData = async () => {
	const getCSVDataURI = `/api/oil-samples/report`
	const report = await $api(getCSVDataURI, {
		method: 'post',
		headers: {
			authorization: `Bearer ${jwtToken}`
		},
		body: {
			data: {
				reference: sampleData.value.reference
			}
		},
		async onResponse(response) {
			const { data } = response.response._data
			const [params, removedElement] = await removeLastElement(data)
			PCP_Params.value = params.filter((item: any) => {
				return item.category === 'Physical and Chemical Properties'
			})
			MA_Params.value = params.filter((item: any) => {
				return item.category === 'Metal Analysis'
			})
			FTIR_Params.value = params.filter((item: any) => {
				return item.category === 'FTIR'
			})
		}
	})
}

const setPrevStatus = () => {
  const prevStatus = statusOptions.find((item: any) => {
    return item.value == sampleData.value.status
  })
  selectedStatus.value = prevStatus
}

setPrevStatus()
fetchCSVData()

onUpdated(() => {
	if (changedValue.value) {
		let temp_test = changedItem.value
		temp_test.values = changedValue.value
		changedValue.value = ''
	}
	if (changedRange.value) {
		let temp_test = changedItem.value
		temp_test.range = changedRange.value
		changedRange.value = ''
	}
})

</script>

<template>
  <VRow>
    <VCol cols="12">
      <div class="d-flex justify-space-between">
        <div>
          <h3 class="text-h3 text-disabled mb-5">
            Laboratory<span class="font-weight-medium"> / Enter Results </span>
          </h3>
          <h4 class="text-h4 text-high-emphasis mb-5">
            {{ sampleData.reference }}
          </h4>
        </div>
        <QrcodeVue :value="sampleData.reference" :size="80" level="H"></QrcodeVue>
      </div>
      <div class="d-flex justify-space-between mb-6">
        <div>
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
        <div class="text-body-1">
          <VBtn @click="uploadCSV">Save</VBtn>
        </div>
      </div>
      <VCard title="Sample Details">
        <template #append>
          <span class="text-sm text-disabled">Date Issued: {{ issuedDate }}</span>
        </template>
        <VDivider />
        <VCardText class="pt-6">
          <VRow>
            <VCol v-for="item in sampleDetails" :key="item.key" cols="6" md="auto" class="sample-item-width">
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
        <VDataTableServer :items="PCP_Params" :headers="headers" :items-length="1" show-select return-object class="text-no-wrap" @update:options="updateOptions">
					<template v-slot:body="{ items }">
						<tr v-for="item in items">
							<td>
								<v-checkbox :model-value="item.value.checked"></v-checkbox>
							</td>
							<td>
								{{ item.value.param_name }}
							</td>
							<td>
								{{ item.value.units }}
							</td>
							<td>
								{{ item.value.method }}
							</td>
							<td>
								{{ item.value.values }}
							</td>
							<td>
								<VChip v-bind="resolveRange(item.value.range)" label />
							</td>
							<td>
								<IconBtn>
									<VIcon icon="tabler-dots-vertical" />
									<VMenu activator="parent">
										<VList>
											<VListItem value="view" @click="onEditValue('PCP', item.value.id)">
												Edit Values
											</VListItem>
											<VListItem value="view" @click="onEditRange('PCP', item.value.id)">
												Edit Range
											</VListItem>
										</VList>
									</VMenu>
								</IconBtn>
							</td>
						</tr>
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
        <VDataTableServer :items="MA_Params" :headers="headers" :items-length="1" show-select
					return-object class="text-no-wrap" @update:options="updateOptions">
					<template v-slot:body="{ items }">
						<tr v-for="item in items">
							<td>
								<v-checkbox :model-value="item.value.checked"></v-checkbox>
							</td>
							<td>
								{{ item.value.param_name }}
							</td>
							<td>
								{{ item.value.units }}
							</td>
							<td>
								{{ item.value.method }}
							</td>
							<td>
								{{ item.value.values }}
							</td>
							<td>
								<VChip v-bind="resolveRange(item.value.range)" label />
							</td>
							<td>
								<IconBtn>
									<VIcon icon="tabler-dots-vertical" />
									<VMenu activator="parent">
										<VList>
											<VListItem value="view" @click="onEditValue('MA', item.value.id)">
												Edit Values
											</VListItem>
											<VListItem value="view" @click="onEditRange('MA', item.value.id)">
												Edit Range
											</VListItem>
										</VList>
									</VMenu>
								</IconBtn>
							</td>
						</tr>
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
        <VDataTableServer :items="FTIR_Params" :headers="headers" :items-length="1" show-select
					 return-object class="text-no-wrap" @update:options="updateOptions">
					<template v-slot:body="{ items }">
						<tr v-for="item in items">
							<td>
								<v-checkbox :model-value="item.value.checked"></v-checkbox>
							</td>
							<td>
								{{ item.value.param_name }}
							</td>
							<td>
								{{ item.value.units }}
							</td>
							<td>
								{{ item.value.method }}
							</td>
							<td>
								{{ item.value.values }}
							</td>
							<td>
								<VChip v-bind="resolveRange(item.value.range)" label />
							</td>
							<td>
								<IconBtn>
									<VIcon icon="tabler-dots-vertical" />
									<VMenu activator="parent">
										<VList>
											<VListItem value="view" @click="onEditValue('FITR', item.value.id)">
												Edit Values
											</VListItem>
											<VListItem value="view" @click="onEditRange('FITR', item.value.id)">
												Edit Range
											</VListItem>
										</VList>
									</VMenu>
								</IconBtn>
							</td>
						</tr>
					</template>

					<template #bottom>

					</template>
				</VDataTableServer>
      </VCard>
    </VCol>
  </VRow>
  <a id="csvDownloadLink"></a>
  <ChangeValue v-model:isDialogVisible="isChangeValueDialogVisible" v-model:changedValue="changedValue" />
  <ChangeRange v-model:isDialogVisible="isChangeRangeDialogVisible" v-model:changedRange="changedRange" />
</template>

<style scoped>
.sample-item-width {
  width: 20% !important;
}

.hidden {
  display: none;
}
.app-select {
  background-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
  border-radius: 6px;
  width: 220px;
}
.v-field--variant-outlined .v-field__outline .v-field__outline__start {
  border: none;
}
</style>