<script setup lang="ts">
import { VForm } from "vuetify/components/VForm";

import AuthProvider from "@/views/pages/authentication/AuthProvider.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";

import authV2RegisterIllustrationBorderedDark from "@images/pages/auth-login-page-oa.png";
import authV2RegisterIllustrationBorderedLight from "@images/pages/auth-login-page-oa.png";
import authV2RegisterIllustrationDark from "@images/pages/auth-login-page-oa.png";
import authV2RegisterIllustrationLight from "@images/pages/auth-login-page-oa.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";

const imageVariant = useGenerateImageVariant(
  authV2RegisterIllustrationLight,
  authV2RegisterIllustrationDark,
  authV2RegisterIllustrationBorderedLight,
  authV2RegisterIllustrationBorderedDark,
  true
);

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

definePage({
  meta: {
    layout: "blank",
    unauthenticatedOnly: true,
  },
});

const route = useRoute();
const router = useRouter();

const refVForm = ref<VForm>();

const form = ref({
  username: "",
  email: "",
  password: "",
  privacyPolicies: false,
});

const errors = ref<Record<string, string | undefined>>({
  username: undefined,
  email: undefined,
  password: undefined,
});

const isPasswordVisible = ref(false);

const register = async () => {
  const { username, email, password } = form.value;

  try {
    const res = await $api("/api/auth/local/register", {
      method: "post",
      body: {
        username: username,
        email: email,
        password: password,
      },
      onResponseError({ response }) {
        errors.value = response._data.errors;
      },
    });

    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : "/");
    });
  } catch {}
};

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) register();
  });
};
</script>

<template>
  <VRow no-gutters class="auth-wrapper bg-surface">
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background rounded-lg w-100 ma-8 me-0">
        <div class="d-flex align-center justify-center w-100 h-100">
          <VImg
            max-width="441"
            :src="imageVariant"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <VImg class="auth-footer-mask" :src="authThemeMask" />
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface))"
    >
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText class="d-flex justify-center">
          <VNodeRenderer :nodes="themeConfig.app.logo" class="mb-6 mr-4" />
          <h5 class="text-h5 mb-1">Signup</h5>
        </VCardText>

        <VCardText>
          <VForm ref="refVForm" @submit.prevent="() => onSubmit()">
            <VRow>
              <!-- Username -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.username"
                  :rules="[requiredValidator]"
                  autofocus
                  label="Username"
                  placeholder="Johndoe"
                />
              </VCol>

              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  type="email"
                  placeholder="ia@oilanalysis.app"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.password"
                  :rules="[requiredValidator]"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  class="mb-8"
                />

                <VBtn block type="submit"> Sign up </VBtn>
              </VCol>

              <!-- create account -->
              <VCol cols="12" class="text-center text-base">
                <span>Already have an account?</span>
                <RouterLink class="text-primary ms-2" :to="{ name: 'login' }">
                  Sign in instead
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
