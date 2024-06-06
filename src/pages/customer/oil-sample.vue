<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
definePage({
  meta: {
    action: "read",
    subject: "AclDemo",
  },
});

const getCurrentTime = () => {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  return dateTime;
};

const rigName = ref("");
const equUsed = ref("");
const modelType = ref("");
const sampleID = ref("");
const lubName = ref("");
const batNum = ref("");
const hrsUnit = ref("");
const hrsOnOil = ref("");
const typesOfOil = ref("");
const delDate = ref("");
const oilBrand = ref("");

const timestamp = getCurrentTime();
</script>

<template>
  <VRow>
    <VCol cols="12" md="8">
      <VForm @submit.prevent="() => {}">
        <VRow>
          <!-- 👉 Rig Name -->
          <VCol cols="12">
            <AppTextField
              v-model="rigName"
              :rules="[requiredValidator]"
              label="Rig Name"
              placeholder="Rig Name"
            />
          </VCol>

          <!-- 👉 Equipment Used -->
          <VCol cols="12">
            <AppTextField
              v-model="equUsed"
              :rules="[requiredValidator]"
              label="Equipment Used"
              placeholder="Equipment Used"
            />
          </VCol>

          <!-- 👉 Model Type -->
          <VCol cols="12">
            <AppTextField
              v-model="modelType"
              :rules="[requiredValidator]"
              label="Model Type"
              placeholder="Model Type"
            />
          </VCol>

          <!-- 👉 Sample Id -->
          <VCol cols="12">
            <AppTextField
              v-model="sampleID"
              :rules="[requiredValidator]"
              label="Sample Id"
              placeholder="Sample Id"
            />
          </VCol>

          <!-- 👉 Country -->
          <VCol cols="12">
            <AppTextField
              v-model="lubName"
              :rules="[requiredValidator]"
              label="Lubricant Name"
              placeholder="Lubricant Name"
            />
          </VCol>

          <!-- 👉 Batch Numbers -->
          <VCol cols="12">
            <AppTextField
              v-model="batNum"
              :rules="[requiredValidator]"
              label="Batch Numbers"
              placeholder="Batch Numbers"
            />
          </VCol>

          <!-- 👉 Hrs Unit -->
          <VCol cols="12">
            <AppTextField
              v-model="hrsUnit"
              :rules="[requiredValidator]"
              label="Hrs Unit"
              placeholder="Hrs Unit"
            />
          </VCol>

          <!-- 👉 Hrs On Oil -->
          <VCol cols="12">
            <AppTextField
              v-model="hrsOnOil"
              :rules="[requiredValidator]"
              label="Hrs On Oil"
              placeholder="Hrs On Oil"
            />
          </VCol>

          <!-- 👉 Types Of Oil -->
          <VCol cols="12">
            <AppTextField
              v-model="typesOfOil"
              :rules="[requiredValidator]"
              label="Types Of Oil"
              placeholder="Types Of Oil"
            />
          </VCol>

          <!-- 👉 Deliery Date -->
          <VCol cols="12">
            <AppTextField
              v-model="delDate"
              :rules="[requiredValidator]"
              label="Deliery Date"
              placeholder="Deliery Date"
            />
          </VCol>

          <!-- 👉 Oil Brand -->
          <VCol cols="12">
            <AppTextField
              v-model="oilBrand"
              :rules="[requiredValidator]"
              label="Oil Brand"
              placeholder="Oil Brand"
            />
          </VCol>

          <VCol cols="12" class="d-flex gap-4">
            <VBtn type="submit"> Submit </VBtn>

            <VBtn type="reset" color="secondary" variant="tonal"> Reset </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCol>
    <VCol cols="12" md="4">
      <VCard>
        <VCardItem>
          <VCardTitle>Generated Label</VCardTitle>
        </VCardItem>
        <VDivider></VDivider>
        <VCardItem>
          <VCard>
            <div class="d-flex justify-space-between mb-5">
              <span class="font-weight-bold">Reference Number</span>
              <span>QAL5533686</span>
            </div>
            <div class="d-flex justify-space-between mb-5">
              <span class="font-weight-bold">Created</span>
              <span>{{ timestamp }}</span>
            </div>
            <div class="d-flex justify-space-between mb-10">
              <span class="font-weight-bold">Provider</span>
              <span>oilanalysis.app</span>
            </div>
            <div class="d-flex justify-center">
              <QrcodeVue
                :style="{ background: 'white', padding: '20px' }"
                value="localhost:5173/customer/oil-sample"
                :size="200"
                level="H"
              ></QrcodeVue>
            </div>
          </VCard>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>
</template>
