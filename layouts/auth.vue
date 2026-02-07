<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header text-center mb-4">
         
          <h3 class="font-weight-bold">QUẢN LÝ CẦM XE</h3>
          <p class="text-muted">Bảo Phương Store System</p>
        </div>
        <Nuxt />
      </div>
      <div class="auth-footer text-center mt-4 text-muted">
        <small>&copy; {{ currentYear }} Bảo Phương Store. All rights reserved.</small>
      </div>
    </div>
    
    <!-- Background decoration -->
    <div class="auth-bg">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout',
  
  middleware: ['guest'],

  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.auth-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.auth-header h3 {
  color: #333;
  margin-bottom: 8px;
}

.auth-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 10%;
  background: rgba(255, 255, 255, 0.05);
}
</style>
