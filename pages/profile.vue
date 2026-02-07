<template>
  <div>
    <h2 class="font-weight-bold mb-4">Hồ sơ cá nhân</h2>

    <b-row>
      <b-col lg="4">
        <b-card class="border-0 shadow-sm text-center">
          <b-avatar
            :text="userInitials"
            size="120"
            variant="primary"
            class="mb-3"
          />
          <h4 class="font-weight-bold">{{ userName }}</h4>
          <p class="text-muted">{{ user?.email }}</p>
          <b-badge variant="light">Thành viên</b-badge>
        </b-card>
      </b-col>

      <b-col lg="8">
        <b-card class="border-0 shadow-sm">
          <template #header>
            <h5 class="mb-0 font-weight-bold">Thông tin cá nhân</h5>
          </template>

          <b-form @submit.prevent="updateProfile">
            <b-row>
              <b-col md="6">
                <b-form-group label="Họ và tên">
                  <b-form-input
                    v-model="form.full_name"
                    placeholder="Nhập họ tên"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Email">
                  <b-form-input
                    v-model="form.email"
                    type="email"
                    disabled
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Số điện thoại">
                  <b-form-input
                    v-model="form.phone"
                    placeholder="Nhập số điện thoại"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <b-button
              type="submit"
              variant="primary"
              :disabled="updating"
            >
              <b-spinner v-if="updating" small class="mr-2" />
              Cập nhật thông tin
            </b-button>
          </b-form>
        </b-card>

        <b-card class="border-0 shadow-sm mt-4">
          <template #header>
            <h5 class="mb-0 font-weight-bold">Đổi mật khẩu</h5>
          </template>

          <b-form @submit.prevent="changePassword">
            <b-form-group label="Mật khẩu hiện tại">
              <b-form-input
                v-model="passwordForm.current"
                type="password"
                required
              />
            </b-form-group>

            <b-form-group label="Mật khẩu mới">
              <b-form-input
                v-model="passwordForm.new"
                type="password"
                required
                minlength="6"
              />
            </b-form-group>

            <b-form-group label="Xác nhận mật khẩu mới">
              <b-form-input
                v-model="passwordForm.confirm"
                type="password"
                required
                :state="passwordMatch"
              />
              <b-form-invalid-feedback v-if="!passwordMatch">
                Mật khẩu không khớp
              </b-form-invalid-feedback>
            </b-form-group>

            <b-button
              type="submit"
              variant="warning"
              :disabled="!passwordMatch || changingPassword"
            >
              <b-spinner v-if="changingPassword" small class="mr-2" />
              Đổi mật khẩu
            </b-button>
          </b-form>
        </b-card>
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
