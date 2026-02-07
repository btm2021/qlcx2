<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Logo/Header -->
        <div class="login-header">

          <h1 class="brand-title">Quản lí</h1>

        </div>

        <!-- Form -->
        <b-form @submit.prevent="handleLogin" class="login-form">
          <div class="mb-4">
            <label class="form-label">Email</label>
            <b-form-input v-model="form.email" type="email" class="form-control form-control-lg"
              placeholder="name@example.com" required autocomplete="email" />
          </div>

          <div class="mb-4">
            <div class="d-flex justify-content-between mb-2">
              <label class="form-label mb-0">Mật khẩu</label>
              <b-link to="/forgot-password" class="small text-muted">Quên mật khẩu?</b-link>
            </div>
            <div class="position-relative">
              <b-form-input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                class="form-control form-control-lg" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" class="btn-toggle-view" @click="showPassword = !showPassword" tabindex="-1">
                <b-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </div>
          </div>

          <div class="mb-4">
            <b-form-checkbox v-model="form.remember" class="custom-checkbox">
              <span class="text-muted small">Duy trì đăng nhập</span>
            </b-form-checkbox>
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100 fw-bold" :disabled="loading">
            <b-spinner v-if="loading" small class="mr-2" />
            {{ loading ? 'Đang xác thực...' : 'Đăng nhập' }}
          </button>
        </b-form>

        <div class="login-footer">
          <p class="mb-0">
            Chưa có tài khoản?
            <b-link to="/register" class="fw-bold text-primary">Đăng ký ngay</b-link>
          </p>
        </div>
      </div>

      <div class="text-center mt-5 text-muted small">
        &copy; Bảo Phương Store. All rights reserved.
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  /* var(--color-gray-50) */
  padding: var(--space-5);
  font-family: var(--font-family-base);
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-7);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-7);
}

.brand-icon {
  width: 48px;
  height: 48px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto var(--space-4);
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
  letter-spacing: -0.02em;
}

.brand-subtitle {
  color: var(--color-gray-500);
  font-size: var(--font-size-base);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-700);
}

.btn-toggle-view {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-gray-400);
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  z-index: 10;
}

.btn-toggle-view:hover {
  color: var(--color-gray-600);
}

.login-footer {
  text-align: center;
  margin-top: var(--space-7);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-100);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

/* Custom Checkbox Alignment */
.custom-checkbox>>>.custom-control-label {
  cursor: pointer;
  padding-top: 2px;
}
</style>

<script>
export default {
  name: 'LoginPage',

  layout: 'auth',

  data() {
    return {
      form: {
        email: '',
        password: '',
        remember: false
      },
      showPassword: false,
      loading: false,
      emailError: null
    }
  },

  computed: {
    emailState() {
      if (!this.form.email) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.form.email)
    }
  },

  mounted() {
    // Kiểm tra nếu đã đăng nhập
    this.checkAuth()
  },

  methods: {
    async checkAuth() {
      const session = this.$supabase.auth.session()
      if (session) {
        this.$router.push('/')
      }
    },

    async handleLogin() {
      this.loading = true
      this.emailError = null

      try {
        const { user, session, error } = await this.$supabase.auth.signIn({
          email: this.form.email,
          password: this.form.password
        })

        if (error) throw error

        // Lưu session nếu remember me
        if (this.form.remember) {
          localStorage.setItem('remember_me', 'true')
        }

        this.$bvToast.toast('Đăng nhập thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true
        })

        this.$router.push('/')
      } catch (error) {
        console.error('Login error details:', error)

        let errorMessage = 'Đăng nhập thất bại'

        if (error.message) {
          const msg = error.message.toLowerCase()
          if (msg.includes('invalid login credentials')) {
            errorMessage = 'Email hoặc mật khẩu không đúng'
          } else if (msg.includes('email not confirmed')) {
            errorMessage = 'Email chưa được xác nhận. Vui lòng kiểm tra hộp thư đến.'
          } else if (msg.includes('user not found')) {
            errorMessage = 'Tài khoản không tồn tại'
          } else if (msg.includes('rate limit')) {
            errorMessage = 'Quá nhiều lần thử. Vui lòng đợi một lát.'
          } else {
            errorMessage = error.message
          }
        }

        this.$bvToast.toast(errorMessage, {
          title: 'Lỗi đăng nhập',
          variant: 'danger',
          solid: true,
          noAutoHide: true
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
