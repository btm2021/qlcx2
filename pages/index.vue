<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h5 class="font-weight-bold mb-0">Tổng quan</h5>
      <b-button variant="primary" size="sm" to="/contracts/create">
        <b-icon icon="plus" class="mr-1" />Tạo HĐ
      </b-button>
    </div>

    <!-- Stats -->
    <b-row class="mb-2">
      <b-col cols="6" lg="3" v-for="stat in statsList" :key="stat.key" class="mb-2">
        <b-card class="stat-card border-0" body-class="p-2">
          <div class="d-flex align-items-center">
            <b-icon :icon="stat.icon" :variant="stat.variant" font-scale="1.5" class="mr-2" />
            <div>
              <div class="font-weight-bold">{{ stat.value }}</div>
              <small class="text-muted">{{ stat.label }}</small>
            </div>
          </div>
        </b-card>
      </b-col>
    </b-row>

    <!-- Content -->
    <b-row>
      <!-- Left -->
      <b-col lg="8" class="mb-2">
        <b-card class="border-0" body-class="p-0">
          <div class="d-flex justify-content-between align-items-center p-2 border-bottom">
            <span class="font-weight-bold small">Hợp đồng gần đây</span>
            <b-link to="/contracts" class="small">Xem tất cả</b-link>
          </div>
          <div class="table-responsive">
            <table class="table table-sm table-hover mb-0">
              <thead>
                <tr>
                  <th class="small">Mã HĐ</th>
                  <th class="small">Khách hàng</th>
                  <th class="small text-right">Số tiền</th>
                  <th class="small text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in recentContracts" :key="item.id">
                  <td class="small py-1">
                    <nuxt-link :to="`/contracts/${item.id}`">{{ item.contract_code }}</nuxt-link>
                  </td>
                  <td class="small py-1">{{ item.customers?.full_name || 'N/A' }}</td>
                  <td class="small py-1 text-right font-weight-bold text-primary">
                    {{ formatMoneyCompact(item.loan_amount) }}
                  </td>
                  <td class="small py-1 text-center">
                    <b-badge :variant="getStatusVariant(item.status)" class="badge-sm">
                      {{ getStatusText(item.status) }}
                    </b-badge>
                  </td>
                </tr>
                <tr v-if="recentContracts.length === 0">
                  <td colspan="4" class="text-center text-muted small py-3">
                    Chưa có hợp đồng nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-card>
      </b-col>

      <!-- Right -->
      <b-col lg="4" class="mb-2">
        <b-card class="border-0" body-class="p-0">
          <div class="p-2 border-bottom font-weight-bold small">
            <b-icon icon="bell" variant="warning" class="mr-1" />
            Sắp đến hạn
          </div>
          <b-list-group flush>
            <b-list-group-item
              v-for="item in upcomingDue"
              :key="item.id"
              class="d-flex justify-content-between align-items-center py-1 px-2"
            >
              <div>
                <div class="small text-muted">{{ item.contract_code }}</div>
                <div class="small font-weight-bold">{{ item.customers?.full_name }}</div>
              </div>
              <div class="text-right">
                <div class="small font-weight-bold text-primary">
                  {{ formatMoneyCompact(item.loan_amount) }}
                </div>
                <div class="small text-danger">{{ formatDate(item.end_date) }}</div>
              </div>
            </b-list-group-item>
            <b-list-group-item v-if="upcomingDue.length === 0" class="text-center text-muted small py-3">
              Không có hợp đồng sắp hết hạn
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </b-col>
    </b-row>

    <!-- Actions -->
    <b-row>
      <b-col v-for="action in quickActions" :key="action.key" cols="6" md="3" class="mb-2">
        <b-button block :variant="action.variant" size="sm" :to="action.to">
          <b-icon :icon="action.icon" class="mr-1" />{{ action.label }}
        </b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',
  layout: 'dashboard',

  data() {
    return {
      stats: {
        totalContracts: 0,
        totalValue: 0,
        expiringSoon: 0,
        totalCustomers: 0
      },
      recentContracts: [],
      upcomingDue: [],
      quickActions: [
        { key: 'contract', label: 'Tạo HĐ', icon: 'file-earmark-plus', variant: 'outline-primary', to: '/contracts/create' },
        { key: 'customer', label: 'Thêm KH', icon: 'person-plus', variant: 'outline-success', to: '/customers/create' },
        { key: 'report', label: 'Báo cáo', icon: 'graph-up', variant: 'outline-info', to: '/reports' },
        { key: 'vehicle', label: 'Xe cầm', icon: 'car-front', variant: 'outline-warning', to: '/vehicles' }
      ]
    }
  },

  computed: {
    statsList() {
      return [
        { key: 'contracts', label: 'Hợp đồng', value: this.stats.totalContracts, icon: 'file-text', variant: 'primary' },
        { key: 'value', label: 'Tổng giá trị', value: this.formatMoneyCompact(this.stats.totalValue), icon: 'cash-stack', variant: 'success' },
        { key: 'expiring', label: 'Sắp hết hạn', value: this.stats.expiringSoon, icon: 'clock', variant: 'warning' },
        { key: 'customers', label: 'Khách hàng', value: this.stats.totalCustomers, icon: 'people', variant: 'info' }
      ]
    }
  },

  async mounted() {
    await this.fetchData()
  },

  methods: {
    async fetchData() {
      try {
        const { count: totalContracts } = await this.$supabase
          .from('contracts').select('*', { count: 'exact', head: true })
        
        const { count: totalCustomers } = await this.$supabase
          .from('customers').select('*', { count: 'exact', head: true })

        const { data: contracts } = await this.$supabase
          .from('contracts')
          .select('*, customers(full_name)')
          .order('created_at', { ascending: false })
          .limit(5)

        const sevenDaysLater = new Date()
        sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
        
        const { data: expiring } = await this.$supabase
          .from('contracts')
          .select('*, customers(full_name)')
          .lte('end_date', sevenDaysLater.toISOString())
          .gte('end_date', new Date().toISOString())
          .eq('status', 'active')
          .order('end_date')

        this.stats = {
          totalContracts: totalContracts || 0,
          totalValue: contracts?.reduce((sum, c) => sum + (c.loan_amount || 0), 0) || 0,
          expiringSoon: expiring?.length || 0,
          totalCustomers: totalCustomers || 0
        }
        
        this.recentContracts = contracts || []
        this.upcomingDue = expiring || []
      } catch (error) {
        console.error('Error:', error)
      }
    },

    formatMoneyCompact(amount) {
      const num = amount || 0
      if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'T'
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'tr'
      if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
      return num.toString()
    },

    formatDate(date) {
      if (!date) return '-'
      return this.$moment(date).format('DD/MM')
    },

    getStatusVariant(status) {
      const variants = { active: 'success', expired: 'danger', closed: 'secondary', pending: 'warning' }
      return variants[status] || 'secondary'
    },

    getStatusText(status) {
      const texts = { active: 'Cầm', expired: 'Hết', closed: 'Đóng', pending: 'Chờ' }
      return texts[status] || status
    }
  }
}
</script>

<style scoped>
.stat-card {
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.badge-sm {
  font-size: 0.625rem;
  padding: 0.2em 0.4em;
}
</style>
