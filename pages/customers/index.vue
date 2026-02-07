<template>
    <div class="customers-page">
        <div class="row">
            <!-- Left Side: Table -->
            <div class="col-lg-7 mb-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 py-2 d-flex justify-content-between align-items-center">
                        <h6 class="fw-bold mb-0">Danh sách khách hàng</h6>
                        <div class="search-wrapper">
                            <b-input-group size="sm">
                                <b-form-input v-model="searchQuery" placeholder="Tìm..." class="border-left-0 pl-1"
                                    autocomplete="off" />
                            </b-input-group>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <b-table-simple small responsive hover borderless class="mb-0">
                            <b-thead>
                                <b-tr>
                                    <b-th>Họ tên</b-th>
                                    <b-th>Số điện thoại</b-th>
                                    <b-th>Số CCCD</b-th>
                                    <b-th class="text-right pr-4">Hành động</b-th>
                                </b-tr>
                            </b-thead>
                            <b-tbody>
                                <b-tr v-for="customer in filteredCustomers" :key="customer.id"
                                    :class="{ 'active-row': form.id === customer.id && mode === 'edit' }"
                                    @click="editCustomer(customer)" class="cursor-pointer">
                                    <b-td>
                                        <div class="d-flex align-items-center">
                                            <b-avatar :text="getInitials(customer.full_name)" size="32"
                                                variant="primary" class="mr-2" />
                                            <div>
                                                <div class="fw-bold text-dark small">{{ customer.full_name }}</div>
                                            </div>
                                        </div>
                                    </b-td>
                                    <b-td class="small">{{ customer.phone_number }}</b-td>
                                    <b-td class="small">{{ customer.identity_card }}</b-td>
                                    <b-td class="text-right pr-4">
                                        <b-button variant="link" size="sm" class="p-0 text-danger"
                                            @click.stop="confirmDelete(customer)" v-b-tooltip.hover title="Xóa">
                                            <b-icon icon="trash" />
                                        </b-button>
                                    </b-td>
                                </b-tr>

                                <b-tr v-if="loading">
                                    <b-td colspan="4" class="text-center">
                                        <b-spinner variant="primary" small />
                                    </b-td>
                                </b-tr>
                                <b-tr v-if="!loading && filteredCustomers.length === 0">
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

                        <b-form @submit.prevent="saveCustomer">
                            <div class="mb-2">
                                <label class="form-label-small">Họ và tên</label>
                                <b-form-input v-model="form.full_name" class="form-control-custom" required
                                    autocomplete="off" />
                            </div>

                            <div class="mb-2">
                                <label class="form-label-small">Số điện thoại</label>
                                <b-form-input v-model="form.phone_number" class="form-control-custom" required
                                    autocomplete="off" />
                            </div>

                            <div class="mb-2">
                                <label class="form-label-small">Số CCCD / CMND</label>
                                <b-form-input v-model="form.identity_card" class="form-control-custom" required
                                    autocomplete="off" />
                            </div>

                            <div class="mb-2">
                                <label class="form-label-small">Địa chỉ</label>
                                <b-form-input v-model="form.address" class="form-control-custom" autocomplete="off" />
                            </div>

                            <div class="d-flex justify-content-end mt-4">
                                <b-button type="submit" variant="primary" class="px-4 fw-bold" :disabled="saving">
                                    <b-spinner v-if="saving" small class="mr-2" />
                                    {{ mode === 'create' ? 'Thêm khách hàng' : 'Cập nhật' }}
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
    name: 'CustomerManager',
    layout: 'dashboard',

    data() {
        return {
            customers: [],
            loading: true,
            saving: false,
            searchQuery: '',
            mode: 'create',
            form: {
                id: null,
                full_name: '',
                phone_number: '',
                identity_card: '',
                address: ''
            }
        }
    },

    computed: {
        filteredCustomers() {
            if (!this.searchQuery) return this.customers
            const query = this.searchQuery.toLowerCase()
            return this.customers.filter(c =>
                c.full_name.toLowerCase().includes(query) ||
                c.phone_number.includes(query) ||
                c.identity_card.includes(query)
            )
        }
    },

    async mounted() {
        await this.fetchCustomers()
    },

    methods: {
        async fetchCustomers() {
            this.loading = true
            try {
                const { data, error } = await this.$supabase
                    .from('customers')
                    .select('*')
                    .order('created_at', { ascending: false })
                if (error) throw error
                this.customers = data
            } catch (error) {
                this.$bvToast.toast(error.message, { variant: 'danger' })
            } finally {
                this.loading = false
            }
        },

        initCreate() {
            this.mode = 'create'
            this.form = {
                id: null,
                full_name: '',
                phone_number: '',
                identity_card: '',
                address: ''
            }
        },

        editCustomer(customer) {
            this.mode = 'edit'
            this.form = { ...customer }
        },

        async saveCustomer() {
            this.saving = true
            try {
                if (this.mode === 'create') {
                    const { error } = await this.$supabase
                        .from('customers')
                        .insert({
                            full_name: this.form.full_name,
                            phone_number: this.form.phone_number,
                            identity_card: this.form.identity_card,
                            address: this.form.address
                        })
                    if (error) throw error
                    this.$bvToast.toast('Thêm khách hàng thành công', { variant: 'success' })
                } else {
                    const { error } = await this.$supabase
                        .from('customers')
                        .update({
                            full_name: this.form.full_name,
                            phone_number: this.form.phone_number,
                            identity_card: this.form.identity_card,
                            address: this.form.address,
                            updated_at: new Date()
                        })
                        .eq('id', this.form.id)
                    if (error) throw error
                    this.$bvToast.toast('Cập nhật thành công', { variant: 'success' })
                }
                await this.fetchCustomers()
                this.initCreate()
            } catch (error) {
                this.$bvToast.toast(error.message, { variant: 'danger' })
            } finally {
                this.saving = false
            }
        },

        async confirmDelete(customer) {
            if (!confirm(`Bạn có chắc muốn xóa khách hàng "${customer.full_name}"?`)) return
            try {
                const { error } = await this.$supabase
                    .from('customers')
                    .delete()
                    .eq('id', customer.id)
                if (error) throw error
                this.$bvToast.toast('Đã xóa khách hàng', { variant: 'warning' })
                if (this.form.id === customer.id) this.initCreate()
                await this.fetchCustomers()
            } catch (error) {
                this.$bvToast.toast('Không thể xóa khách hàng này vì có dữ liệu liên quan', { variant: 'danger' })
            }
        },

        getInitials(name) {
            if (!name) return 'C'
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        }
    }
}
</script>

<style scoped>
.search-wrapper {
    max-width: 180px;
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
    height: 32px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    font-size: 0.8125rem;
    padding: 0 8px;
    border-radius: 6px;
}
</style>
