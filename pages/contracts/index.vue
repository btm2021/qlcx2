<template>
  <div>
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h5 class="font-weight-bold mb-0">Danh sách hợp đồng</h5>
      <b-button variant="primary" size="sm" to="/contracts/create">
        <b-icon icon="plus" class="mr-1" />Tạo HĐ
      </b-button>
    </div>

    <!-- Filters -->
    <b-card class="mb-2 border-0" body-class="p-2">
      <b-row>
        <b-col md="4">
          <b-form-input
            v-model="search"
            size="sm"
            placeholder="Tìm kiếm..."
            @input="debouncedSearch"
          />
        </b-col>
        <b-col md="3">
          <b-form-select
            v-model="statusFilter"
            size="sm"
            :options="statusOptions"
            @change="fetchData"
          />
        </b-col>
      </b-row>
    </b-card>

    <!-- Table -->
    <b-card class="border-0" body-class="p-0">
      <div class="table-responsive">
        <b-table
          :items="contracts"
          :fields="fields"
          small
          hover
          :busy="loading"
          class="mb-0"
          tbody-tr-class="small"
        >
          <template #table-busy>
            <div class="text-center py-3">
              <b-spinner small />
            </div>
          </template>

          <template #cell(contract_code)="{ item }">
            <nuxt-link :to="`/contracts/${item.id}`" class="small">
              {{ item.contract_code }}
            </nuxt-link>
          </template>

          <template #cell(customer)="{ item }">
            <span class="small">{{ item.customers?.full_name || 'N/A' }}</span>
          </template>

          <template #cell(loan_amount)="{ item }">
            <span class="small font-weight-bold text-primary">
              {{ formatMoney(item.loan_amount) }}
            </span>
          </template>

          <template #cell(status)="{ item }">
            <b-badge :variant="getStatusVariant(item.status)" class="badge-sm">
              {{ getStatusText(item.status) }}
            </b-badge>
          </template>

          <template #cell(actions)="{ item }">
            <div class="d-flex gap-1 justify-content-center">
              <b-button
                variant="link"
                size="sm"
                class="p-0"
                :to="`/contracts/${item.id}`"
              >
                <b-icon icon="eye" />
              </b-button>
              <b-button
                variant="link"
                size="sm"
                class="p-0"
                :to="`/contracts/${item.id}/edit`"
              >
                <b-icon icon="pencil" />
              </b-button>
            </div>
          </template>
        </b-table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center p-2 border-top">
        <b-button
          variant="outline-secondary"
          size="sm"
          :disabled="currentPage === 1"
          @click="changePage(-1)"
        >
          <b-icon icon="chevron-left" />
        </b-button>
        <span class="mx-2 small">{{ currentPage }} / {{ totalPages }}</span>
        <b-button
          variant="outline-secondary"
          size="sm"
          :disabled="currentPage === totalPages"
          @click="changePage(1)"
        >
          <b-icon icon="chevron-right" />
        </b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'ContractsPage',
  layout: 'dashboard',

  data() {
    return {
      loading: true,
      contracts: [],
      search: '',
      statusFilter: '',
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      fields: [
        { key: 'contract_code', label: 'Mã HĐ' },
        { key: 'customer', label: 'Khách hàng' },
        { key: 'loan_amount', label: 'Số tiền', class: 'text-right' },
        { key: 'start_date', label: 'Ngày cầm' },
        { key: 'end_date', label: 'Hết hạn' },
        { key: 'status', label: 'Trạng thái', class: 'text-center' },
        { key: 'actions', label: 'Thao tác', class: 'text-center' }
      ],
      statusOptions: [
        { value: '', text: 'Tất cả trạng thái' },
        { value: 'active', text: 'Đang cầm' },
        { value: 'expired', text: 'Hết hạn' },
        { value: 'closed', text: 'Đã đóng' },
        { value: 'pending', text: 'Chờ xử lý' }
      ]
    }
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalRows / this.perPage)
    }
  },

  mounted() {
    this.fetchData()
  },

  methods: {
    async fetchData() {
      this.loading = true
      try {
        let query = this.$supabase
          .from('contracts')
          .select('*, customers(full_name)', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage - 1)

        if (this.statusFilter) {
          query = query.eq('status', this.statusFilter)
        }

        const { data, count, error } = await query
        if (error) throw error

        this.contracts = data || []
        this.totalRows = count || 0
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.loading = false
      }
    },

    changePage(delta) {
      this.currentPage += delta
      this.fetchData()
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.fetchData()
      }, 300)
    },

    formatMoney(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0
      }).format(amount || 0)
    },

    formatDate(date) {
      if (!date) return '-'
      return this.$moment(date).format('DD/MM/YY')
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
.badge-sm {
  font-size: 0.625rem;
  padding: 0.2em 0.4em;
}

.gap-1 {
  gap: 0.25rem;
}
</style>
