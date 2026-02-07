<template>
  <div class="app">
    <!-- Top Navbar -->
    <b-navbar type="dark" variant="dark" class="navbar-fixed">
      <b-container fluid class="px-2">
        <b-row no-gutters align-v="center" class="w-100">
          <!-- Toggle & Brand -->
          <b-col>
            <div class="d-flex align-items-center">
              <b-button 
                variant="link" 
                class="text-light p-1 mr-2" 
                @click="toggleSidebar"
              >
                <b-icon icon="list" font-scale="1.2" />
              </b-button>
              <b-navbar-brand to="/" class="py-0">
                <b-icon icon="shop" class="mr-1" />
                <span class="small font-weight-bold">QL CẦM XE</span>
              </b-navbar-brand>
            </div>
          </b-col>

          <!-- Right: Noti + User -->
          <b-col cols="auto">
            <div class="d-flex align-items-center">
              <!-- Notifications -->
              <b-dropdown 
                variant="link" 
                no-caret 
                toggle-class="text-light p-1"
                right
              >
                <template #button-content>
                  <b-icon icon="bell" />
                  <b-badge 
                    v-if="notificationCount > 0" 
                    variant="danger" 
                    pill 
                    class="badge-xs"
                  >
                    {{ notificationCount }}
                  </b-badge>
                </template>
                <b-dropdown-header class="small">Thông báo</b-dropdown-header>
                <b-dropdown-item 
                  v-for="(noti, idx) in notifications" 
                  :key="idx" 
                  class="small"
                >
                  <b-icon :icon="noti.icon" :variant="noti.variant" class="mr-2" />
                  {{ noti.text }}
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item to="/notifications" class="small text-center">
                  Xem tất cả
                </b-dropdown-item>
              </b-dropdown>

              <!-- User -->
              <b-dropdown 
                variant="link" 
                right 
                toggle-class="text-light p-1 d-flex align-items-center"
              >
                <template #button-content>
                  <b-avatar 
                    :text="userInitials" 
                    size="1.5rem" 
                    variant="light" 
                    class="mr-1" 
                  />
                  <span class="small d-none d-sm-inline">{{ userName }}</span>
                  <b-icon icon="chevron-down" font-scale="0.7" class="ml-1" />
                </template>
                <b-dropdown-item to="/profile" class="small">
                  <b-icon icon="person" class="mr-2" />Hồ sơ
                </b-dropdown-item>
                <b-dropdown-item to="/settings" class="small">
                  <b-icon icon="gear" class="mr-2" />Cài đặt
                </b-dropdown-item>
                <b-dropdown-divider />
                <b-dropdown-item @click="logout" class="small">
                  <b-icon icon="box-arrow-right" class="mr-2" />Đăng xuất
                </b-dropdown-item>
              </b-dropdown>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </b-navbar>

    <!-- Layout -->
    <div class="layout">
      <!-- Sidebar -->
      <aside 
        class="sidebar" 
        :class="{ 
          'sidebar-open': sidebarOpen,
          'collapsed': !sidebarOpen 
        }"
      >
        <div class="sidebar-content">
          <!-- Menu -->
          <nav class="sidebar-menu">
            <div
              v-for="item in menuItems"
              :key="item.key"
              class="menu-item"
            >
              <!-- Single -->
              <nuxt-link
                v-if="!item.children"
                :to="item.to"
                class="menu-link"
                :class="{ active: isActive(item.to) }"
              >
                <b-icon :icon="item.icon" class="menu-icon" />
                <span>{{ item.label }}</span>
              </nuxt-link>

              <!-- Dropdown -->
              <div v-else class="menu-group">
                <div
                  class="menu-link"
                  :class="{ active: isDropdownActive(item.children) }"
                  @click="toggleGroup(item.key)"
                >
                  <b-icon :icon="item.icon" class="menu-icon" />
                  <span>{{ item.label }}</span>
                  <b-icon 
                    icon="chevron-down" 
                    class="menu-arrow ml-auto"
                    :class="{ rotate: openGroup === item.key }" 
                  />
                </div>
                <div 
                  v-show="openGroup === item.key" 
                  class="submenu"
                >
                  <nuxt-link
                    v-for="child in item.children"
                    :key="child.key"
                    :to="child.to"
                    class="submenu-link"
                    :class="{ active: isActive(child.to) }"
                  >
                    <b-icon :icon="child.icon" class="mr-2" />
                    {{ child.label }}
                  </nuxt-link>
                </div>
              </div>
            </div>
          </nav>

          <!-- Footer -->
          <div class="sidebar-footer">
            <span class="small text-muted">v1.0.0</span>
          </div>
        </div>
      </aside>

      <!-- Mobile Overlay -->
      <div 
        v-if="sidebarOpen" 
        class="sidebar-overlay d-lg-none" 
        @click="sidebarOpen = false"
      />

      <!-- Main -->
      <main class="main-content">
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',
  middleware: ['auth'],

  data() {
    return {
      user: null,
      sidebarOpen: true,
      openGroup: null,
      notificationCount: 3,
      notifications: [
        { icon: 'clock', variant: 'warning', text: '2 hợp đồng sắp hết hạn' },
        { icon: 'person-plus', variant: 'info', text: 'Khách hàng mới' },
        { icon: 'cash-stack', variant: 'success', text: 'Thanh toán thành công' }
      ],
      menuItems: [
        { key: 'dashboard', label: 'Tổng quan', icon: 'house-door', to: '/' },
        { 
          key: 'contracts', 
          label: 'Hợp đồng', 
          icon: 'file-text',
          children: [
            { key: 'contracts-list', label: 'Danh sách', icon: 'list', to: '/contracts' },
            { key: 'contracts-create', label: 'Tạo mới', icon: 'plus-circle', to: '/contracts/create' },
            { key: 'contracts-expired', label: 'Sắp hết hạn', icon: 'clock', to: '/contracts/expired' }
          ]
        },
        { 
          key: 'customers', 
          label: 'Khách hàng', 
          icon: 'people',
          children: [
            { key: 'customers-list', label: 'Danh sách', icon: 'list', to: '/customers' },
            { key: 'customers-create', label: 'Thêm mới', icon: 'plus-circle', to: '/customers/create' }
          ]
        },
        { 
          key: 'vehicles', 
          label: 'Phương tiện', 
          icon: 'car-front',
          children: [
            { key: 'vehicles-list', label: 'Danh sách', icon: 'list', to: '/vehicles' },
            { key: 'vehicles-create', label: 'Thêm mới', icon: 'plus-circle', to: '/vehicles/create' }
          ]
        },
        { key: 'reports', label: 'Báo cáo', icon: 'graph-up', to: '/reports' },
        { key: 'settings', label: 'Cài đặt', icon: 'gear', to: '/settings' }
      ]
    }
  },

  computed: {
    userName() {
      return this.user?.user_metadata?.full_name || this.user?.email || 'User'
    },
    userInitials() {
      const name = this.user?.user_metadata?.full_name || this.user?.email || 'U'
      return name.charAt(0).toUpperCase()
    }
  },

  mounted() {
    this.user = this.$supabase.auth.user()
    
    // Close sidebar on mobile by default
    if (window.innerWidth < 992) {
      this.sidebarOpen = false
    }
    
    // Listen resize
    window.addEventListener('resize', this.handleResize)
    
    const { data: { subscription } } = this.$supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') this.$router.push('/login')
      this.user = session?.user || null
    })
    
    this.$once('hook:beforeDestroy', () => {
      subscription?.unsubscribe()
      window.removeEventListener('resize', this.handleResize)
    })
  },

  methods: {
    isActive(path) {
      return this.$route.path === path || this.$route.path.startsWith(path + '/')
    },
    isDropdownActive(children) {
      return children.some(child => this.isActive(child.to))
    },
    toggleGroup(key) {
      this.openGroup = this.openGroup === key ? null : key
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    handleResize() {
      if (window.innerWidth >= 992) {
        this.sidebarOpen = true
      } else {
        this.sidebarOpen = false
      }
    },
    async logout() {
      try {
        await this.$auth.signOut()
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
  }
}
</script>

<style scoped>
/* App - Prevent page scroll */
.app {
  height: 100vh;
  overflow: hidden;
  background-color: #f3f4f6;
}

/* Navbar - Fixed, no scroll */
.navbar-fixed {
  height: 40px;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Scrollbar styling - Chrome, Safari */
.sidebar::-webkit-scrollbar {
  width: 5px;
}

.main-content::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
}

.main-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.main-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.3);
}

