<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="font-weight-bold mb-0">Danh sách phương tiện</h2>
      <b-button variant="primary" to="/vehicles/create">
        <b-icon icon="plus" class="mr-1" />
        Thêm phương tiện
      </b-button>
    </div>

    <b-card class="border-0 shadow-sm">
      <b-table
        :items="vehicles"
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

        <template #cell(license_plate)="{ item }">
          <b-link :to="`/vehicles/${item.id}`">
            {{ item.license_plate }}
          </b-link>
        </template>

        <template #cell(status)="{ item }">
          <b-badge :variant="getStatusVariant(item.status)">
            {{ getStatusText(item.status) }}
          </b-badge>
        </template>

        <template #cell(actions)="{ item }">
          <b-button
            variant="outline-primary"
            size="sm"
            :to="`/vehicles/${item.id}`"
          >
            <b-icon icon="eye" />
          </b-button>
        </template>
      </b-table>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'VehiclesPage',
  
  layout: 'dashboard',

  data() {
    return {
      loading: true,
      vehicles: [],
      fields: [
        { key: 'license_plate', label: 'Biển số' },
        { key: 'brand', label: 'Hãng xe' },
        { key: 'model', label: 'Dòng xe' },
        { key: 'color', label: 'Màu sắc' },
        { key: 'year', label: 'Năm SX' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'actions', label: 'Thao tác', class: 'text-center' }
      ]
    }
  },

  mounted() {
    this.fetchVehicles()
  },

  methods: {
    async fetchVehicles() {
      this.loading = true
      
      try {
        const { data, error } = await this.$supabase
          .from('vehicles')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        this.vehicles = data || []
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      } finally {
        this.loading = false
      }
    },

    getStatusVariant(status) {
      const variants = {
        active: 'success',
        sold: 'secondary',
        pending: 'warning'
      }
      return variants[status] || 'secondary'
    },

    getStatusText(status) {
      const texts = {
        active: 'Đang cầm',
        sold: 'Đã thanh lý',
        pending: 'Chờ xử lý'
      }
      return texts[status] || status
    }
  }
}
</script>
