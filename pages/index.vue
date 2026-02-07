<template>
  <div class="dashboard-home">
    <div class="welcome-container text-center py-5">
      <div class="mb-4">
        <b-icon icon="lightning-fill" variant="primary" font-scale="4" />
      </div>
      <h2 class="font-weight-bold">Chào mừng tới hệ thống Quản Lý Cầm Xe</h2>
      <p class="text-muted">Hệ thống đang được cấu hình lại. Vui lòng chọn tính năng từ menu.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardHome',
  layout: 'dashboard'
}
</script>

<style scoped>
.welcome-container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-gray-200);
  margin-top: var(--space-8);
}
</style>
