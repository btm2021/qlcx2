<template>
  <div class="card border-0 shadow-lg">
    <div class="card-body p-4 p-md-5">
      <div class="text-center mb-4">
        <h4 class="font-weight-bold mb-1">Tạo tài khoản mới</h4>
        <p class="text-muted small">Đăng ký để bắt đầu quản lý cầm xe</p>
      </div>

      <b-form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label class="form-label">Họ và tên</label>
          <b-form-input
            id="fullName"
            v-model="form.fullName"
            class="form-control"
            placeholder="Nguyễn Văn A"
            required
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Email đăng ký</label>
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="example@gmail.com"
            required
            :state="emailState"
          />
          <div v-if="form.email && !emailState" class="text-danger small mt-1">
            Email không hợp lệ
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <b-input-group>
            <b-form-input
              id="password"
              v-model="form.password"
              class="form-control"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              minlength="6"
            />
            <b-input-group-append>
              <button
                type="button"
                class="btn btn-outline border-left-0"
                @click="showPassword = !showPassword"
                tabindex="-1"
                style="border-top-left-radius: 0; border-bottom-left-radius: 0;"
              >
                <b-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
              </button>
            </b-input-group-append>
          </b-input-group>
          <div v-if="form.password" class="small mt-1">
            Độ mạnh: <span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
          </div>
        </div>

        <div class="mb-4">
          <label class="form-label">Xác nhận mật khẩu</label>
          <b-form-input
            id="confirmPassword"
            v-model="form.confirmPassword"
            class="form-control"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            required
            :state="passwordMatch"
          />
          <div v-if="form.confirmPassword && !passwordMatch" class="text-danger small mt-1">
            Mật khẩu không khớp
          </div>
        </div>

        <div class="mb-4">
          <b-form-checkbox v-model="form.agree" required class="small">
            Tôi đồng ý với <b-link to="#" class="text-primary font-weight-medium">điều khoản sử dụng</b-link>
          </b-form-checkbox>
        </div>

        <button
          type="submit"
          class="btn btn-primary btn-lg w-100 py-3 mb-3"
          :disabled="loading || !isValid"
        >
          <b-spinner v-if="loading" small class="mr-2" />
          <b-icon v-else icon="person-plus" class="mr-2" />
          {{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}
        </button>
      </b-form>

      <div class="text-center mt-3">
        <p class="mb-0 small text-muted">
          Đã có tài khoản?
          <b-link to="/login" class="font-weight-bold text-primary">Đăng nhập</b-link>
        </p>
      </div>
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
