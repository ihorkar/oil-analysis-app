<script setup lang="ts">
import PreviewSampleDialog from '@/pages/customer/view/PreviewSampleDialog.vue'
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'
import QrcodeVue from 'qrcode.vue';
import ChangeValue from '@/pages/techs/view/ChangeValue.vue'
import ChangeRange from '@/pages/techs/view/ChangeRange.vue'
import { TestParameters } from '@/utils/test-parameters'
import html2pdf from 'html2pdf.js';

const route = useRoute('apps-ecommerce-customer-details-id')
// const customerData = ref<Customer>()
const userTab = ref(null)

const isChangeValueDialogVisible = ref(false)
const isChangeRangeDialogVisible = ref(false)

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
	{ title: 'Test', key: 'param_name' },
	{ title: 'Units', key: 'units' },
	{ title: 'Method', key: 'method' },
	{ title: 'Values', key: 'values' },
	{ title: 'Range', key: 'range' },
	{ title: 'Actions', key: 'actions', sortable: false },
]

const resolveRange = (range: string) => {
	if (range === 'Normal')
		return { text: range, color: 'success' }
	if (range === 'Caution')
		return { text: range, color: 'error' }
	if (range === 'Urgent')
		return { text: range, color: 'warning' }
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
	linkedIn: ''
})

let sampleData = ref()
let issuedDate = ref()
let sampleDetails = ref()
let overallStatus = ref()

let PCP_Params = ref([])
let MA_Params = ref([])
let FTIR_Params = ref([])

let report = ref()

let changedItem = ref()
let changedValue = ref()
let changedRange = ref()

let pdfVisible = ref(false)

let previousSampleDetails = ref({
	referenceList: [],
	sampleDateList: [],
	hrsOnUnitList: [],
	hrsOnOilList: []
})

let prevTestParameters = ref([])

const statusOptions = [
	{ status: 'Mark As Assigned', value: 'test_assigned' },
	{ status: 'Mark As Completed', value: 'completed' }
]

let selectedStatus = ref()

const overallRange = ref('Normal')

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

const onEditValue = (category: string, id: number) => {
	isChangeValueDialogVisible.value = !isChangeValueDialogVisible.value
	setChangedItem(category, id)
}

const onEditRange = (category: string, id: number) => {
	isChangeRangeDialogVisible.value = !isChangeRangeDialogVisible.value
	setChangedItem(category, id)
}

const setIssuedDate = (date: any) => {
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return `${year}-${month}-${day} ${hours}:${minutes}`
}

const jwtToken = useCookie('jwt').value

