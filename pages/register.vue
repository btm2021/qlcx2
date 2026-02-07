<template>
  <div>
    <b-form @submit.prevent="handleRegister">
      <b-form-group label="Họ và tên" label-for="fullName">
        <b-form-input
          id="fullName"
          v-model="form.fullName"
          placeholder="Nhập họ và tên"
          required
        />
      </b-form-group>

      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="Nhập email"
          required
          :state="emailState"
        />
        <b-form-invalid-feedback v-if="form.email && !emailState">
          Email không hợp lệ
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group label="Mật khẩu" label-for="password">
        <b-input-group>
          <b-form-input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
            required
            minlength="6"
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
        <b-form-text v-if="form.password">
          Độ mạnh: <span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
        </b-form-text>
      </b-form-group>

      <b-form-group label="Xác nhận mật khẩu" label-for="confirmPassword">
        <b-form-input
          id="confirmPassword"
          v-model="form.confirmPassword"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Nhập lại mật khẩu"
          required
          :state="passwordMatch"
        />
        <b-form-invalid-feedback v-if="form.confirmPassword && !passwordMatch">
          Mật khẩu không khớp
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group>
        <b-form-checkbox v-model="form.agree" required>
          Tôi đồng ý với <b-link to="#">điều khoản sử dụng</b-link>
        </b-form-checkbox>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        block
        size="lg"
        :disabled="loading || !isValid"
      >
        <b-spinner v-if="loading" small class="mr-2" />
        <b-icon v-else icon="person-plus" class="mr-2" />
        {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
      </b-button>
    </b-form>

    <div class="text-center mt-4">
      <p class="mb-0">
        Đã có tài khoản?
        <b-link to="/login" class="font-weight-bold">Đăng nhập</b-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',
  
  layout: 'auth',

  data() {
    return {
      form: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
      },
      showPassword: false,
      loading: false
    }
  },

  computed: {
    emailState() {
      if (!this.form.email) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(this.form.email)
    },
    
    passwordMatch() {
      if (!this.form.confirmPassword) return null
      return this.form.password === this.form.confirmPassword
    },
    
    passwordStrength() {
      const pwd = this.form.password
      if (!pwd) return 0
      
      let strength = 0
      if (pwd.length >= 6) strength++
      if (pwd.length >= 10) strength++
      if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++
      if (/\d/.test(pwd)) strength++
      if (/[^a-zA-Z0-9]/.test(pwd)) strength++
      
      return strength
    },
    
    passwordStrengthText() {
      const levels = ['Rất yếu', 'Yếu', 'Trung bình', 'Khá', 'Mạnh', 'Rất mạnh']
      return levels[this.passwordStrength]
    },
    
    passwordStrengthClass() {
      const classes = ['text-danger', 'text-danger', 'text-warning', 'text-info', 'text-primary', 'text-success']
      return classes[this.passwordStrength]
    },
    
    isValid() {
      return this.emailState && 
             this.form.password.length >= 6 && 
             this.passwordMatch && 
             this.form.agree &&
             this.form.fullName.trim()
    }
  },

  methods: {
    async handleRegister() {
      this.loading = true

      try {
        const { user, error } = await this.$supabase.auth.signUp({
          email: this.form.email,
          password: this.form.password,
          options: {
            data: {
              full_name: this.form.fullName
            }
          }
        })

        if (error) throw error

        this.$bvToast.toast('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.', {
          title: 'Thành công',
          variant: 'success',
          solid: true,
          noAutoHide: true
        })

        // Chuyển về trang login sau 3 giây
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } catch (error) {
        console.error('Register error:', error)
        
        let errorMessage = 'Đăng ký thất bại'
        if (error.message.includes('User already registered')) {
          errorMessage = 'Email đã được đăng ký'
        } else if (error.message.includes('Password should be')) {
          errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        this.$bvToast.toast(errorMessage, {
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
