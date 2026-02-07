<template>
  <div>
    <!-- Header -->
    <div class="top-bar">
      <div class="d-flex flex-column">
        <h5 class="font-weight-bold mb-0">Hồ sơ cá nhân</h5>
        <div class="text-muted small">Thông tin tài khoản và bảo mật</div>
      </div>
    </div>

    <b-row>
      <!-- Avatar Section -->
      <b-col lg="4">
        <div class="card text-center mb-4">
          <div class="card-body py-5">
            <b-avatar
              :text="userInitials"
              size="100"
              variant="primary"
              class="mb-3 shadow-sm"
              style="border: 4px solid var(--color-white);"
            />
            <h4 class="font-weight-bold mb-1">{{ userName }}</h4>
            <p class="text-muted small mb-3">{{ user?.email }}</p>
            <span class="badge badge-primary badge-pill px-3">Thành viên</span>
          </div>
        </div>
      </b-col>

      <!-- Profile Details Section -->
      <b-col lg="8">
        <!-- Info Card -->
        <div class="card mb-4">
          <div class="card-header">
            <div class="card-icon bg-primary-soft">
              <b-icon icon="person" variant="primary" />
            </div>
            <span class="card-title">Thông tin cá nhân</span>
          </div>
          <div class="card-body">
            <b-form @submit.prevent="updateProfile">
              <b-row>
                <b-col md="6" class="mb-3">
                  <label class="form-label">Họ và tên</label>
                  <b-form-input
                    v-model="form.full_name"
                    class="form-control"
                    placeholder="Nhập họ tên"
                  />
                </b-col>
                <b-col md="6" class="mb-3">
                  <label class="form-label">Email (không thể đổi)</label>
                  <b-form-input
                    v-model="form.email"
                    class="form-control"
                    type="email"
                    disabled
                  />
                </b-col>
                <b-col md="6" class="mb-3">
                  <label class="form-label">Số điện thoại</label>
                  <b-form-input
                    v-model="form.phone"
                    class="form-control"
                    placeholder="Nhập số điện thoại"
                  />
                </b-col>
              </b-row>

              <div class="mt-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="updating"
                >
                  <b-spinner v-if="updating" small class="mr-2" />
                  Cập nhật thông tin
                </button>
              </div>
            </b-form>
          </div>
        </div>

        <!-- Password Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-icon bg-warning-soft">
              <b-icon icon="shield-lock" variant="warning" />
            </div>
            <span class="card-title">Đổi mật khẩu</span>
          </div>
          <div class="card-body">
            <b-form @submit.prevent="changePassword">
              <div class="mb-3">
                <label class="form-label">Mật khẩu hiện tại</label>
                <b-form-input
                  v-model="passwordForm.current"
                  class="form-control"
                  type="password"
                  required
                />
              </div>

              <b-row>
                <b-col md="6" class="mb-3">
                  <label class="form-label">Mật khẩu mới</label>
                  <b-form-input
                    v-model="passwordForm.new"
                    class="form-control"
                    type="password"
                    required
                    minlength="6"
                  />
                </b-col>

                <b-col md="6" class="mb-3">
                  <label class="form-label">Xác nhận mật khẩu mới</label>
                  <b-form-input
                    v-model="passwordForm.confirm"
                    class="form-control"
                    type="password"
                    required
                    :state="passwordMatch"
                  />
                  <div v-if="passwordForm.confirm && !passwordMatch" class="text-danger small mt-1">
                    Mật khẩu không khớp
                  </div>
                </b-col>
              </b-row>

              <div class="mt-2">
                <button
                  type="submit"
                  class="btn btn-warning"
                  :disabled="!passwordMatch || changingPassword"
                >
                  <b-spinner v-if="changingPassword" small class="mr-2" />
                  Đổi mật khẩu
                </button>
              </div>
            </b-form>
          </div>
        </div>
      </b-col>
    </b-row>
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
        current: '',
        new: '',
        confirm: ''
      },
      updating: false,
      changingPassword: false
    }
  },

  computed: {
    userName() {
      return this.user?.user_metadata?.full_name || this.user?.email || 'User'
    },
    userInitials() {
      const name = this.user?.user_metadata?.full_name || this.user?.email || 'U'
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
      const user = this.$supabase.auth.user()
      this.user = user
      
      if (user) {
        this.form.full_name = user.user_metadata?.full_name || ''
        this.form.email = user.email || ''
        this.form.phone = user.user_metadata?.phone || ''
      }
    },

    async updateProfile() {
      this.updating = true
      
      try {
        const { error } = await this.$supabase.auth.update({
          data: {
            full_name: this.form.full_name,
            phone: this.form.phone
          }
        })

        if (error) throw error

        this.$bvToast.toast('Cập nhật thông tin thành công!', {
          title: 'Thành công',
          variant: 'success'
        })

        await this.fetchUser()
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: 'Lỗi',
          variant: 'danger'
        })
      } finally {
        this.updating = false
      }
    },

    async changePassword() {
      this.changingPassword = true
      
      try {
        const { user, error } = await this.$supabase.auth.update({
          password: this.passwordForm.new
        })

        if (error) throw error

        this.$bvToast.toast('Đổi mật khẩu thành công!', {
          title: 'Thành công',
          variant: 'success'
        })

        this.passwordForm = { current: '', new: '', confirm: '' }
      } catch (error) {
        this.$bvToast.toast(error.message, {
          title: 'Lỗi',
          variant: 'danger'
        })
      } finally {
        this.changingPassword = false
      }
    }
  }
}
</script>
