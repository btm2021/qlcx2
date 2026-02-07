<template>
  <div>
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb bg-transparent p-0 mb-3">
        <li class="breadcrumb-item">
          <nuxt-link to="/">
            <b-icon icon="house-door" class="mr-1" />Home
          </nuxt-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">Test Page</li>
      </ol>
    </nav>

    <h5 class="font-weight-bold mb-3">Test Page - Hello World</h5>
    
    <!-- Test section 1 -->
    <b-card class="mb-3" header="Test Card 1">
      <p>Nội dung test thứ nhất</p>
      <b-button variant="primary" size="sm">Button</b-button>
    </b-card>

    <!-- Test section 2 - Wide content -->
    <b-card class="mb-3" header="Wide Content Test">
      <div style="width: 100%; background: linear-gradient(90deg, #ff6b6b, #4ecdc4); height: 50px; border-radius: 4px;"></div>
      <p class="mt-2 small text-muted">Thanh gradient trên nên kéo dài full width của container</p>
    </b-card>

    <!-- Test section 3 - Long content for scroll -->
    <b-card class="mb-3" header="Scroll Test">
      <div v-for="i in 20" :key="i" class="p-2 border-bottom">
        <div class="d-flex justify-content-between align-items-center">
          <span>Item {{ i }}</span>
          <b-badge variant="secondary">#{{ i }}</b-badge>
        </div>
        <p class="small text-muted mb-0">Nội dung mô tả cho item số {{ i }}</p>
      </div>
    </b-card>

    <!-- Test section 4 - Grid -->
    <b-card class="mb-3" header="Grid Test">
      <b-row>
        <b-col cols="6" md="3" v-for="i in 8" :key="i" class="mb-2">
          <div class="p-2 bg-light rounded text-center">
            <b-icon icon="square" font-scale="2" variant="primary" />
            <div class="small mt-1">Box {{ i }}</div>
          </div>
        </b-col>
      </b-row>
    </b-card>

    <!-- Test section 5 - Table -->
    <b-card class="mb-3" header="Table Test">
      <div class="table-responsive">
        <table class="table table-sm table-bordered mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 10" :key="i">
              <td>{{ i }}</td>
              <td>Test Item {{ i }}</td>
              <td><b-badge variant="success">Active</b-badge></td>
              <td>
                <b-button variant="link" size="sm" class="p-0">Edit</b-button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-card>

    <!-- Footer test -->
    <div class="text-center text-muted small py-3">
      --- End of Test Page ---
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestPage',
  layout: 'dashboard'
}
</script>
