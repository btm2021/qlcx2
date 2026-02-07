<template>
  <div class="card border-0 shadow-lg">
    <div class="card-body p-4 p-md-5">
      <div class="text-center mb-4">
        <h4 class="font-weight-bold mb-1">Quên mật khẩu?</h4>
        <p class="text-muted small">Nhập email của bạn để nhận link đặt lại mật khẩu</p>
      </div>

      <b-form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="form-label">Email tài khoản</label>
          <b-form-input
            id="email"
            v-model="email"
            type="email"
            class="form-control form-control-lg"
            placeholder="example@gmail.com"
            required
          />
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-lg w-100 py-3 mb-3"
          :disabled="loading || !email"
        >
          <b-spinner v-if="loading" small class="mr-2" />
          <b-icon v-else icon="envelope" class="mr-2" />
          {{ loading ? 'Đang gửi...' : 'Gửi link đặt lại' }}
        </button>
      </b-form>

      <div class="text-center mt-3">
        <b-link to="/login" class="text-secondary small font-weight-medium">
          <b-icon icon="arrow-left" class="mr-1" />
          Quay lại đăng nhập
        </b-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPasswordPage',
  
  layout: 'auth',

  data() {
    return {
      email: '',
      loading: false
    }
  },

  methods: {
    async handleSubmit() {
      this.loading = true

      try {
        const { error } = await this.$supabase.auth.api.resetPasswordForEmail(this.email, {
          redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) throw error

        this.$bvToast.toast('Link đặt lại mật khẩu đã được gửi đến email của bạn!', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
          noAutoHide: true
        })

        this.email = ''
      } catch (error) {
        console.error('Reset password error:', error)
        
        this.$bvToast.toast(error.message || 'Không thể gửi email đặt lại mật khẩu', {
          title: 'Lỗi',
          variant: 'danger',
          solid: true
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