/* Scrollbar - Firefox */
.sidebar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.main-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.badge-xs {
  font-size: 0.5rem;
  padding: 0.1em 0.3em;
  position: absolute;
  top: 2px;
  right: 2px;
}

/* Layout - Fixed height, no scroll, below navbar */
.layout {
  display: flex;
  height: calc(100vh - 40px);
  margin-top: 40px;
  overflow: hidden;
}

/* Sidebar - Collapsible width */
.sidebar {
  width: 200px;
  background-color: #1f2937;
  flex: 0 0 200px;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  transition: flex-basis 0.3s ease, width 0.3s ease;
}

/* Collapsed state */
.sidebar.collapsed {
  flex: 0 0 0px;
  width: 0;
  opacity: 0;
}

.sidebar:not(.collapsed) {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.sidebar-menu {
  flex: 1;
  padding: 0.5rem 0;
}

/* Menu Item */
.menu-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.75rem;
  margin: 0 0.5rem;
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.menu-link:hover {
  color: #f9fafb;
  background-color: rgba(255, 255, 255, 0.08);
}

.menu-link.active {
  color: #60a5fa;
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.15) 0%, rgba(96, 165, 250, 0.05) 100%);
  border-left: 3px solid #60a5fa;
}

.menu-icon {
  width: 1.25rem;
  margin-right: 0.5rem;
}

.menu-arrow {
  font-size: 0.625rem;
  transition: transform 0.2s;
}

.menu-arrow.rotate {
  transform: rotate(180deg);
}

/* Submenu */
.submenu {
  background-color: rgba(0, 0, 0, 0.2);
  border-left: 3px solid transparent;
}

.submenu-link {
  display: block;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  margin: 0.125rem 0.5rem;
  color: #9ca3af;
  text-decoration: none;
  font-size: 0.75rem;
  transition: all 0.15s ease;
  border-radius: 4px;
}

.submenu-link:hover {
  color: #f9fafb;
  background-color: rgba(255, 255, 255, 0.08);
}

.submenu-link.active {
  color: #60a5fa;
  background-color: rgba(96, 165, 250, 0.1);
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  text-align: center;
}

/* Overlay */
.sidebar-overlay {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1015;
}

/* Main Content - Fill remaining width, scrollable */
.main-content {
  flex: 1 1 auto;
  min-width: 0;
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #f8f9fa;
}

/* Mobile - Sidebar fixed overlay, no margin needed */
@media (max-width: 991px) {
  .sidebar {
    position: fixed;
    top: 40px;
    bottom: 0;
    left: 0;
    z-index: 1020;
    flex: none;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
  
  .main-content {
    flex: 1;
    min-width: 0;
  }
}

@media (min-width: 992px) {
  .sidebar {
    position: relative;
    transform: none !important;
  }
  
  .sidebar-overlay {
    display: none !important;
  }
}
</style>
