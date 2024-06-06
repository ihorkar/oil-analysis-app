<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/VDataTable'
import QrcodeVue from 'qrcode.vue'

import avatar1 from '@images/avatars/avatar-1.png'
import product21 from '@images/ecommerce-images/product-21.png'
import product22 from '@images/ecommerce-images/product-22.png'
import product23 from '@images/ecommerce-images/product-23.png'
import product24 from '@images/ecommerce-images/product-24.png'

const route = useRoute('apps-ecommerce-order-details-id')
const isConfirmDialogVisible = ref(false)
const isUserInfoEditDialogVisible = ref(false)
const isEditAddressDialogVisible = ref(false)

const headers = [
  { title: 'Product', key: 'productName' },
  { title: 'Price', key: 'price' },
  { title: 'Quantity', key: 'quantity' },
  { title: 'Total', key: 'total' },
]

const orderData = [
  {
    productName: 'OnePlus 7 Pro',
    productImage: product21,
    subtitle: 'Storage: 128gb',
    price: 799,
    quantity: 1,
    total: 799,
  },
  {
    productName: 'Face Cream',
    productImage: product22,
    subtitle: 'Gender: Women',
    price: 89,
    quantity: 1,
    total: 89,
  },
  {
    productName: 'Wooden Chair',
    productImage: product23,
    subtitle: 'Material: Woodem',
    price: 289,
    quantity: 2,
    total: 578,
  },
  {
    productName: 'Nike Jorden',
    productImage: product24,
    subtitle: 'Size: 8UK',
    price: 299,
    quantity: 2,
    total: 598,
  },
]
</script>

<template>
  <div>
    <div class="d-flex justify-space-between align-center flex-wrap gap-y-4 mb-6">
      <div>
        <div class="d-flex gap-2 align-center mb-2 flex-wrap">
          <h4 class="text-h4">
            Sample #{{ route.params.id }}
          </h4>
          <div class="d-flex gap-x-2">
            <VChip
              variant="tonal"
              color="success"
              label
            >
              Delivered
            </VChip>
            <VChip
              variant="tonal"
              color="warning"
              label
            >
              No Billable
            </VChip>
          </div>
        </div>
        <div>
          <span class="text-body-1">
            Aug 17, 2020, 5:48 (ET)
          </span>
        </div>
      </div>
    </div>

    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <!-- 👉 Order Details -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              <div class="d-flex justify-space-between align-center">
                <h5 class="text-h5">
                  Sample Details
                </h5>
                <VBtn>
                  Dispatch to Laboratory
                </VBtn>
              </div>
            </template>
            <!-- <template #append>
              <VBtn variant="text">
                Edit
              </VBtn>
            </template> -->
          </VCardItem>

          <VDivider />
          

          <VCardText>
            <VRow>
              <VCol cols="12" md="8">
                <div class="mb-3"><span class="font-weight-bold mr-5">Rig Name:</span> JV-1 Lovanda</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Model Type:</span> Atlas Copco GA 110</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Batch Numbers:</span> Atlas Copco GA 110</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Hrs On Oil:</span> Atlas Copco GA 110</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Deliver Date:</span> Atlas Copco GA 110</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Equipment Used:</span> Air Compressor #1</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Lubricant Name:</span> Atlas Copco Roto Synthetic</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Hrs Unit:</span> Atlas Copco GA 110</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Type Of Oil:</span> Atlas Copco GA 110</div>
                <div class="mb-3"><span class="font-weight-bold mr-5">Oil Brand:</span> Atlas Copco GA 110</div>
              </VCol>
              <VCol cols="12" md="4">
                <div class="d-flex flex-column">
                  <div class="font-weight-bold mb-5 align-self-start">QR Code:</div>
                  <QrcodeVue :style="{background: 'white', padding: '20px'}" value="localhost:5173" :size="200" level="H"></QrcodeVue>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol
        cols="12"
        md="4"
      >
        <!-- 👉 Customer Details  -->
        <VCard class="mb-6">
          <VCardText class="d-flex flex-column gap-y-6">
            <div class="text-body-1 text-high-emphasis font-weight-medium">
              Customer Details
            </div>

            <div class="d-flex align-center">
              <VAvatar
                :image="avatar1"
                class="me-3"
              />
              <div>
                <div class="text-body-1 font-weight-medium">
                  Shamus Tuttle
                </div>
                <span class="text-sm text-disabled">Customer ID: #47389</span>
              </div>
            </div>

            <div>
              <VAvatar
                variant="tonal"
                color="success"
                class="me-3"
              >
                <VIcon icon="tabler-shopping-cart" />
              </VAvatar>
              <span class="text-body-1 font-weight-medium text-high-emphasis">12 Samples</span>
            </div>

            <div class="d-flex flex-column gap-y-1">
              <div class="d-flex justify-space-between align-center text-body-2">
                <span class="text-body-1 text-high-emphasis font-weight-medium">Contact Info</span>
                <VBtn
                  variant="text"
                  density="compact"
                  @click="isUserInfoEditDialogVisible = !isUserInfoEditDialogVisible"
                >
                  Edit
                </VBtn>
              </div>
              <span>Email: Sheldon88@yahoo.com</span>
              <span>Mobile: +1 (609) 972-22-22</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <ConfirmDialog
      v-model:isDialogVisible="isConfirmDialogVisible"
      confirmation-question="Are you sure to cancel your Order?"
      cancel-msg="Order cancelled!!"
      cancel-title="Cancelled"
      confirm-msg="Your order cancelled successfully."
      confirm-title="Cancelled!"
    />

    <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" />

    <AddEditAddressDialog v-model:isDialogVisible="isEditAddressDialogVisible" />
  </div>
</template>
