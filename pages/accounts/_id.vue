<template>
    <div class="account-edit-page">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm" v-if="!fetching">
                    <div class="card-body p-4">
                        <div class="d-flex align-items-center mb-4">
                            <b-button @click="$router.push('/accounts')" variant="link" class="p-0 mr-3 text-muted">
                                <b-icon icon="arrow-left" font-scale="1.2" />
                            </b-button>
                            <h5 class="fw-bold mb-0">Chỉnh sửa tài khoản</h5>
                        </div>

                        <b-form @submit.prevent="handleUpdate">
                            <div class="row">
                                <!-- Basic Info -->
                                <div class="col-md-6 mb-3">
                                    <label class="form-label-small">Họ và tên</label>
                                    <b-form-input v-model="form.full_name" class="form-control-custom"
                                        placeholder="Nhập họ tên nhân viên" required />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label-small">Số điện thoại</label>
                                    <b-form-input v-model="form.phone" class="form-control-custom"
                                        placeholder="09xxx" />
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label-small">Số CCCD</label>
                                    <b-form-input v-model="form.cccd" class="form-control-custom"
                                        placeholder="Nhập số căn cước" />
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label-small">Địa chỉ</label>
                                    <b-form-input v-model="form.address" class="form-control-custom"
                                        placeholder="Nhập địa chỉ nhà" />
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label-small">Trạng thái tài khoản</label>
                                    <div class="mt-2">
                                        <b-form-checkbox v-model="form.is_active" switch size="lg">
                                            {{ form.is_active ? 'Đang hoạt động' : 'Tài khoản đã khóa' }}
                                        </b-form-checkbox>
                                    </div>
                                </div>

                                <!-- Role Selection -->
                                <div class="col-md-12 mb-4 mt-3">
                                    <label class="form-label-small">Phân quyền vai trò</label>
                                    <div class="role-grid">
                                        <div v-for="role in availableRoles" :key="role.id" class="role-option"
                                            :class="{ active: form.role_ids.includes(role.id) }"
                                            @click="toggleRole(role.id)">
                                            <div class="d-flex align-items-center">
                                                <b-icon
                                                    :icon="form.role_ids.includes(role.id) ? 'check-circle-fill' : 'circle'"
                                                    class="mr-2" />
                                                <div>
                                                    <div class="role-name">{{ formatRoleName(role.name) }}</div>
                                                    <div class="role-desc small text-muted">{{ role.description ||
                                                        'Quyền hạn cơ bản' }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 pt-2 border-top d-flex justify-content-between align-items-center">
                                <b-button variant="outline-danger" size="sm" @click="handleDelete" :disabled="loading"
                                    v-if="form.id !== currentUser?.id">
                                    Xóa tài khoản
                                </b-button>
                                <div v-else></div>

                                <div class="d-flex">
                                    <b-button to="/accounts" variant="link" class="text-muted mr-3">Hủy</b-button>
                                    <b-button type="submit" variant="primary" class="px-4 fw-bold"
                                        :disabled="loading || form.role_ids.length === 0">
                                        <b-spinner v-if="loading" small class="mr-2" />
                                        Cập nhật
                                    </b-button>
                                </div>
                            </div>
                        </b-form>
                    </div>
                </div>

                <!-- Skeleton Loading -->
                <div v-else class="text-center py-5">
                    <b-spinner variant="primary" />
                    <p class="text-muted mt-2">Đang tải dữ liệu...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AccountEdit',
    layout: 'dashboard',

    data() {
        return {
            form: {
                id: '',
                full_name: '',
                phone: '',
                cccd: '',
                address: '',
                is_active: true,
                role_ids: []
            },
            availableRoles: [],
            loading: false,
            fetching: true,
            currentUser: null
        }
    },

    async mounted() {
        const userStr = localStorage.getItem('auth_user')
        if (userStr) {
            this.currentUser = JSON.parse(userStr)
        }
        await Promise.all([
            this.fetchRoles(),
            this.fetchAccount()
        ])
        this.fetching = false
    },

    methods: {
        async fetchRoles() {
            try {
                const { data, error } = await this.$supabase.from('roles').select('*')
                if (error) throw error
                this.availableRoles = data
            } catch (error) {
                console.error('Error fetching roles:', error)
            }
        },

        async fetchAccount() {
            const id = this.$route.params.id
            try {
                const { data, error } = await this.$supabase
                    .from('users')
                    .select(`
            *,
            user_roles (role_id)
          `)
                    .eq('id', id)
                    .single()

                if (error) throw error

                this.form = {
                    id: data.id,
                    full_name: data.full_name || '',
                    phone: data.phone || data.phone_number || '',
                    cccd: data.cccd || '',
                    address: data.address || '',
                    is_active: data.is_active,
                    role_ids: data.user_roles.map(ur => ur.role_id)
                }
            } catch (error) {
                this.$bvToast.toast('Tài khoản không tồn tại', { variant: 'danger' })
                this.$router.push('/accounts')
            }
        },

        toggleRole(id) {
            const index = this.form.role_ids.indexOf(id)
            if (index > -1) {
                this.form.role_ids.splice(index, 1)
            } else {
                this.form.role_ids.push(id)
            }
        },

        formatRoleName(role) {
            const rolesMap = {
                admin: 'Quản trị viên',
                manager: 'Quản lý',
                receptionist: 'Lễ tân',
                appraiser: 'Thẩm định',
                contract_officer: 'Nhân viên hợp đồng',
                accountant: 'Kế toán',
                warehouse_staff: 'Kho'
            }
            return rolesMap[role] || role
        },

        async handleUpdate() {
            this.loading = true
            try {
                const { error } = await this.$supabase
                    .from('users')
                    .update({
                        full_name: this.form.full_name,
                        phone: this.form.phone,
                        cccd: this.form.cccd,
                        address: this.form.address,
                        phone_number: this.form.phone, // Sync with old field
                        is_active: this.form.is_active,
                        updated_at: new Date()
                    })
                    .eq('id', this.form.id)

                if (error) throw error

                // Update roles: delete old ones, insert new ones
                await this.$supabase.from('user_roles').delete().eq('user_id', this.form.id)

                if (this.form.role_ids.length > 0) {
                    const roleInserts = this.form.role_ids.map(roleId => ({
                        user_id: this.form.id,
                        role_id: roleId
                    }))
                    const { error: roleError } = await this.$supabase.from('user_roles').insert(roleInserts)
                    if (roleError) throw roleError
                }

                this.$bvToast.toast('Cập nhật tài khoản thành công', { variant: 'success', solid: true })
                this.$router.push('/accounts')
            } catch (error) {
                this.$bvToast.toast(error.message, { title: 'Lỗi', variant: 'danger', solid: true })
            } finally {
                this.loading = false
            }
        },

        async handleDelete() {
            if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này? Thao tác này có thể ảnh hưởng đến các dữ liệu liên quan.')) return

            this.loading = true
            try {
                const { error } = await this.$supabase.from('users').delete().eq('id', this.form.id)
                if (error) throw error
                this.$bvToast.toast('Đã xóa tài khoản', { variant: 'warning', solid: true })
                this.$router.push('/accounts')
            } catch (error) {
                this.$bvToast.toast(error.message, { title: 'Lỗi xóa', variant: 'danger', solid: true })
            } finally {
                this.loading = false
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

.role-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
}

.role-option {
    padding: 12px;
    border: 1px solid var(--color-gray-200);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
}

.role-option:hover {
    border-color: var(--color-primary);
    background: var(--color-gray-50);
}

.role-option.active {
    border-color: var(--color-primary);
    background: var(--color-primary-soft);
    color: var(--color-primary);
}

.role-name {
    font-weight: 600;
    font-size: 0.875rem;
}

.role-desc {
    font-size: 0.75rem;
}
</style>
