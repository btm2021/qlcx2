<template>
    <div class="roles-page">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h4 class="fw-bold mb-0">Quản lý vai trò</h4>
                <p class="text-muted small mb-0">Thiết lập các vai trò và quyền hạn trong hệ thống</p>
            </div>
            <b-button variant="primary" @click="openCreateModal" class="fw-bold">
                <b-icon icon="plus" class="mr-1" /> Thêm vai trò
            </b-button>
        </div>

        <!-- Roles Table -->
        <div class="card border-0 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover mb-0">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="border-0 px-4 py-3 text-uppercase small fw-bold text-muted"
                                style="width: 250px;">Mã vai trò</th>
                            <th class="border-0 px-4 py-3 text-uppercase small fw-bold text-muted">Mô tả</th>
                            <th class="border-0 px-4 py-3 text-uppercase small fw-bold text-muted text-right"
                                style="width: 150px;">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="loading">
                            <td colspan="3" class="text-center py-5">
                                <b-spinner small variant="primary" />
                                <span class="ml-2 text-muted">Đang tải...</span>
                            </td>
                        </tr>
                        <tr v-else v-for="role in roles" :key="role.id">
                            <td class="px-4 py-3 align-middle">
                                <div class="d-flex align-items-center">
                                    <div class="role-icon mr-3">
                                        <b-icon icon="shield-lock" />
                                    </div>
                                    <div>
                                        <div class="fw-bold text-gray-900">{{ role.name }}</div>
                                        <div class="small text-muted">{{ formatRoleName(role.name) }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-4 py-3 align-middle">
                                <span class="text-gray-600">{{ role.description || 'Chưa có mô tả' }}</span>
                            </td>
                            <td class="px-4 py-3 align-middle text-right">
                                <b-button variant="link" class="text-muted p-0 mr-3" v-b-tooltip.hover title="Chỉnh sửa"
                                    @click="openEditModal(role)">
                                    <b-icon icon="pencil-square" />
                                </b-button>
                                <b-button variant="link" class="text-danger p-0" v-b-tooltip.hover title="Xóa"
                                    @click="confirmDelete(role)">
                                    <b-icon icon="trash" />
                                </b-button>
                            </td>
                        </tr>
                        <tr v-if="!loading && roles.length === 0">
                            <td colspan="3" class="text-center py-5">
                                <div class="mb-3">
                                    <b-icon icon="shield-slash" font-scale="3" class="text-gray-200" />
                                </div>
                                <p class="text-muted mb-0">Chưa có vai trò nào được thiết lập.</p>
                                <b-button variant="outline-primary" size="sm" class="mt-3" @click="seedDefaultRoles">
                                    Khởi tạo vai trò mặc định
                                </b-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Role Modal (Create/Edit) -->
        <b-modal id="role-modal" v-model="showModal" :title="isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'" centered
            hide-footer body-class="p-0">
            <div class="p-4">
                <b-form @submit.prevent="saveRole">
                    <div class="mb-3">
                        <label class="form-label-small">Mã vai trò (System Name)</label>
                        <b-form-select v-if="!isEdit" v-model="form.name" :options="enumOptions"
                            class="form-control-custom" required />
                        <b-form-input v-else v-model="form.name" class="form-control-custom" disabled />
                        <small class="text-muted" v-if="!isEdit">Vui lòng chọn từ các mã hệ thống có sẵn.</small>
                    </div>

                    <div class="mb-4">
                        <label class="form-label-small">Mô tả chi tiết</label>
                        <b-form-textarea v-model="form.description" class="form-control-custom h-auto" rows="3"
                            placeholder="Nhập mô tả về quyền hạn của vai trò này..." />
                    </div>

                    <div class="d-flex justify-content-end gap-2 border-top pt-4">
                        <b-button variant="link" class="text-muted mr-2" @click="showModal = false">Hủy</b-button>
                        <b-button type="submit" variant="primary" class="px-4 fw-bold" :disabled="saving">
                            <b-spinner v-if="saving" small class="mr-2" />
                            {{ isEdit ? 'Cập nhật' : 'Thêm vai trò' }}
                        </b-button>
                    </div>
                </b-form>
            </div>
        </b-modal>

        <!-- Delete Confirmation -->
        <b-modal v-model="showDeleteConfirm" title="Xác nhận xóa" centered header-bg-variant="danger"
            header-text-variant="white">
            <p>Bạn có chắc chắn muốn xóa vai trò <strong>{{ selectedRole?.name }}</strong>?</p>
            <p class="small text-danger mb-0">Hành động này có thể ảnh hưởng đến các người dùng đang được gán vai trò
                này.</p>
            <template #modal-footer>
                <b-button variant="link" class="text-muted" @click="showDeleteConfirm = false">Hủy</b-button>
                <b-button variant="danger" class="fw-bold" @click="deleteRole" :disabled="deleting">
                    <b-spinner v-if="deleting" small class="mr-2" />
                    Xóa vai trò
                </b-button>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'RolesPage',
    layout: 'dashboard',

    data() {
        return {
            roles: [],
            loading: false,
            showModal: false,
            isEdit: false,
            form: {
                id: null,
                name: '',
                description: ''
            },
            saving: false,
            showDeleteConfirm: false,
            selectedRole: null,
            deleting: false,
            enumOptions: [
                { value: '', text: '--- Chọn mã vai trò ---', disabled: true },
                { value: 'admin', text: 'admin' },
                { value: 'manager', text: 'manager' },
                { value: 'receptionist', text: 'receptionist' },
                { value: 'appraiser', text: 'appraiser' },
                { value: 'contract_officer', text: 'contract_officer' },
                { value: 'accountant', text: 'accountant' },
                { value: 'warehouse_staff', text: 'warehouse_staff' }
            ]
        }
    },

    mounted() {
        this.fetchRoles()
    },

    methods: {
        async fetchRoles() {
            this.loading = true
            try {
                const { data, error } = await this.$supabase
                    .from('roles')
                    .select('*')
                    .order('name', { ascending: true })

                if (error) throw error
                this.roles = data
            } catch (error) {
                console.error('Error fetching roles:', error)
                this.$bvToast.toast('Không thể tải danh sách vai trò', { variant: 'danger', solid: true })
            } finally {
                this.loading = false
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

        openCreateModal() {
            this.isEdit = false
            this.form = { id: null, name: '', description: '' }
            this.showModal = true
        },

        openEditModal(role) {
            this.isEdit = true
            this.form = { ...role }
            this.showModal = true
        },

        async saveRole() {
            this.saving = true
            try {
                if (this.isEdit) {
                    const { error } = await this.$supabase
                        .from('roles')
                        .update({ description: this.form.description })
                        .eq('id', this.form.id)

                    if (error) throw error
                    this.$bvToast.toast('Cập nhật vai trò thành công', { variant: 'success', solid: true })
                } else {
                    const { error } = await this.$supabase
                        .from('roles')
                        .insert({ name: this.form.name, description: this.form.description })

                    if (error) throw error
                    this.$bvToast.toast('Thêm vai trò thành công', { variant: 'success', solid: true })
                }

                this.showModal = false
                this.fetchRoles()
            } catch (error) {
                this.$bvToast.toast(error.message || 'Lỗi khi lưu vai trò', { variant: 'danger', solid: true })
            } finally {
                this.saving = false
            }
        },

        confirmDelete(role) {
            this.selectedRole = role
            this.showDeleteConfirm = true
        },

        async deleteRole() {
            this.deleting = true
            try {
                const { error } = await this.$supabase
                    .from('roles')
                    .delete()
                    .eq('id', this.selectedRole.id)

                if (error) throw error

                this.$bvToast.toast('Xóa vai trò thành công', { variant: 'success', solid: true })
                this.showDeleteConfirm = false
                this.fetchRoles()
            } catch (error) {
                this.$bvToast.toast(error.message || 'Lỗi khi xóa vai trò', { variant: 'danger', solid: true })
            } finally {
                this.deleting = false
            }
        },

        async seedDefaultRoles() {
            this.loading = true
            const defaults = [
                { name: 'admin', description: 'Toàn quyền điều hành hệ thống' },
                { name: 'manager', description: 'Quản lý cửa hàng, duyệt hợp đồng' },
                { name: 'receptionist', description: 'Tiếp nhận khách hàng và xe' },
                { name: 'appraiser', description: 'Thẩm định tình trạng và giá trị xe' },
                { name: 'contract_officer', description: 'Soạn thảo và quản lý hồ sơ hợp đồng' },
                { name: 'accountant', description: 'Quản lý thu chi, giải ngân' },
                { name: 'warehouse_staff', description: 'Quản lý kho bãi, check-in/out xe' }
            ]

            try {
                const { error } = await this.$supabase
                    .from('roles')
                    .insert(defaults)

                if (error) throw error

                this.$bvToast.toast('Khởi tạo vai trò thành công', { variant: 'success', solid: true })
                this.fetchRoles()
            } catch (error) {
                this.$bvToast.toast(error.message || 'Lỗi khi khởi tạo', { variant: 'danger', solid: true })
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.form-label-small {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--color-gray-600);
    margin-bottom: 0.5rem;
    display: block;
}

.form-control-custom {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    padding: 0.625rem 1rem;
    transition: all 0.2s;
}

.form-control-custom:focus {
    background: white;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    outline: none;
}

.role-icon {
    width: 32px;
    height: 32px;
    background: #eff6ff;
    color: #3b82f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.text-gray-900 {
    color: #111827;
}

.text-gray-600 {
    color: #4b5563;
}

.text-gray-200 {
    color: #e5e7eb;
}
</style>
