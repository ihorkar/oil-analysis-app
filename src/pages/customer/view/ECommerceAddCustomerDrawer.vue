<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { VForm } from 'vuetify/components/VForm'

interface Props {
  isDrawerOpen: boolean
}

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}

const refVForm = ref<VForm>()
const name = ref()
const email = ref()
const mobile = ref()
const department = ref()
const position = ref()
const company = ref()
const state = ref()

const resetForm = () => {
  refVForm.value?.reset()
  emit('update:isDrawerOpen', false)
}
</script>

<template>
  <VNavigationDrawer
    :model-value="props.isDrawerOpen"
    temporary
    location="end"
    width="370"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      title="Add a Customer"
      @cancel="$emit('update:isDrawerOpen', false)"
    />

    <VDivider />

    <VCard flat>
      <PerfectScrollbar
        :options="{ wheelPropagation: false }"
        class="h-100"
      >
        <VCardText style="block-size: calc(100vh - 5rem);">
          <VForm
            ref="refVForm"
            @submit.prevent=""
          >
            <VRow>
              <VCol>
                <div class="text-body-1 font-weight-medium text-high-emphasis">
                  Basic Information
                </div>
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="name"
                  label="Name*"
                  :rules="[requiredValidator]"
                  placeholder="John Doe"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email*"
                  :rules="[requiredValidator, emailValidator]"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="mobile"
                  label="mobile*"
                  :rules="[requiredValidator]"
                  placeholder="+(123) 456-7890"
                />
              </VCol>

              <VCol>
                <div class="text-body-1 font-weight-medium text-high-emphasis">
                  Details Information
                </div>
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="company"
                  label="Company*"
                  :rules="[requiredValidator]"
                  placeholder="Microsoft"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="position"
                  placeholder="Marketing manager"
                  :rules="[requiredValidator]"
                  label="Position*"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="department"
                  label="Department*"
                  :rules="[requiredValidator]"
                  placeholder="Marketing Team"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField
                  v-model="state"
                  placeholder="Technical"
                  :rules="[requiredValidator]"
                  label="Role*"
                />
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-start">
                  <VBtn
                    type="submit"
                    color="primary"
                    class="me-4"
                  >
                    Add
                  </VBtn>
                  <VBtn
                    color="error"
                    variant="tonal"
                    @click="resetForm"
                  >
                    Discard
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </PerfectScrollbar>
    </VCard>
  </VNavigationDrawer>
</template>

<style lang="scss">
.v-navigation-drawer__content {
  overflow-y: hidden !important;
}
</style>
