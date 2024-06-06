<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

const logisticData = ref([
	{ icon: 'tabler-ticket', color: 'primary', title: 'Received Samples', value: 0, isHover: false },
	{ icon: 'tabler-car', color: 'info', title: 'In-Route Samples', value: 0, isHover: false },
	{ icon: 'tabler-hourglass', color: 'warning', title: 'Under Process', value: 0, isHover: false },
	{ icon: 'tabler-thumb-up', color: 'success', title: 'Completed Reports', value: 0, isHover: false },
])

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

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

let originalOilSamples = ref()
let oilSamples = ref()
let totalSamples = ref()

const resolveStatus = (status: string) => {
	if (status === 'test_received') {
		return { text: 'Received', color: 'primary' }
	} else {
		if (status === 'test_assigned') {
			return { text: 'Assigned', color: 'info' }
		} if (status === 'reviewed') {
			return { text: 'Review', color: 'warning'}
		}	else {
			return { text: 'Completed', color: 'success' }
		}
	}
}

const getDate = (dateValue: any) => {
    const year = String(dateValue.getFullYear())
    const month = String(dateValue.getMonth() + 1)
    const date = String(dateValue.getDate())
    
    return `${year}-${month}-${date}`
}

const setLogisticData = (data: any) => { 
	const todayOilSamples = data.filter((item: any) => {
    const inputDate = getDate(new Date(item.attributes.timestamp))
    const todaydate = getDate(new Date())
    return inputDate === todaydate
  })
	const receivedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'test_received'
  })
	const assignedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'sales_received'
  })
	const reviewedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'test_assigned'
  })
	const completedOilSamples = todayOilSamples.filter((item: any) => {
    return item.attributes.status === 'reviewed'
  })
  const logisticInfo = [
    { icon: 'tabler-ticket', color: 'primary', title: 'Received Samples', value: receivedOilSamples.length, isHover: false },
    { icon: 'tabler-car', color: 'info', title: 'In-Route Samples', value: assignedOilSamples.length, isHover: false },
    { icon: 'tabler-hourglass', color: 'warning', title: 'Ready for Analysis', value: reviewedOilSamples.length, isHover: false },
    { icon: 'tabler-thumb-up', color: 'success', title: 'Ready for Review', value: completedOilSamples.length, isHover: false },
  ]
  logisticData.value = logisticInfo
}

const jwtToken = useCookie('jwt').value;
const oilSampleURI = '/api/oil-samples?tested=true'

const fetchOilSamples = async () => {
	let oilSampleData = await $api(oilSampleURI, {
		headers: {
			authorization: `Bearer ${jwtToken}`
		}
	})
	.then(res => {
		originalOilSamples = res.data
		oilSamples.value = res.data.filter((item: any) => {
			return item.attributes.status !== 'sales_received' && item.attributes.status !== 'created'
		})
		.map((item: any) => {
			return {
				id: item.id,
				data: item.attributes,
				company: item.attributes.company,
				oilBrand: item.attributes.oil_brand,
				status: item.attributes.status
			}
		})
		totalSamples = oilSamples.value.length
		setLogisticData(originalOilSamples)
	})
	
}

fetchOilSamples()

</script>
<template>
	<VRow class="match-height">
		<VCol cols="12">
			<VRow>
				<VCol v-for="(data, index) in logisticData" :key="index" cols="12" md="3" sm="6">
					<div>
						<VCard class="logistics-card-statistics cursor-pointer"
							:style="data.isHover ? { 'border-block-end': `2px solid rgba(var(--v-theme-${data.color}))` } : { 'border-block-end': `2px solid rgba(var(--v-theme-${data.color}), var(--v-disabled-opacity))` }"
							@mouseenter="data.isHover = true" @mouseleave="data.isHover = false">
							<VCardText>
								<div class="d-flex align-center gap-x-4 mb-2">
									<VAvatar variant="tonal" :color="data.color" rounded>
										<VIcon :icon="data.icon" size="28" />
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
						<VCardTitle>All Oil Samples</VCardTitle>
						<div>
							<AppTextField v-model="searchQuery" style="max-inline-size: 200px; min-inline-size: 200px;"
								placeholder="Search .." density="compact" />
						</div>
					</div>
				</VCardText>

				<VDivider />
				<VDataTableServer 
					:items="oilSamples" 
					:headers="headers"
					:items-length="totalSamples" 
					v-model:items-per-page="itemsPerPage" 
					v-model:page="page" 
					show-select 
					class="text-no-wrap" 
					@update:options="updateOptions">
					<template #item.data="{ item }">
						<div class="d-flex align-center gap-x-3">
							<div class="d-flex flex-column">
								<div>
									<h6 class="text-h6 cursor-pointer" @click="$router.push({ path: '/labs/view/EnterResults', query: { id: item.id } })">
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
						<VChip v-bind="resolveStatus(item.status)" label />
					</template>

					<template #item.totalSpent="{ item }">
						<span class="text-body-1 font-weight-medium text-high-emphasis">${{ item.totalSpent }}</span>
					</template>

					<template #item.actions="{ item }">
						<IconBtn>
							<VIcon icon="tabler-dots-vertical" />
							<VMenu activator="parent">
								<VList>
									<!-- <VListItem value="view" @click="">
										View
									</VListItem> -->
									<VListItem value="view"
										@click="$router.push({ path: '/labs/view/EnterResults', query: { id: item.id } })">
										View
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

							<VPagination v-model="page" :length="Math.ceil(totalSamples / itemsPerPage)"
								:total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalSamples / itemsPerPage), 5)">
								<template #prev="slotProps">
									<VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
										Previous
									</VBtn>
								</template>

								<template #next="slotProps">
									<VBtn variant="tonal" color="default" v-bind="slotProps" :icon="false">
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
</template>