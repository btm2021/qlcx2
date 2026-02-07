<template>
  <div>
    <!-- Cards Grid -->
    <div class="cards-grid">
      <!-- Card 1: Basic -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon bg-primary-soft">
            <b-icon icon="card-text" variant="primary" />
          </div>
          <span class="card-title">Basic Card</span>
        </div>
        <div class="card-body">
          <p class="card-desc">Nội dung test thứ nhất với button tương tác</p>
          <b-button variant="primary" size="sm">Click me</b-button>
        </div>
      </div>

      <!-- Card 2: Visual -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon bg-success-soft">
            <b-icon icon="palette" variant="success" />
          </div>
          <span class="card-title">Visual Card</span>
        </div>
        <div class="card-body">
          <div class="color-bar"></div>
          <p class="card-desc mt-3">Thanh màu với border rõ ràng</p>
        </div>
      </div>

      <!-- Card 3: List -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon bg-warning-soft">
            <b-icon icon="list-ul" variant="warning" />
          </div>
          <span class="card-title">List Card</span>
          <b-badge variant="light" class="ml-auto count-badge">20</b-badge>
        </div>
        <div class="card-body list-body">
          <div v-for="i in 5" :key="i" class="list-item">
            <div class="list-bullet" />
            <span class="list-text">Item số {{ i }}</span>
            <b-badge variant="secondary" class="list-tag">#{{ i }}</b-badge>
          </div>
        </div>
      </div>

      <!-- Card 4: Grid -->
      <div class="card">
        <div class="card-header">
          <div class="card-icon bg-info-soft">
            <b-icon icon="grid-3x3" variant="info" />
          </div>
          <span class="card-title">Grid Card</span>
        </div>
        <div class="card-body">
          <div class="mini-grid">
            <div v-for="i in 4" :key="i" class="mini-item">
              <b-icon icon="square-fill" :variant="getVariant(i)" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="card table-card">
      <div class="card-header">
        <div class="card-icon bg-danger-soft">
          <b-icon icon="table" variant="danger" />
        </div>
        <span class="card-title">Table Example</span>
      </div>
      <div class="card-body p-0">
        <div class="table-container">
          <table class="data-table">
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
                <td class="fw-medium">#{{ i }}</td>
                <td>Test Item {{ i }}</td>
                <td>
                  <span class="status-pill" :class="`status-${getStatus(i)}`">
                    {{ getStatus(i) }}
                  </span>
                </td>
                <td class="text-right">
                  <button class="btn-action">
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
/* Page-specific styles only */
.color-bar {
  height: 36px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
  border-radius: 6px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
