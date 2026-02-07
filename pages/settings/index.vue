<template>
  <div>
    <h2 class="font-weight-bold mb-4">Cài đặt</h2>

    <b-card class="border-0 shadow-sm">
      <template #header>
        <h5 class="mb-0 font-weight-bold">Cài đặt hệ thống</h5>
      </template>

      <b-form @submit.prevent="saveSettings">
        <b-form-group label="Tên cửa hàng">
          <b-form-input v-model="settings.storeName" placeholder="Bảo Phương Store" />
        </b-form-group>

        <b-form-group label="Lãi suất mặc định (%/tháng)">
          <b-form-input v-model="settings.defaultInterestRate" type="number" step="0.1" />
        </b-form-group>

        <b-form-group label="Thời hạn cầm mặc định (ngày)">
          <b-form-input v-model="settings.defaultTerm" type="number" />
        </b-form-group>

        <b-button type="submit" variant="primary">
          <b-icon icon="save" class="mr-2" />
          Lưu cài đặt
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  
  layout: 'dashboard',

  data() {
    return {
      settings: {
        storeName: 'Bảo Phương Store',
        defaultInterestRate: 3,
        defaultTerm: 30
      }
    }
  },

  methods: {
    saveSettings() {
      // Lưu vào localStorage hoặc Supabase
      localStorage.setItem('app_settings', JSON.stringify(this.settings))
      
      this.$bvToast.toast('Đã lưu cài đặt thành công!', {
        title: 'Thành công',
        variant: 'success'
      })
    }
  },

  mounted() {
    const saved = localStorage.getItem('app_settings')
    if (saved) {
      this.settings = JSON.parse(saved)
    }
  }
}
</script>
