<template>
  <div>
    <h2 class="font-weight-bold mb-4">Báo cáo</h2>

    <b-row class="mb-4">
      <b-col md="6" lg="3">
        <b-card class="stat-card border-0 shadow-sm">
          <h6 class="text-muted">Tổng doanh thu (tháng)</h6>
          <h3 class="font-weight-bold text-success">{{ formatMoney(stats.monthlyRevenue) }}</h3>
        </b-card>
      </b-col>
      <b-col md="6" lg="3">
        <b-card class="stat-card border-0 shadow-sm">
          <h6 class="text-muted">Lợi nhuận (tháng)</h6>
          <h3 class="font-weight-bold text-primary">{{ formatMoney(stats.monthlyProfit) }}</h3>
        </b-card>
      </b-col>
      <b-col md="6" lg="3">
        <b-card class="stat-card border-0 shadow-sm">
          <h6 class="text-muted">Hợp đồng mới</h6>
          <h3 class="font-weight-bold text-info">{{ stats.newContracts }}</h3>
        </b-card>
      </b-col>
      <b-col md="6" lg="3">
        <b-card class="stat-card border-0 shadow-sm">
          <h6 class="text-muted">Hợp đồng đóng</h6>
          <h3 class="font-weight-bold text-warning">{{ stats.closedContracts }}</h3>
        </b-card>
      </b-col>
    </b-row>

    <b-card class="border-0 shadow-sm">
      <template #header>
        <h5 class="mb-0 font-weight-bold">Báo cáo chi tiết</h5>
      </template>
      <p class="text-muted">Tính năng báo cáo đang được phát triển...</p>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ReportsPage',
  
  layout: 'dashboard',

  data() {
    return {
      stats: {
        monthlyRevenue: 0,
        monthlyProfit: 0,
        newContracts: 0,
        closedContracts: 0
      }
    }
  },

  methods: {
    formatMoney(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(amount || 0)
    }
  }
}
</script>
