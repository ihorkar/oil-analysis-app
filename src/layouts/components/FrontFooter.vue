<template>
  <div id="front-footer">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center">
      &copy;
      {{ new Date().getFullYear() }}
      Made By
      <a
        href="https://irfanarif.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
        >IA</a
      >
    </span>
  </div>
</template>

<style scoped>
#front-footer {
  position: fixed;
  bottom: 0;
  padding: 20px;
}
</style>
