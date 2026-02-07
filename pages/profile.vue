<template>
  <div class="profile-container">
    <div class="row">
      <!-- User Overview -->
      <div class="col-lg-4">
        <div class="card border-0 shadow-sm text-center p-4 mb-4">
          <div class="user-avatar-wrap mb-3">
            <b-avatar :text="userInitials" size="100" variant="primary" class="shadow-sm" />
          </div>
          <h4 class="fw-bold mb-1">{{ userName }}</h4>
          <p class="text-muted small mb-0">{{ user?.email }}</p>
          <div class="mt-3">
            <span class="badge badge-primary-soft text-primary px-3">Quản trị viên</span>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="col-lg-8">
        <!-- Profile Info -->
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Thông tin cá nhân</h5>

            <b-form @submit.prevent="updateProfile">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label-small">Họ và tên</label>
                  <b-form-input v-model="form.full_name" class="form-control-custom" placeholder="Nguyễn Văn A" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label-small">Email</label>
                  <b-form-input v-model="form.email" class="form-control-custom" type="email" disabled />
                  <small class="text-muted">Email không thể thay đổi</small>
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label-small">Số điện thoại</label>
                  <b-form-input v-model="form.phone" class="form-control-custom" placeholder="0901234567" />
                </div>
              </div>

              <div class="mt-4 pt-2">
                <button type="submit" class="btn btn-primary px-4 fw-bold" :disabled="updating">
                  <b-spinner v-if="updating" small class="mr-2" />
                  Lưu thay đổi
                </button>
              </div>
            </b-form>
          </div>
        </div>

        <!-- Security -->
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Bảo mật</h5>

            <b-form @submit.prevent="changePassword">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label-small">Mật khẩu mới</label>
                  <b-form-input v-model="passwordForm.new" class="form-control-custom" type="password"
                    placeholder="Tối thiểu 6 ký tự" required minlength="6" />
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label-small">Xác nhận mật khẩu</label>
                  <b-form-input v-model="passwordForm.confirm" class="form-control-custom" type="password"
                    placeholder="Nhập lại mật khẩu mới" required :state="passwordMatch" />
                </div>
              </div>

              <div class="mt-4 pt-2">
                <button type="submit" class="btn btn-outline-primary px-4 fw-bold"
                  :disabled="!passwordMatch || !passwordForm.new || changingPassword">
                  <b-spinner v-if="changingPassword" small class="mr-2" />
                  Cập nhật mật khẩu
                </button>
              </div>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  layout: 'dashboard',

  data() {
    return {
      user: null,
      form: {
        full_name: '',
        email: '',
        phone: ''
      },
      passwordForm: {
        new: '',
        confirm: ''
      },
      updating: false,
      changingPassword: false
    }
  },

  computed: {
    userName() {
      return this.user?.full_name || this.user?.email || 'User'
    },
    userInitials() {
      const name = this.user?.full_name || this.user?.email || 'U'
      return name.charAt(0).toUpperCase()
    },
    passwordMatch() {
      if (!this.passwordForm.confirm) return null
      return this.passwordForm.new === this.passwordForm.confirm
    }
  },

  async mounted() {
    await this.fetchUser()
  },

  methods: {
    async fetchUser() {
      const userStr = localStorage.getItem('auth_user')
      if (userStr) {
        const user = JSON.parse(userStr)
        this.user = user
        this.form.full_name = user.full_name || ''
        this.form.email = user.email || ''
        this.form.phone = user.phone_number || ''
      }
    },

    async updateProfile() {
      this.updating = true

      try {
        const { data, error } = await this.$supabase
          .from('users')
          .update({
            full_name: this.form.full_name,
            phone_number: this.form.phone
          })
          .eq('id', this.user.id)
          .select()

        if (error) throw error

        const updatedUser = data[0]
        localStorage.setItem('auth_user', JSON.stringify(updatedUser))

        this.$bvToast.toast('Cập nhật thông tin thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true
        })

        await this.fetchUser()
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: 'Lỗi cập nhật',
          variant: 'danger',
          solid: true
        })
      } finally {
        this.updating = false
      }
    },

    async changePassword() {
      this.changingPassword = true

      try {
        const { error } = await this.$supabase
          .from('users')
          .update({
            password: this.passwordForm.new
          })
          .eq('id', this.user.id)

        if (error) throw error

        this.$bvToast.toast('Đổi mật khẩu thành công!', {
          title: 'Thành công',
          variant: 'success',
          solid: true
        })

        this.passwordForm = { new: '', confirm: '' }
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: 'Lỗi đổi mật khẩu',
          variant: 'danger',
          solid: true
        })
      } finally {
        this.changingPassword = false
      }
    }
  }
}
</script>

<style scoped>
.fw-bold {
  font-weight: 700 !important;
}

.form-label-small {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-gray-600);
  margin-bottom: 0.5rem;
  display: block;
}

.form-control-custom {
  height: 44px;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  font-size: 0.875rem;
  padding: 0 16px;
  transition: all 0.2s;
}

.form-control-custom:focus {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-soft);
  outline: none;
}

.badge-primary-soft {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.user-avatar-wrap {
  display: flex;
  justify-content: center;
}
</style>
