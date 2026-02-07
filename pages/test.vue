<template>
  <div class="page-container">
    <!-- Breadcrumb Modern -->
    <nav class="breadcrumb-nav" aria-label="breadcrumb">
      <ol class="breadcrumb-list">
        <li class="breadcrumb-item">
          <nuxt-link to="/" class="breadcrumb-link">
            <b-icon icon="house-door-fill" class="breadcrumb-icon" />
            <span>Trang chủ</span>
          </nuxt-link>
        </li>
        <li class="breadcrumb-separator">
          <b-icon icon="chevron-right" />
        </li>
        <li class="breadcrumb-item active">
          <b-icon icon="file-earmark-text" class="breadcrumb-icon" />
          <span>Test Page</span>
        </li>
      </ol>
    </nav>

    <!-- Page Title -->
    <div class="page-header">
      <h1 class="page-title">Hello World</h1>
      <p class="page-subtitle">Trang test giao diện và chức năng</p>
    </div>

    <!-- Test Cards -->
    <div class="cards-grid">
      <!-- Card 1 -->
      <div class="test-card">
        <div class="card-header-custom">
          <div class="card-header-icon bg-primary-soft">
            <b-icon icon="card-text" variant="primary" />
          </div>
          <span class="card-header-title">Test Card 1</span>
        </div>
        <div class="card-body-custom">
          <p class="card-text">Nội dung test thứ nhất với button tương tác</p>
          <b-button variant="primary" size="sm" class="btn-rounded">Click me</b-button>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="test-card">
        <div class="card-header-custom">
          <div class="card-header-icon bg-success-soft">
            <b-icon icon="palette" variant="success" />
          </div>
          <span class="card-header-title">Wide Content</span>
        </div>
        <div class="card-body-custom">
          <div class="gradient-bar"></div>
          <p class="card-text-small">Thanh gradient với border radius</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="test-card">
        <div class="card-header-custom">
          <div class="card-header-icon bg-warning-soft">
            <b-icon icon="list-ul" variant="warning" />
          </div>
          <span class="card-header-title">Scroll Test</span>
          <b-badge variant="light" class="ml-auto">20 items</b-badge>
        </div>
        <div class="card-body-custom p-0">
          <div v-for="i in 5" :key="i" class="list-item">
            <div class="list-dot" />
            <span class="list-text">Item số {{ i }}</span>
            <b-badge variant="secondary" class="list-badge">#{{ i }}</b-badge>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="test-card">
        <div class="card-header-custom">
          <div class="card-header-icon bg-info-soft">
            <b-icon icon="grid-3x3" variant="info" />
          </div>
          <span class="card-header-title">Grid Layout</span>
        </div>
        <div class="card-body-custom">
          <div class="mini-grid">
            <div v-for="i in 4" :key="i" class="mini-grid-item">
              <b-icon icon="square-fill" :variant="getVariant(i)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="test-card mt-3">
      <div class="card-header-custom">
        <div class="card-header-icon bg-danger-soft">
          <b-icon icon="table" variant="danger" />
        </div>
        <span class="card-header-title">Table Test</span>
      </div>
      <div class="card-body-custom p-0">
        <div class="table-wrap">
          <table class="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 5" :key="i">
                <td class="fw-500">#{{ i }}</td>
                <td>Test Item {{ i }}</td>
                <td>
                  <span class="status-badge" :class="`status-${getStatus(i)}`">
                    {{ getStatus(i) }}
                  </span>
                </td>
                <td class="text-right">
                  <button class="action-btn">
                    <b-icon icon="three-dots-vertical" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  layout: 'dashboard',

  methods: {
    getVariant(i) {
      const variants = ['primary', 'success', 'warning', 'info']
      return variants[(i - 1) % 4]
    },
    getStatus(i) {
      const statuses = ['active', 'pending', 'completed']
      return statuses[(i - 1) % 3]
    }
  }
}
</script>

<style scoped>
/* Page Container */
.page-container {
  max-width: 100%;
}

/* Breadcrumb Modern */
.breadcrumb-nav {
  margin-bottom: 1.5rem;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  padding: 0.375rem 0.75rem;
  background: #fff;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.breadcrumb-link:hover {
  color: #3b82f6;
  border-color: #3b82f6;
  background: #eff6ff;
}

.breadcrumb-icon {
  font-size: 0.875rem;
}

.breadcrumb-separator {
  color: #d1d5db;
  font-size: 0.75rem;
}

.breadcrumb-item.active {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #111827;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
}

/* Page Header */
.page-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

/* Test Card */
.test-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.test-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.card-header-custom {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-bottom: 1px solid #f0f0f0;
}

.card-header-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 1.125rem;
}

.bg-primary-soft { background: rgba(59, 130, 246, 0.1); }
.bg-success-soft { background: rgba(16, 185, 129, 0.1); }
.bg-warning-soft { background: rgba(245, 158, 11, 0.1); }
.bg-info-soft { background: rgba(59, 130, 246, 0.1); }
.bg-danger-soft { background: rgba(239, 68, 68, 0.1); }

.card-header-title {
  font-weight: 600;
  color: #374151;
  font-size: 0.9375rem;
}

.card-body-custom {
  padding: 1rem;
}

.card-text {
  color: #4b5563;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.card-text-small {
  color: #6b7280;
  font-size: 0.8125rem;
  margin: 0.75rem 0 0 0;
}

.btn-rounded {
  border-radius: 20px;
  padding: 0.375rem 1rem;
}

/* Gradient Bar */
.gradient-bar {
  height: 40px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* List Items */
.list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.15s;
}

.list-item:hover {
  background-color: #fafafa;
}

.list-item:last-child {
  border-bottom: none;
}

.list-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
}

.list-text {
  flex: 1;
  font-size: 0.875rem;
  color: #374151;
}

.list-badge {
  font-size: 0.6875rem;
  font-weight: 500;
}

/* Mini Grid */
.mini-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.mini-grid-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  font-size: 1.5rem;
  border: 1px solid #f0f0f0;
}

/* Table */
.table-wrap {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.875rem;
}

.custom-table th {
  padding: 0.875rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
}

.custom-table td {
  padding: 0.875rem 1rem;
  border-bottom: 1px solid #f0f0f0;
  color: #4b5563;
}

.custom-table tbody tr:hover {
  background-color: #fafafa;
}

.custom-table tbody tr:last-child td {
  border-bottom: none;
}

.fw-500 {
  font-weight: 500;
}

.text-right {
  text-align: right;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  font-size: 0.6875rem;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: capitalize;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #dbeafe;
  color: #1e40af;
}

/* Action Button */
.action-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}

.action-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

/* Utilities */
.mt-3 {
  margin-top: 1rem;
}

.ml-auto {
  margin-left: auto;
}
</style>
