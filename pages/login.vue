<template>
  <div>
    <b-form @submit.prevent="handleLogin">
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Nhập email"
          required
          autocomplete="email"
          :state="emailState"
        />
        <b-form-invalid-feedback v-if="emailError">
          {{ emailError }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Mật khẩu" label-for="password">
        <b-input-group>
          <b-form-input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Nhập mật khẩu"
            required
            autocomplete="current-password"
          />
          <b-input-group-append>
            <b-button
              variant="outline-secondary"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <b-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <b-form-checkbox v-model="form.remember">
          Ghi nhớ đăng nhập
        </b-form-checkbox>
        <b-link to="/forgot-password" class="text-primary">
          Quên mật khẩu?
        </b-link>
      </div>

      <b-button
        type="submit"
        variant="primary"
        block
        size="lg"
        :disabled="loading"
      >
        <b-spinner v-if="loading" small class="mr-2" />
        <b-icon v-else icon="box-arrow-in-right" class="mr-2" />
        {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
      </b-button>
    </b-form>

    <div class="text-center mt-4">
      <p class="mb-0">
        Chưa có tài khoản?
        <b-link to="/register" class="font-weight-bold">Đăng ký ngay</b-link>
      </p>
    </div>
  </div>
</template>

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
