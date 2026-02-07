<template>
    <div class="contract-creation-page">
        <div class="row justify-content-center">
            <div class="col-xl-12 col-lg-12">
                <!-- Header Actions -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h5 class="fw-bold mb-0">Hợp đồng Cầm xe mới</h5>
                        <p class="text-muted small mb-0">Hệ thống quản lý quy trình cầm cố phương tiện</p>
                    </div>
                    <div class="d-flex gap-2">
                        <b-button variant="outline-secondary" size="sm" @click="$router.push('/')">
                            Hủy bỏ
                        </b-button>
                        <b-button variant="primary" size="sm" class="px-3" @click="saveContract" :disabled="saving">
                            <b-spinner v-if="saving" small class="mr-1" />
                            Hoàn tất tạo Hợp đồng
                        </b-button>
                    </div>
                </div>

                <div class="row">
                    <!-- Left Column: Main Data -->
                    <div class="col-lg-8">
                        <!-- Section 1: Customer & Contract Info -->
                        <div class="card border-0 shadow-sm mb-3">
                            <div class="card-body p-3">
                                <h6 class="fw-bold border-bottom pb-2 mb-3">
                                    <b-icon icon="person" class="mr-1" /> Thông tin cơ bản
                                </h6>
                                <div class="row">
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label-small">Số Hợp đồng</label>
                                        <b-form-input v-model="form.contract_number" class="form-control-custom"
                                            required autocomplete="off" />
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <label class="form-label-small">Ngày tạo</label>
                                        <b-form-input v-model="form.start_date" type="date" class="form-control-custom"
                                            required autocomplete="off" />
                                    </div>
                                </div>
                                <div class="mb-0">
                                    <label class="form-label-small">Khách hàng</label>
                                    <div class="d-flex gap-2">
                                        <b-form-select v-model="form.customer_id" :options="customerOptions"
                                            class="form-control-custom h-auto py-1" required autocomplete="off" />
                                        <b-button variant="light" size="sm" class="border" v-b-tooltip.hover
                                            title="Thêm khách hàng nhanh" @click="showQuickCustomer = true">
                                            <b-icon icon="plus" />
                                        </b-button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Vehicle Info -->
                        <div class="card border-0 shadow-sm mb-3">
                            <div class="card-body p-3">
                                <h6 class="fw-bold border-bottom pb-2 mb-3">
                                    <b-icon icon="truck" class="mr-1" /> Thông tin Phương tiện
                                </h6>
                                <div class="mb-3">
                                    <label class="form-label-small">Chọn xe hiện có (Nếu xe đã từng cầm)</label>
                                    <b-form-select v-model="form.vehicle_id" :options="vehicleOptions"
                                        class="form-control-custom h-auto py-1" autocomplete="off"
                                        @change="handleVehicleChange" />
                                </div>

                                <div class="bg-light p-3 rounded" v-if="!form.vehicle_id">
                                    <p class="small font-weight-bold text-primary mb-2">Nhập mới thông tin xe:</p>
                                    <div class="row">
                                        <div class="col-md-6 mb-2">
                                            <label class="form-label-small">Biển số xe</label>
                                            <b-form-input v-model="newVehicle.license_plate" class="form-control-custom"
                                                placeholder="VD: 30A-123.45" autocomplete="off" />
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label class="form-label-small">Màu sắc</label>
                                            <b-form-input v-model="newVehicle.color" class="form-control-custom"
                                                autocomplete="off" />
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label class="form-label-small">Số khung (VIN)</label>
                                            <b-form-input v-model="newVehicle.vin_number" class="form-control-custom"
                                                autocomplete="off" />
                                        </div>
                                        <div class="col-md-6 mb-2">
                                            <label class="form-label-small">Số máy</label>
                                            <b-form-input v-model="newVehicle.engine_number" class="form-control-custom"
                                                autocomplete="off" />
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-primary-soft p-2 rounded d-flex align-items-center" v-else>
                                    <b-icon icon="info-circle" class="mr-2 text-primary" />
                                    <span class="small text-primary">Đã chọn xe biển số: <strong>{{ selectedVehiclePlate
                                            }}</strong></span>
                                    <b-button variant="link" size="sm" class="ml-auto p-0 text-primary"
                                        @click="form.vehicle_id = null">Thay đổi</b-button>
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: Inspection & Condition -->
                        <div class="card border-0 shadow-sm mb-3">
                            <div class="card-body p-3">
                                <h6 class="fw-bold border-bottom pb-2 mb-3">
                                    <b-icon icon="clipboard-check" class="mr-1" /> Thẩm định tình trạng
                                </h6>
                                <div class="mb-3">
                                    <label class="form-label-small">Tình trạng tổng quát</label>
                                    <b-form-textarea v-model="inspection.overall_condition" rows="3"
                                        class="form-control-custom h-auto" placeholder="Mô tả trầy xước, máy móc..."
                                        autocomplete="off" />
                                </div>
                                <div class="mb-0">
                                    <label class="form-label-small">Ghi chú kiểm định</label>
                                    <b-form-textarea v-model="inspection.notes" rows="2"
                                        class="form-control-custom h-auto" autocomplete="off" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Financials -->
                    <div class="col-lg-4">
                        <!-- Valuation & Loan -->
                        <div class="card border-0 shadow-sm mb-3 bg-primary">
                            <div class="card-body p-3">
                                <h6 class="fw-bold mb-3">Định giá & Khoản vay</h6>
                                <div class="mb-3">
                                    <label class="form-label-small ">Giá trị thị trường ước tính</label>
                                    <div class="input-group input-group-sm">
                                        <b-form-input v-model.number="valuation.market_value" type="number"
                                            class="bg-white-10 border-white-20 " autocomplete="off" />
                                        <div class="input-group-append">
                                            <span class="input-group-text bg-transparent border-white-20 ">VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-small ">Số tiền cho vay thực tế</label>
                                    <div class="input-group input-group-sm">
                                        <b-form-input v-model.number="form.loan_amount" type="number"
                                            class="bg-white-10 border-white-20 " autocomplete="off" />
                                        <div class="input-group-append">
                                            <span class="input-group-text bg-transparent border-white-20 ">VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Interest & Duration -->
                        <div class="card border-0 shadow-sm mb-3">
                            <div class="card-body p-3">
                                <h6 class="fw-bold border-bottom pb-2 mb-3">Hợp đồng & Lãi suất</h6>
                                <div class="mb-3">
                                    <label class="form-label-small">Lãi suất tháng (%)</label>
                                    <b-form-input v-model.number="form.interest_rate" type="number" step="0.1"
                                        class="form-control-custom" autocomplete="off" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label-small">Hạn trả (Dự kiến)</label>
                                    <b-form-input v-model="form.end_date" type="date" class="form-control-custom"
                                        autocomplete="off" />
                                </div>
                                <div class="mb-0">
                                    <label class="form-label-small">Trạng thái ban đầu</label>
                                    <b-form-select v-model="form.stage" :options="stageOptions"
                                        class="form-control-custom h-auto py-1" autocomplete="off" />
                                </div>
                            </div>
                        </div>

                        <!-- Summary info -->
                        <div class="alert alert-info border-0 shadow-sm small">
                            <b-icon icon="info-circle" class="mr-1" />
                            Hợp đồng sẽ được lưu ở trạng thái <strong>{{ formatStage(form.stage) }}</strong>.
                            Sau khi tạo, bạn có thể in phiếu tiếp nhận và bàn giao tài sản.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Customer Modal -->
        <b-modal v-model="showQuickCustomer" title="Thêm khách hàng nhanh" size="sm" hide-footer centered>
            <b-form @submit.prevent="createQuickCustomer">
                <div class="mb-2">
                    <label class="form-label-small">Họ tên</label>
                    <b-form-input v-model="quickCustomer.full_name" size="sm" required autocomplete="off" />
                </div>
                <div class="mb-2">
                    <label class="form-label-small">Số điện thoại</label>
                    <b-form-input v-model="quickCustomer.phone_number" size="sm" required autocomplete="off" />
                </div>
                <div class="mb-3">
                    <label class="form-label-small">Số CCCD</label>
                    <b-form-input v-model="quickCustomer.identity_card" size="sm" required autocomplete="off" />
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <b-button variant="light" size="sm" @click="showQuickCustomer = false">Hủy</b-button>
                    <b-button type="submit" variant="primary" size="sm" :disabled="creatingCustomer">Lưu</b-button>
                </div>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'ContractComplexForm',
    layout: 'dashboard',

    data() {
        return {
            customers: [],
            vehicles: [],
            loading: true,
            saving: false,
            showQuickCustomer: false,
            creatingCustomer: false,

            form: {
                contract_number: 'HD' + Date.now().toString().slice(-6),
                customer_id: null,
                vehicle_id: null,
                loan_amount: 0,
                interest_rate: 3.0,
                start_date: new Date().toISOString().substring(0, 10),
                end_date: '',
                stage: 'reception'
            },

            newVehicle: {
                license_plate: '',
                color: '',
                vin_number: '',
                engine_number: ''
            },

            valuation: {
                market_value: 0,
                proposed_loan_value: 0
            },

            inspection: {
                overall_condition: '',
                notes: ''
            },

            quickCustomer: {
                full_name: '',
                phone_number: '',
                identity_card: ''
            },

            stageOptions: [
                { value: 'reception', text: 'Tiếp nhận' },
                { value: 'inspection', text: 'Kiểm định' },
                { value: 'contract_draft', text: 'Thẩm định giá' },
                { value: 'disbursement', text: 'Đã giải ngân' }
            ]
        }
    },

    computed: {
        customerOptions() {
            return [
                { value: null, text: '-- Chọn khách hàng --' },
                ...this.customers.map(c => ({ value: c.id, text: `${c.full_name} (${c.phone_number})` }))
            ]
        },
        vehicleOptions() {
            return [
                { value: null, text: '-- Đăng ký xe mới cho hợp đồng này --' },
                ...this.vehicles.map(v => ({ value: v.id, text: `${v.license_plate} - ${v.color || ''}` }))
            ]
        },
        selectedVehiclePlate() {
            const v = this.vehicles.find(v => v.id === this.form.vehicle_id)
            return v ? v.license_plate : ''
        }
    },

    async mounted() {
        await this.loadInitialData()
    },

    methods: {
        async loadInitialData() {
            this.loading = true
            try {
                const [custRes, vehRes] = await Promise.all([
                    this.$supabase.from('customers').select('id, full_name, phone_number').order('full_name'),
                    this.$supabase.from('vehicles').select('id, license_plate, color').order('license_plate')
                ])
                this.customers = custRes.data || []
                this.vehicles = vehRes.data || []
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                this.loading = false
            }
        },

        async saveContract() {
            if (!this.form.customer_id) return this.toast('Vui lòng chọn khách hàng', 'warning')
            if (!this.form.vehicle_id && !this.newVehicle.license_plate) return this.toast('Vui lòng nhập thông tin xe', 'warning')

            this.saving = true
            try {
                let vehicleId = this.form.vehicle_id

                // 1. Nếu là xe mới, tạo xe trước
                if (!vehicleId) {
                    const { data: vData, error: vErr } = await this.$supabase
                        .from('vehicles')
                        .insert({
                            owner_id: this.form.customer_id,
                            license_plate: this.newVehicle.license_plate,
                            color: this.newVehicle.color,
                            vin_number: this.newVehicle.vin_number,
                            engine_number: this.newVehicle.engine_number
                        })
                        .select()
                    if (vErr) throw vErr
                    vehicleId = vData[0].id
                }

                // 2. Tạo hợp đồng
                const { data: cData, error: cErr } = await this.$supabase
                    .from('contracts')
                    .insert({
                        ...this.form,
                        vehicle_id: vehicleId,
                        created_by: this.$store.state.auth?.user?.id || null
                    })
                    .select()
                if (cErr) throw cErr
                const contractId = cData[0].id

                // 3. Tạo định giá
                await this.$supabase.from('contract_valuations').insert({
                    contract_id: contractId,
                    market_value: this.valuation.market_value,
                    final_loan_value: this.form.loan_amount
                })

                // 4. Tạo kiểm định
                await this.$supabase.from('inspections').insert({
                    contract_id: contractId,
                    overall_condition: this.inspection.overall_condition,
                    notes: this.inspection.notes
                })

                this.toast('Đã tạo hồ sơ hợp đồng thành công!', 'success')
                this.$router.push('/')
            } catch (error) {
                this.toast(error.message, 'danger')
            } finally {
                this.saving = false
            }
        },

        async createQuickCustomer() {
            this.creatingCustomer = true
            try {
                const { data, error } = await this.$supabase
                    .from('customers')
                    .insert(this.quickCustomer)
                    .select()
                if (error) throw error
                this.customers.unshift(data[0])
                this.form.customer_id = data[0].id
                this.showQuickCustomer = false
                this.toast('Đã thêm khách hàng', 'success')
            } catch (error) {
                this.toast(error.message, 'danger')
            } finally {
                this.creatingCustomer = false
            }
        },

        handleVehicleChange() {
            if (this.form.vehicle_id) {
                this.newVehicle = { license_plate: '', color: '', vin_number: '', engine_number: '' }
            }
        },

        formatCurrency(val) {
            return new Intl.NumberFormat('vi-VN').format(val)
        },

        formatStage(stage) {
            const found = this.stageOptions.find(o => o.value === stage)
            return found ? found.text : stage
        },

        toast(msg, variant) {
            this.$bvToast.toast(msg, { variant, solid: true, autohide: 3000 })
        }
    }
}
</script>

<style scoped>
.fw-bold {
    font-weight: 700;
}

.form-label-small {
    font-size: 0.7rem;
    font-weight: 700;
    color: #475569;
    margin-bottom: 0.3rem;
    display: block;
}

.form-control-custom {
    font-size: 0.85rem;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
}

.form-control-custom:focus {
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.bg-white-10 {
    background: rgba(255, 255, 255, 0.1) !important;
}

.border-white-20 {
    border-color: rgba(255, 255, 255, 0.2) !important;
}

.bg-primary-soft {
    background-color: #eff6ff;
}

.input-group-text {
    font-size: 0.75rem;
    font-weight: bold;
}
</style>
