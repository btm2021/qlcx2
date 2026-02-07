<template>
  <div class="app">
    <!-- Top Navbar - Minimal -->
    <header class="navbar-mini">
      <div class="navbar-left">
        <button class="btn-toggle" @click="toggleSidebar">
          <b-icon icon="list" />
        </button>
        <nuxt-link to="/" class="brand">
          <div class="brand-icon">
            <b-icon icon="shop" />
          </div>
        </nuxt-link>
      </div>

      <div class="navbar-right">
        <!-- Notifications -->
        <b-dropdown variant="link" no-caret toggle-class="btn-icon" right boundary="viewport">
          <template #button-content>
            <b-icon icon="bell" />
            <span v-if="notificationCount > 0" class="noti-dot" />
          </template>
          <b-dropdown-header>Thông báo</b-dropdown-header>
          <b-dropdown-item v-for="(noti, idx) in notifications" :key="idx">
            <div class="noti-item">
              <div class="noti-icon" :class="`bg-${noti.variant}-soft`">
                <b-icon :icon="noti.icon" :variant="noti.variant" />
              </div>
              <div class="noti-content">
                <p class="noti-text">{{ noti.text }}</p>
                <span class="noti-time">{{ noti.time }}</span>
              </div>
            </div>
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item to="/notifications" class="text-center text-primary">
            Xem tất cả
          </b-dropdown-item>
        </b-dropdown>

        <!-- User -->
        <b-dropdown variant="link" right no-caret toggle-class="btn-user" boundary="viewport">
          <template #button-content>
            <b-avatar :text="userInitials" size="1.75rem" variant="primary" class="user-avatar" />
          </template>

          <!-- Dropdown Header -->
          <div class="dropdown-header-user">
            <b-avatar :text="userInitials" size="2.25rem" variant="primary" />
            <div class="dropdown-user-info">
              <span class="dropdown-user-name">{{ userName }}</span>
              <span class="dropdown-user-email">{{ userEmail }}</span>
            </div>
          </div>

          <b-dropdown-divider />

          <b-dropdown-item to="/profile">
            <b-icon icon="person" class="mr-2" />Hồ sơ
          </b-dropdown-item>
          <b-dropdown-item to="/settings">
            <b-icon icon="gear" class="mr-2" />Cài đặt
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="logout" class="text-danger">
            <b-icon icon="box-arrow-right" class="mr-2" />Đăng xuất
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </header>

    <!-- Layout -->
    <div class="layout">
      <!-- Sidebar - Minimal -->
      <aside class="sidebar" :class="{
        'sidebar-collapsed': !sidebarOpen,
        'sidebar-mobile-open': sidebarOpen && isMobile
      }">
        <nav class="sidebar-nav">
          <div v-for="item in menuItems" :key="item.key" class="nav-section">
            <!-- Single Item -->
            <nuxt-link v-if="!item.children" :to="item.to" class="nav-item" :class="{ active: isActive(item.to) }"
              v-b-tooltip.right="!sidebarOpen ? item.label : null">
              <div class="nav-icon">
                <b-icon :icon="item.icon" />
              </div>
              <span class="nav-label">{{ item.label }}</span>
            </nuxt-link>

            <!-- Dropdown Item -->
            <div v-else class="nav-group" :class="{ expanded: openGroup === item.key }">
              <div class="nav-item" :class="{ active: isDropdownActive(item.children) }" @click="toggleGroup(item.key)"
                v-b-tooltip.right="!sidebarOpen && openGroup !== item.key ? item.label : null">
                <div class="nav-icon">
                  <b-icon :icon="item.icon" />
                </div>
                <span class="nav-label">{{ item.label }}</span>
                <b-icon icon="chevron-down" class="nav-arrow" />
              </div>
              <div class="nav-submenu">
                <nuxt-link v-for="child in item.children" :key="child.key" :to="child.to" class="sub-item"
                  :class="{ active: isActive(child.to) }">
                  <span class="sub-dot" />
                  <span class="sub-label">{{ child.label }}</span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </nav>

        <!-- Sidebar Footer -->
        <div class="sidebar-footer" v-if="sidebarOpen">
          <span class="version">v1.0.0</span>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      <div v-if="sidebarOpen && isMobile" class="sidebar-overlay" @click="sidebarOpen = false" />

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Dashboard Header (Fixed) -->
        <div class="dashboard-header">
          <div class="page-top-bar">
            <nav class="breadcrumb-nav" aria-label="breadcrumb">
              <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                  <nuxt-link to="/" class="breadcrumb-link">
                    <b-icon icon="house-door" class="breadcrumb-icon" />
                  </nuxt-link>
                </li>
                <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-separator-wrap">
                  <span class="breadcrumb-separator">
                    <b-icon icon="chevron-right" />
                  </span>
                </li>
                <li class="breadcrumb-item active">
                  <span>{{ pageTitle }}</span>
                </li>
              </ol>
            </nav>

            <!-- Page Title -->
            <div class="page-header-inline">
              <h1 class="page-title">{{ pageTitle }}</h1>
            </div>
          </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="main-scroll-area">
          <div class="page-content-box">
            <Nuxt />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export default {
  name: 'DashboardLayout',
  middleware: ['auth'],

  data() {
    return {
      user: null
    }
  },

  computed: {
    ...mapState('ui', [
      'sidebarOpen',
      'openGroup',
      'notificationCount',
      'notifications',
      'menuItems',
      'pageTitles',
      'isMobile'
    ]),
    ...mapGetters('ui', ['getPageTitle']),

    userName() {
      return this.user?.full_name || this.user?.email?.split('@')[0] || 'User'
    },
    userEmail() {
      return this.user?.email || ''
    },
    userInitials() {
      const name = this.user?.full_name || this.user?.email || 'U'
      return name.charAt(0).toUpperCase()
    },
    pageTitle() {
      // Get title from route meta, or from mapping, or from path
      return this.$route.meta?.title ||
        this.pageTitles[this.$route.path] ||
        this.getTitleFromPath(this.$route.path)
    },
    breadcrumbs() {
      // Generate breadcrumbs from current route
      const path = this.$route.path
      if (path === '/') return []

      const parts = path.split('/').filter(Boolean)
      return parts.slice(0, -1).map((part, index) => {
        const pathSlice = '/' + parts.slice(0, index + 1).join('/')
        return {
          label: this.pageTitles[pathSlice] || this.formatLabel(part),
          to: pathSlice
        }
      })
    }
  },

  watch: {
    '$route.path': {
      immediate: true,
      handler() {
        // Auto-expand sidebar group based on current route
        this.autoExpandGroup()
      }
    }
  },

  mounted() {
    const userStr = localStorage.getItem('auth_user')
    if (userStr) {
      this.user = JSON.parse(userStr)
    } else {
      this.$router.push('/login')
    }

    this.checkMobile()
    this.autoExpandGroup()

    window.addEventListener('resize', this.handleResize)

    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.handleResize)
    })
  },

  methods: {
    ...mapMutations('ui', [
      'SET_SIDEBAR_OPEN',
      'SET_OPEN_GROUP',
      'TOGGLE_GROUP',
      'CLOSE_ALL_GROUPS',
      'SET_MOBILE'
    ]),
    ...mapActions('ui', ['toggleSidebar', 'toggleGroup']),

    checkMobile() {
      const isMobile = window.innerWidth < 992
      this.SET_MOBILE(isMobile)
      if (isMobile && this.sidebarOpen) {
        this.SET_SIDEBAR_OPEN(false)
      }
    },

    handleResize() {
      const wasMobile = this.isMobile
      const isMobile = window.innerWidth < 992
      this.SET_MOBILE(isMobile)

      if (!wasMobile && isMobile) {
        this.SET_SIDEBAR_OPEN(false)
      } else if (wasMobile && !isMobile) {
        this.SET_SIDEBAR_OPEN(true)
      }
    },

    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },

    isDropdownActive(children) {
      return children.some(child => this.isActive(child.to))
    },

    autoExpandGroup() {
      // Auto expand sidebar group based on current route
      const currentPath = this.$route.path
      for (const item of this.menuItems) {
        if (item.children && item.children.some(child => currentPath.startsWith(child.to))) {
          this.SET_OPEN_GROUP(item.key)
          return
        }
      }
    },

    getTitleFromPath(path) {
      // Convert path to title
      if (path === '/') return 'Tổng quan'
      const parts = path.split('/').filter(Boolean)
      const lastPart = parts[parts.length - 1]
      return this.formatLabel(lastPart)
    },

    formatLabel(str) {
      // Convert kebab-case or snake_case to Title Case
      return str
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
    },

    async logout() {
      try {
        localStorage.removeItem('auth_user')
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>

<style scoped>
/* ========== CSS Variables ========== */
:root {
  --navbar-height: 48px;
  --sidebar-width: 220px;
  --sidebar-collapsed: 60px;
  --primary: #3b82f6;
  --primary-soft: #eff6ff;
  --success-soft: #ecfdf5;
  --warning-soft: #fffbeb;
  --info-soft: #eff6ff;
  --danger-soft: #fef2f2;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}

/* ========== App Container ========== */
.app {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* ========== Navbar - Minimal ========== */
.navbar-mini {
  height: 40px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.75rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1030;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.btn-toggle {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 1rem;
}

.btn-toggle:hover {
  background: #f3f4f6;
  color: #374151;
}

.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.btn-icon {
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.15s ease;
  font-size: 0.9375rem;
}

.btn-icon:hover {
  background: #f3f4f6;
  color: #374151;
}

.noti-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  border: 1.5px solid #ffffff;
}

.btn-user {
  display: flex;
  align-items: center;
  padding: 0.125rem;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: inherit;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-user:hover {
  background: #f3f4f6;
}

.user-avatar {
  font-size: 0.75rem;
  font-weight: 600;
}

/* ========== Layout ========== */
.layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - 40px);
}

/* ========== Sidebar - Minimal ========== */
.sidebar {
  width: 220px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.25s ease;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 60px;
}

.sidebar-nav {
  flex: 1;
  padding: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-section {
  margin-bottom: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  height: 36px;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.nav-item.active {
  background: #eff6ff;
  color: #2563eb;
}

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.9375rem;
}

.nav-label {
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.sidebar-collapsed .nav-label,
.sidebar-collapsed .nav-arrow {
  opacity: 0;
  pointer-events: none;
}

.nav-arrow {
  margin-left: auto;
  font-size: 0.625rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
  flex-shrink: 0;
}

.nav-group.expanded .nav-arrow {
  transform: rotate(180deg);
}

/* Submenu */
.nav-submenu {
  margin-top: 0.25rem;
  padding-left: 0.5rem;
  display: none;
}

.nav-group.expanded .nav-submenu {
  display: block;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sub-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4375rem 0.75rem;
  padding-left: 2rem;
  border-radius: 6px;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.15s ease;
}

.sub-item:hover {
  color: #374151;
  background: #f9fafb;
}

.sub-item.active {
  color: #2563eb;
  background: #eff6ff;
  font-weight: 500;
}

.sub-dot {
  width: 4px;
  height: 4px;
  background: #d1d5db;
  border-radius: 50%;
  flex-shrink: 0;
}

.sub-item.active .sub-dot {
  background: #3b82f6;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
}

.version {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.sidebar-collapsed .sidebar-footer {
  display: none;
}

/* ========== Scrollbar Styling ========== */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
}

.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Firefox Scrollbar */
.sidebar-nav {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.main-content {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

/* ========== Main Content ========== */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f8fafc;
}

.dashboard-header {
  padding: 1.25rem 1.25rem 0.5rem 1.25rem;
  background-color: #f8fafc;
  flex-shrink: 0;
  z-index: 100;
}

.main-scroll-area {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 1.25rem 1.25rem 1.25rem;
}

/* ========== Page Top Bar (Breadcrumb + Title) ========== */
.page-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* ========== Breadcrumb ========== */
.breadcrumb-nav {
  display: flex;
  align-items: center;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.375rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.75rem;
  padding: 0.125rem;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.breadcrumb-link:hover {
  color: #3b82f6;
}

.breadcrumb-icon {
  font-size: 0.8125rem;
}

.breadcrumb-separator-wrap {
  display: flex;
  align-items: center;
}

.breadcrumb-separator {
  color: #d1d5db;
  font-size: 0.625rem;
}

.breadcrumb-item.active {
  font-size: 0.75rem;
  color: #374151;
  font-weight: 500;
}

/* ========== Page Header Inline ========== */
.page-header-inline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-header-inline .page-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* ========== Page Content Box ========== */
.page-content-box {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.25rem;
  min-height: calc(100vh - 200px);
}

/* ========== Overlay ========== */
.sidebar-overlay {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1015;
  backdrop-filter: blur(2px);
}

/* ========== Dropdown Styles ========== */
.dropdown-header-user {
  padding: 0.875rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dropdown-user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1f2937;
}

.dropdown-user-email {
  font-size: 0.6875rem;
  color: #6b7280;
}

.noti-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.125rem 0;
}

.noti-icon {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 0.875rem;
}

.bg-success-soft {
  background: #ecfdf5;
}

.bg-warning-soft {
  background: #fffbeb;
}

.bg-info-soft {
  background: #eff6ff;
}

.bg-danger-soft {
  background: #fef2f2;
}

.noti-content {
  flex: 1;
  min-width: 0;
}

.noti-text {
  margin: 0;
  font-size: 0.8125rem;
  color: #374151;
  line-height: 1.4;
}

.noti-time {
  font-size: 0.625rem;
  color: #9ca3af;
}

/* ========== Mobile Responsive ========== */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    top: 40px;
    left: 0;
    bottom: 0;
    z-index: 1020;
    transform: translateX(-100%);
    width: 220px;
  }

  .sidebar-mobile-open {
    transform: translateX(0);
  }

  .sidebar-collapsed {
    width: 220px;
  }

  .sidebar-collapsed .nav-label,
  .sidebar-collapsed .nav-arrow {
    opacity: 1;
    pointer-events: auto;
  }

  .sidebar-footer {
    display: block;
  }

  .page-top-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (min-width: 992px) {
  .sidebar-overlay {
    display: none;
  }
}
</style>
