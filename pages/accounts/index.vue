<template>
    <div class="accounts-page">
        <div class="row">
            <!-- Left Side: Table -->
            <div class="col-lg-7 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-2 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0">Danh sách tài khoản</h6>
                        <div class="search-wrapper">
                            <b-input-group size="sm">
                                <b-form-input v-model="searchQuery" placeholder="Tìm..." class="border-left-0 pl-1" />
                            </b-input-group>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <b-table-simple small responsive hover borderless class="mb-0">
                            <b-thead>
                                <b-tr>
                                    <b-th>Thành viên</b-th>
                                    <b-th>Vai trò</b-th>
                                    <b-th class="text-center">Trạng thái</b-th>

                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="account in filteredAccounts" :key="account.id"
                                    :class="{ 'active-row': form.id === account.id && mode === 'edit' }"
                                    @click="editAccount(account)" class="cursor-pointer">
                                    <b-td>
                                        <div class="d-flex align-items-center">
                                            <b-avatar :text="getInitials(account.full_name)" size="32" variant="primary"
                                                class="mr-2" />
                                            <div>
                                                <div class="fw-bold text-dark small">{{ account.full_name || 'N/A' }}
                                                </div>
                                            </div>
                                        </div>
                                    </b-td>
                                    <b-td>
                                        <div class="d-flex flex-wrap gap-1">
                                            <span v-for="ur in account.user_roles" :key="ur.role_id"
                                                class="badge badge-primary-soft text-primary extra-small mr-1">
                                                {{ formatRole(ur.roles.name) }}
                                            </span>
                                        </div>
                                    </b-td>
                                    <b-td class="text-center">
                                        <b-icon :icon="account.is_active ? 'check-circle-fill' : 'dash-circle'"
                                            :variant="account.is_active ? 'success' : 'danger'" font-scale="0.9" />
                                    </b-td>

                                </b-tr>

                                <b-tr v-if="loading">
                                    <b-td colspan="4" class="text-center">
                                        <b-spinner variant="primary" small />
                                    </b-td>
                                </b-tr>
                                <b-tr v-if="!loading && filteredAccounts.length === 0">
                                    <b-td colspan="4" class="py-4 text-center text-muted small">Trống</b-td>
                                </b-tr>
                            </b-tbody>
                        </b-table-simple>
                    </div>
                </div>
            </div>

            <!-- Right Side: Form -->
            <div class="col-lg-5">
                <div class="card border-0 shadow-sm sticky-top" style="top: 20px;">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="fw-bold mb-0">{{ mode === 'create' ? 'Thêm mới' : 'Chỉnh sửa' }}</h6>
                            <b-button v-if="mode === 'edit'" variant="light" size="sm" class="py-0" @click="initCreate">
                                <b-icon icon="plus" /> Mới
                            </b-button>
                        </div>

                        <b-form @submit.prevent="saveAccount">
                            <div class="mb-2">
                                <label class="form-label-small">Họ và tên</label>
                                <b-form-input v-model="form.full_name" class="form-control-custom" required />
                            </div>

                            <div class="row">
                                <div class="col-md-6 mb-2">
                                    <label class="form-label-small">SĐT</label>
                                    <b-form-input v-model="form.phone" class="form-control-custom" />
                                </div>
                                <div class="col-md-6 mb-2">
                                    <label class="form-label-small">CCCD</label>
                                    <b-form-input v-model="form.cccd" class="form-control-custom" />
                                </div>
                            </div>

                            <div class="mb-2">
                                <label class="form-label-small">Địa chỉ</label>
                                <b-form-input v-model="form.address" class="form-control-custom" />
                            </div>

                            <div class="mb-2">
                                <label class="form-label-small">Email đăng nhập</label>
                                <b-form-input v-model="form.email" type="email" class="form-control-custom" required
                                    :disabled="mode === 'edit'" />
                            </div>

                            <div class="mb-3" v-if="mode === 'create'">
                                <label class="form-label-small">Mật khẩu</label>
                                <b-form-input v-model="form.password" type="password" class="form-control-custom"
                                    required />
                            </div>

                            <div class="mb-3">
                                <label class="form-label-small">Vai trò hệ thống</label>
                                <div class="role-selection-box p-2 border rounded">
                                    <div v-for="role in availableRoles" :key="role.id"
                                        class="custom-control custom-checkbox mb-1">
                                        <input type="checkbox" class="custom-control-input" :id="`role-${role.id}`"
                                            :value="role.id" v-model="form.role_ids">
                                        <label class="custom-control-label small" :for="`role-${role.id}`"
                                            style="padding-top: 1px;">
                                            {{ formatRole(role.name) }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3" v-if="mode === 'edit'">
                                <b-form-checkbox v-model="form.is_active" switch>
                                    <span class="extra-small font-weight-bold ml-1">Kích hoạt tài khoản</span>
                                </b-form-checkbox>
                            </div>

                            <div class="d-flex justify-content-between">
                                <b-button v-if="mode === 'edit' && form.id !== currentUser?.id" variant="outline-danger"
                                    size="sm" @click="handleDelete" :disabled="saving">
                                    Xóa
                                </b-button>
                                <div v-else></div>

                                <b-button type="submit" variant="primary" class="px-4 fw-bold"
                                    :disabled="saving || form.role_ids.length === 0">
                                    <b-spinner v-if="saving" small class="mr-2" />
                                    {{ mode === 'create' ? 'Tạo ngay' : 'Cập nhật' }}
                                </b-button>
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
    name: 'AccountsManager',
    layout: 'dashboard',

    data() {
        return {
            accounts: [],
            loading: true,
            saving: false,
            searchQuery: '',
            mode: 'create', // 'create' or 'edit'
            availableRoles: [],
            currentUser: null,
            form: {
                id: null,
                full_name: '',
                email: '',
                password: 'password123',
                phone: '',
                cccd: '',
                address: '',
                is_active: true,
                role_ids: []
            }
        }
    },

    computed: {
        filteredAccounts() {
            if (!this.searchQuery) return this.accounts
            const query = this.searchQuery.toLowerCase()
            return this.accounts.filter(a =>
                (a.full_name && a.full_name.toLowerCase().includes(query)) ||
                (a.email && a.email.toLowerCase().includes(query))
            )
        }
    },

    async mounted() {
        const userStr = localStorage.getItem('auth_user')
        if (userStr) this.currentUser = JSON.parse(userStr)

        await Promise.all([
            this.fetchAccounts(),
            this.fetchRoles()
        ])
    },

    methods: {
        async fetchAccounts() {
            this.loading = true
            try {
                const { data, error } = await this.$supabase
                    .from('users')
                    .select('*, user_roles(role_id, roles(name))')
                    .order('created_at', { ascending: false })
                if (error) throw error
                this.accounts = data
            } catch (error) {
                this.$bvToast.toast(error.message, { variant: 'danger' })
            } finally {
                this.loading = false
            }
        },

        async fetchRoles() {
            try {
                const { data, error } = await this.$supabase.from('roles').select('*')
                if (error) throw error
                this.availableRoles = data
            } catch (error) {
                console.error(error)
            }
        },

        initCreate() {
            this.mode = 'create'
            this.form = {
                id: null,
                full_name: '',
                email: '',
                password: 'password123',
                phone: '',
                cccd: '',
                address: '',
                is_active: true,
                role_ids: []
            }
        },

        editAccount(account) {
            this.mode = 'edit'
            this.form = {
                id: account.id,
                full_name: account.full_name || '',
                email: account.email || '',
                phone: account.phone || account.phone_number || '',
                cccd: account.cccd || '',
                address: account.address || '',
                is_active: account.is_active,
                role_ids: account.user_roles.map(ur => ur.role_id)
            }
        },

        async saveAccount() {
            this.saving = true
            try {
                let userId = this.form.id

                if (this.mode === 'create') {
                    const { data, error } = await this.$supabase
                        .from('users')
                        .insert({
                            full_name: this.form.full_name,
                            email: this.form.email,
                            password: this.form.password,
                            phone: this.form.phone,
                            cccd: this.form.cccd,
                            address: this.form.address,
                            phone_number: this.form.phone,
                            is_active: true
                        })
                        .select()
                    if (error) throw error
                    userId = data[0].id
                } else {
                    const { error } = await this.$supabase
                        .from('users')
                        .update({
                            full_name: this.form.full_name,
                            phone: this.form.phone,
                            cccd: this.form.cccd,
                            address: this.form.address,
                            phone_number: this.form.phone,
                            is_active: this.form.is_active,
                            updated_at: new Date()
                        })
                        .eq('id', userId)
                    if (error) throw error
                }

                // Roles Sync
                await this.$supabase.from('user_roles').delete().eq('user_id', userId)
                if (this.form.role_ids.length > 0) {
                    const roleInserts = this.form.role_ids.map(rid => ({ user_id: userId, role_id: rid }))
                    await this.$supabase.from('user_roles').insert(roleInserts)
                }

                this.$bvToast.toast('Đã lưu thành công!', { variant: 'success', solid: true })
                await this.fetchAccounts()
                if (this.mode === 'create') this.initCreate()
            } catch (error) {
                this.$bvToast.toast(error.message, { title: 'Lỗi', variant: 'danger' })
            } finally {
                this.saving = false
            }
        },

        async handleDelete() {
            if (!confirm('Xóa tài khoản này?')) return
            this.saving = true
            try {
                await this.$supabase.from('users').delete().eq('id', this.form.id)
                this.$bvToast.toast('Đã xóa', { variant: 'warning' })
                await this.fetchAccounts()
                this.initCreate()
            } catch (error) {
                this.$bvToast.toast(error.message, { variant: 'danger' })
            } finally {
                this.saving = false
            }
        },

        async toggleStatus(account) {
            const newStatus = !account.is_active
            try {
                const { error } = await this.$supabase
                    .from('users')
                    .update({ is_active: newStatus })
                    .eq('id', account.id)
                if (error) throw error
                account.is_active = newStatus
                this.$bvToast.toast(`Đã ${newStatus ? 'mở khóa' : 'khóa'} tài khoản`, { variant: 'info' })
            } catch (error) {
                this.$bvToast.toast(error.message, { variant: 'danger' })
            }
        },

        async deleteFromTable(account) {
            if (!confirm(`Bạn có chắc muốn xóa tài khoản "${account.full_name}"?`)) return
            this.loading = true
            try {
                const { error } = await this.$supabase.from('users').delete().eq('id', account.id)
                if (error) throw error
                this.$bvToast.toast('Đã xóa tài khoản thành công', { variant: 'warning' })
                if (this.form.id === account.id) this.initCreate()
                await this.fetchAccounts()
            } catch (error) {
                this.$bvToast.toast(error.message, { variant: 'danger' })
            } finally {
                this.loading = false
            }
        },

        formatRole(role) {
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

        getInitials(name) {
            if (!name) return 'U'
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }
    }
}
</script>

<style scoped>
.fw-bold {
    font-weight: 700 !important;
}

.extra-small {
    font-size: 0.7rem;
}

.search-wrapper {
    max-width: 200px;
}

.data-table thead th {
    background: #f8fafc;
    padding: 10px 12px;
    font-size: 0.65rem;
    text-transform: uppercase;
    color: #64748b;
    border-bottom: 1px solid #e2e8f0;
}

.data-table tbody tr {
    cursor: pointer;
    border-bottom: 1px solid #f1f5f9;
}

.data-table tbody tr:hover {
    background: #f8fafc;
}

.active-row {
    background: #eff6ff !important;
    border-left: 3px solid #3b82f6 !important;
}

.form-label-small {
    font-size: 0.7rem;
    font-weight: 700;
    color: #475569;
    margin-bottom: 0.35rem;
    display: block;
}

.form-control-custom {
    height: 38px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    font-size: 0.825rem;
    padding: 0 12px;
    border-radius: 6px;
}

.role-selection-box {
    max-height: 150px;
    overflow-y: auto;
    background: #f8fafc;
}

.badge-primary-soft {
    background: #eff6ff;
    color: #3b82f6;
}
</style>