const { id } = route.query
const getURI = `/api/oil-samples/${id}`
const sample = await $api(getURI, {
	method: 'get',
	headers: {
		authorization: `Bearer ${jwtToken}`
	},
	onResponseError({ response }) {
		
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

const removeLastElement = (arr: any) => {
	const removedElement = arr.pop()
	return [arr, removedElement]
}

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

interface ParameterType {
	default: boolean,
	param_name: string
}

const formatParamData = (data: any, testParameters: Array<Object>) => {
	return data.map((item: any) => {
		const parameter: Array<ParameterType> = testParameters.filter((param: any) => {
			return item.param_name === param.param_name
		})
		if(parameter.length) {
			return {
				id: item.id,
				checked: parameter[0].default,
				param_name: item.param_name,
				units: item.unit,
				method: item.method,
				values: '',
				range: 'Normal',
				category: item.category
			}
		}
	}).filter((item: any) => {
		return item !== undefined
	})
}

let changingParameter = ref()

const handleTick = (value: any) => {
	changingParameter.value = value.value
}

const handleCheckedValue = (value: any) => {
	changingParameter.value.checked = value
}

const handleAssignTest = (id: number) => {

}

const setPrevStatus = () => {
	const prevStatus = statusOptions.find((item: any) => {
		return item.value == sampleData.value.status
	})
	selectedStatus.value = prevStatus
}

const fetchTestParameters = async (sampleData: any) => {
	const { oil_type } = sample.data.attributes
	const testParameters = TestParameters[oil_type]
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
			PCP_Params.value = formatParamData(PCP_temp, testParameters)
			MA_Params.value = formatParamData(MA_temp, testParameters)
			FTIR_Params.value = formatParamData(FTIR_temp, testParameters)
		},
		onResponseError({ error }) {

		}
	})
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

const extractReferenceIndex = (reference) => {
	return reference.slice(8, 14)
}

const extractDate = (date: any) => {
	return date.slice(0, 10)
}

const getPrevParam = (cat, paramName) => {
	let prevParamValues
	if(cat === 'PCP') {
		prevParamValues = prevTestParameters.value.map((item: any) => {
			const valuesList = item.csvData.filter((item) => {
				return item.category === 'Physical and Chemical Properties' && item.param_name === paramName
			}).map(item => {
				return item.values
			})
			return valuesList[0]
		})
	}
	if(cat === 'MA') {
		prevParamValues = prevTestParameters.value.map((item: any) => {
			const valuesList = item.csvData.filter((item) => {
				return item.category === 'Metal Analysis' && item.param_name === paramName
			}).map(item => {
				return item.values
			})
			return valuesList[0]
		})
	}
	if(cat === 'FTIR') {
		prevParamValues = prevTestParameters.value.map((item: any) => {
			const valuesList = item.csvData.filter((item) => {
				return item.category === 'FTIR' && item.param_name === paramName
			}).map(item => {
				return item.values
			})
			return valuesList[0]
		})
	}
	return prevParamValues
}

const fetchPreviousSample = async () => {
	const { company, sample_point, model_type, equipment } = sampleData.value
	const fetchPreviousSampleURI = `/api/oil-samples/fetch-previous-samples`
	const allPreviousSamples = await $api(fetchPreviousSampleURI, {
		method: 'post',
		headers: {
			authorization: `Bearer ${jwtToken}`
		},
		body: {
			data: {
				company: company,
				sample_point: sample_point,
				model_type: model_type,
				equipment: equipment
			}
		}
	})
	
	const filteredSamples = allPreviousSamples.filter((item: any) => {
		return item.entry.id !== parseInt(id)
	})
	prevTestParameters.value = filteredSamples
	previousSampleDetails.value.referenceList = filteredSamples.map((item: any) => {
		return item.entry.reference
	})
	previousSampleDetails.value.sampleDateList = filteredSamples.map((item: any) => {
		return item.entry.timestamp
	})
	previousSampleDetails.value.hrsOnUnitList = filteredSamples.map((item: any) => {
		return item.entry.hours_unit
	})
	previousSampleDetails.value.hrsOnOilList = filteredSamples.map((item: any) => {
		return item.entry.hours_on_oil
	})
}

const createReport = async () => {
	pdfVisible.value = true
	const element = document.getElementById('pdf-template')
	if (element) {
		const options = {
			margin: [30, 0, 30, 0],
			filename: `${sampleData.refernence}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
			pageBreak: { mode: 'css' },
			onAfterPageContent: function (currentPage: number, pageCount: number) {
				if (currentPage > 1) {
					options.margin = [30, 0, 30, 0]; // Adjust margin for second page and onwards
				}
			}
		};

		const pdf = html2pdf().from(element).set(options);

		pdf.output('blob').then(function (blob) {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.onloadend = function () {
				const base64String = reader.result;

				const formData = new FormData()
				formData.append('report', base64String);
				formData.append('id', id)
				const saveReportURI = `/api/oil-samples/save-report`
				// Here you can save or use the Base64 string as needed
				// const updateURI = `/api/oil-samples/${id}`
				$api(saveReportURI, {
					method: 'post',
					headers: {
						authorization: `Bearer ${jwtToken}`
					},
					body: formData,
					onResponse(response) {
						pdfVisible.value = false
					},
					onResponseError(error) {
						console.log(222, error)
					}
				})
			};
		})
	}
}

const onSave = async () => {
	// Update uploaded csv data
	const allTestData = [...PCP_Params.value, ...MA_Params.value, ...FTIR_Params.value]
	const checkedTestData = allTestData.filter((item: any) => {
		return item.checked == true
	})
	const titleKeys = Object.keys(checkedTestData[0])
	const refinedData = []
	refinedData.push(titleKeys)
	checkedTestData.forEach((item: any) => {
		refinedData.push(Object.values(item))
	})

	let csvContent = ''

	refinedData.forEach(row => {
		csvContent += `${row[0]},${row[1]},"${row[2]}",${row[3]},${row[4]},${row[5]},${row[6]},${row[7]}\n`
	})

	const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })

	const formData = new FormData()
	const reportedDate = Date.now()
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
	
	if(sampleData.value.status === 'reviewed') {
		// Update Overall Status and Range
		// Submit report
		const updateURI = `/api/oil-samples/${id}`
		$api(updateURI, {
			method: 'put',
			headers: {
				authorization: `Bearer ${jwtToken}`
			},
			body: {
				data: {
					overall_status: overallStatus.value,
					overall_range: overallRange.value
				}
			}
		})
		createReport()
	}	
}

onUpdated(() => {
	if (changedValue.value) {
		let temp_test = changedItem.value
		temp_test.values = changedValue.value
		changedValue.value = null
	}
	if (changedRange.value) {
		let temp_test = changedItem.value
		temp_test.range = changedRange.value
		changedRange.value = null
	}
})

setPrevStatus()
if (sampleData.value.status == 'test_received') {
	fetchTestParameters(sampleData)
}
if (sampleData.value.status == 'test_assigned' || sampleData.value.status == 'reviewed' || sampleData.value.status == 'completed') {
	fetchCSVData()
	fetchPreviousSample()
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
						{{ sampleData.reference }}
					</h4>
				</div>
				<QrcodeVue :value="sampleData.reference" :size="80" level="H"></QrcodeVue>
			</div>
			<div class="d-flex justify-space-between">
				<div>
					<AppSelect v-model="selectedStatus" :items="statusOptions" item-title="status" @update:model-value="setStatus"
						return-object single-line placeholder="Select State" />
				</div>
				<div class="text-body-1">
					<VBtn @click="onSave">Save</VBtn>
				</div>
			</div>
		</VCol>
		<VCol cols="12">
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
		<VCol cols="12" v-if="sampleData.status == 'reviewed'">
			<VCard title="OVERALL STATUS">
				<template #append>
					<VRadioGroup v-model="overallRange" inline>
						<VRadio label="Urgent" color="error" value="Urgent" />
						<VRadio label="Caution" color="warning" value="Caution" />
						<VRadio label="Normal" color="success" value="Normal" />
					</VRadioGroup>
				</template>
				<VCardText>
					<VRow>
						<VCol cols="12">
							<AppTextarea placeholder="Leave a status" v-model="overallStatus" />
						</VCol>
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
				<VDataTableServer :items="PCP_Params" :headers="headers" :items-length="1" show-select
					@click:row="(item) => handleTick(item)" return-object class="text-no-wrap" @update:options="updateOptions">
					<template v-slot:body="{ items }">
						<tr v-for="item in items">
							<td>
								<v-checkbox :model-value="item.value.checked" @update:model-value="handleCheckedValue"
									@click="handleTick(item)"></v-checkbox>
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
											<VListItem value="view" @click="">
												Assign Test
											</VListItem>
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
					@click:row="(item) => handleTick(item)" return-object class="text-no-wrap" @update:options="updateOptions">
					<template v-slot:body="{ items }">
						<tr v-for="item in items">
							<td>
								<v-checkbox :model-value="item.value.checked" @update:model-value="handleCheckedValue"
									@click="handleTick(item)"></v-checkbox>
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
											<VListItem value="view" @click="">
												Assign Test
											</VListItem>
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
					@click:row="(item) => handleTick(item)" return-object class="text-no-wrap" @update:options="updateOptions">
					<template v-slot:body="{ items }">
						<tr v-for="item in items">
							<td>
								<v-checkbox :model-value="item.value.checked" @update:model-value="handleCheckedValue"
									@click="handleTick(item)"></v-checkbox>
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
											<VListItem value="view" @click="">
												Assign Test
											</VListItem>
											<VListItem value="view" @click="onEditValue('FTIR', item.value.id)">
												Edit Values
											</VListItem>
											<VListItem value="view" @click="onEditRange('FTIR', item.value.id)">
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
			<div id="pdf-template" v-show="pdfVisible">
				<div id="company-logo" class="pa-3 text-h6">Our Company Logo</div>
				<div class="text-h3 mb-5">
					<span class="">Oil Analysis # </span><span id="oil-reference" class="reference">{{ sampleData.reference }}</span>
					<div class="text-body-1">Date Issued: {{ issuedDate }}</div>
				</div>
				<div id="sample-details">
					<div class="sample-details-title pa-1">SAMPLE DETAILS</div>
					<div class="d-flex py-2">
						<div class="w-25">
							<div class="font-weight-bold">COMPANY NAME</div>
							<div>{{ sampleData.company }}</div>
						</div>
						<div class="w-25">
							<div class="font-weight-bold">SAMPLE POINT</div>
							<div>{{ sampleData.sample_point }}</div>
						</div>
						<div class="w-25">
							<div class="font-weight-bold">MODEL TYPE</div>
							<div>{{ sampleData.model_type }}</div>
						</div>
						<div class="w-25">
							<div class="font-weight-bold">EQUIPMENT USED</div>
							<div>{{ sampleData.equipment }}</div>
						</div>
					</div>
					<VDivider :thickness="2" class="border-opacity-25"></VDivider>
					<div class="d-flex py-2">
						<div class="w-25">
							<div class="font-weight-bold">SAMPLE ID</div>
							<div>{{ sampleData.sample_id }}</div>
						</div>
						<div class="w-25">
							<div class="font-weight-bold">BATCH NUMBER</div>
							<div>{{ sampleData.batch_numbers }}</div>
						</div>
						<div class="w-25">
							<div class="font-weight-bold">LUBRICANT NAME</div>
							<div>{{ sampleData.lub_name }}</div>
						</div>
						<div class="w-25">
							<div class="font-weight-bold">REQUEST DATE</div>
							<div>{{ extractDate(sampleData.createdAt) }}</div>
						</div>
					</div>
					<VDivider :thickness="2" class="border-opacity-25"></VDivider>
					<div class="d-flex flex-row">
						<div id="details-comments" class="py-1">
							<div class="font-weight-bold">COMMENTS</div>
							<p>{{ overallStatus }}</p>
						</div>
						<VDivider :thickness="2" class="border-opacity-25" vertical></VDivider>
						<div id="details-status" class="px-1 py-1">
							<div class="font-weight-bold">STATUS</div>
							<div class="d-flex justify-center align-center font-weight-bold text-h4">
								<span v-if="overallRange === 'Normal'"
									class="text-h3 font-weight-bold text-uppercase text-green-darken-3">NORMAL
								</span>
								<span v-if="overallRange === 'Caution'"
									class="text-h3 font-weight-bold text-uppercase text-orange-darken-3">CAUTION
								</span>
								<span v-if="overallRange === 'Urgent'"
									class="text-h3 font-weight-bold text-uppercase text-red-darken-4">URGENT
								</span>
							</div>
						</div>
					</div>
				</div>
				<VDivider :thickness="2" class="border-opacity-25 mb-5"></VDivider>
				<table id="params-table" class="mb-10">
					<tr>
						<th class="text-center pa-1">TEST PARAMETER</th>
						<th class="text-center pa-1">UNITS</th>
						<th class="text-center pa-1">METHOD</th>
						<th class="text-center pa-1">CURRENT SAMPLE</th>
						<th class="text-center pa-1" :colspan="previousSampleDetails.referenceList.length">PREVIOUS SAMPLE</th>
					</tr>
					<tr>
						<td class="text-start">Reference Number</td>
						<td></td>
						<td></td>
						<td>{{ extractReferenceIndex(sampleData.reference) }}</td>
						<td v-for="ref in previousSampleDetails.referenceList"
						:key="ref">{{ extractReferenceIndex(ref) }}</td>
					</tr>
					<tr>
						<td class="text-start">Sample Date</td>
						<td></td>
						<td></td>
						<td>{{ extractDate(sampleData.createdAt) }}</td>
						<td v-for="date in previousSampleDetails.sampleDateList">{{ extractDate(date) }}</td>
					</tr>
					<tr>
						<td class="text-start">Hrs on Unit</td>
						<td></td>
						<td></td>
						<td>{{ sampleData.hours_unit }}</td>
						<td v-for="hrsUnit in previousSampleDetails.hrsOnUnitList">{{ hrsUnit }}</td>
					</tr>
					<tr>
						<td class="text-start">Hrs on Oil</td>
						<td></td>
						<td></td>
						<td>{{ sampleData.hours_on_oil }}</td>
						<td v-for="hrsOil in previousSampleDetails.hrsOnOilList">{{ hrsOil }}</td>
					</tr>
					<tr v-if="PCP_Params.length !== 0">
						<td :colspan="4 + previousSampleDetails.referenceList.length" class="pa-0">
							<div class="header-style w-100 text-center">PHYSICAL AND CHEMICAL PARAMETERS</div>
						</td>
					</tr>
					<tr v-for="pcpParam in PCP_Params">
						<td class="text-start">{{ pcpParam.param_name }}</td>
						<td>{{ pcpParam.units }}</td>
						<td>{{ pcpParam.method }}</td>
						<td>
							<div v-if="pcpParam.values !== 'null'">{{ pcpParam.values }}</div>
						</td>
						<td v-for="pcpPrevParamValue in getPrevParam('PCP', pcpParam.param_name)">
							<div v-if="pcpPrevParamValue !== 'null'">{{ pcpPrevParamValue }}</div>
						</td>
					</tr>
					<tr v-if="MA_Params.length !== 0">
						<td :colspan="4 + previousSampleDetails.referenceList.length" class="pa-0">
							<div class="header-style w-100 text-center">METAL ANALYSIS</div>
						</td>
					</tr>
					<tr v-for="maParam in MA_Params">
						<td class="text-start">{{ maParam.param_name }}</td>
						<td>{{ maParam.units }}</td>
						<td>{{ maParam.method }}</td>
						<td>
							<div v-if="maParam.values !== 'null'">{{ maParam.values }}</div>	
						</td>
						<td v-for="maPrevParamValue in getPrevParam('MA', maParam.param_name)">
							<div v-if="maPrevParamValue !== 'null'">{{ maPrevParamValue }}</div>	
						</td>
					</tr>
					<tr v-if="FTIR_Params.length !== 0">
						<td :colspan="4 + previousSampleDetails.referenceList.length" class="pa-0">
							<div class="header-style w-100 text-center">FTIR</div>
						</td>
					</tr>
					<tr v-for="ftirParam in FTIR_Params">
						<td class="text-start">{{ ftirParam.param_name }}</td>
						<td>{{ ftirParam.units }}</td>
						<td>{{ ftirParam.method }}</td>
						<td>
							<div v-if="ftirParam.values !== 'null'">{{ ftirParam.values }}</div>	
						</td>
						<td v-for="fPrevParamValue in getPrevParam('FTIR', ftirParam.param_name)">
							<div v-if="fPrevParamValue !== 'null'">{{ fPrevParamValue }}</div>	
						</td>
					</tr>
				</table>
				<div id="reviewer-section">
					<div class="mb-3">
						<div class="font-weight-bold">DIAGNOSED BY</div>
						<div>{{ sampleData.lub_name }}</div>
					</div>
					<div>
						<div class="font-weight-bold">REVIEWED BY</div>
						<div>Technician Name</div>
					</div>
				</div>
			</div>
		</VCol>
	</VRow>
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

#pdf-template {
	color: #212121;
	padding: 0 32px;
	font-size: 12px;
}

#company-logo {
	background-color: #212121;
	color: #f5f5f5;
	display: inline-block;
}

#oil-reference {
	color: black;
}

.sample-details-title {
	text-align: center;
	background-color: #616161;
	color: #eeeeee;
}

#details-comments {
	width: 70%;
}

#details-status {
	width: 30%;
	min-height: 100px;
}

#details-status div:nth-child(2) {
	height: 100%;
}

#params-table {
	width: 100%;
	border-collapse: collapse;
}

#params-table td {
	text-align: center;
	padding: 5px;
	border: 2px solid #eeeeee;
}

#params-table td div:only-child {
	text-align: center;
}

#params-table tr th {
	background-color: #616161;
	color: #eeeeee;
	padding: 2px;
}

.header-style {
	background-color: #616161;
	color: #eeeeee;
	padding: 4px;
}
.text-green-darken-3 {
	color: #2e7d32;
}
.text-orange-darken-3 {
	color: #ef6c00
}
.text-red-darken-4 {
	color: #b71c1c
}
</style>