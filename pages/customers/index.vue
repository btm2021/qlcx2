<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="font-weight-bold mb-0">Danh sách khách hàng</h2>
      <b-button variant="primary" to="/customers/create">
        <b-icon icon="plus" class="mr-1" />
        Thêm khách hàng
      </b-button>
    </div>

    <b-card class="border-0 shadow-sm">
      <b-form-input
        v-model="search"
        placeholder="Tìm kiếm khách hàng..."
        class="mb-3"
        @input="debouncedSearch"
      />

      <b-table
        :items="customers"
        :fields="fields"
        responsive
        hover
        :busy="loading"
      >
        <template #table-busy>
          <div class="text-center py-4">
            <b-spinner />
          </div>
        </template>

        <template #cell(full_name)="{ item }">
          <b-link :to="`/customers/${item.id}`">
            {{ item.full_name }}
          </b-link>
        </template>

        <template #cell(phone)="{ item }">
          <a :href="`tel:${item.phone}`">{{ item.phone }}</a>
        </template>

        <template #cell(id_card)="{ item }">
          {{ item.id_card || 'N/A' }}
        </template>

        <template #cell(created_at)="{ item }">
          {{ formatDate(item.created_at) }}
        </template>

        <template #cell(actions)="{ item }">
          <b-button
            variant="outline-primary"
            size="sm"
            :to="`/customers/${item.id}`"
            class="mr-1"
          >
            <b-icon icon="eye" />
          </b-button>
          <b-button
            variant="outline-warning"
            size="sm"
            :to="`/customers/${item.id}/edit`"
          >
            <b-icon icon="pencil" />
          </b-button>
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="center"
        class="mb-0"
      />
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'CustomersPage',
  
  layout: 'dashboard',

  data() {
    return {
      loading: true,
      customers: [],
      search: '',
      currentPage: 1,
      perPage: 10,
      totalRows: 0,
      fields: [
        { key: 'full_name', label: 'Họ tên', sortable: true },
        { key: 'phone', label: 'Số điện thoại' },
        { key: 'id_card', label: 'CMND/CCCD' },
        { key: 'address', label: 'Địa chỉ' },
        { key: 'created_at', label: 'Ngày tạo', sortable: true },
        { key: 'actions', label: 'Thao tác', class: 'text-center' }
      ]
    }
  },

  watch: {
    currentPage() {
      this.fetchCustomers()
    }
  },

  mounted() {
    this.fetchCustomers()
  },

  methods: {
    async fetchCustomers() {
      this.loading = true
      
      try {
        const { data, count, error } = await this.$supabase
          .from('customers')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage - 1)

        if (error) throw error

        this.customers = data || []
        this.totalRows = count || 0
      } catch (error) {
        console.error('Error fetching customers:', error)
      } finally {
        this.loading = false
      }
    },

    debouncedSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1
        this.fetchCustomers()
      }, 300)
    },

    formatDate(date) {
      if (!date) return 'N/A'
      return this.$moment(date).format('DD/MM/YYYY')
    }
  }
}
</script>
