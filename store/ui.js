/**
 * UI Configuration Store
 * Centralized state for dashboard UI components
 */

export const state = () => ({
  // Sidebar state
  sidebarOpen: true,
  openGroup: null,

  // Notifications
  notificationCount: 3,
  notifications: [
    { icon: 'clock', variant: 'warning', text: '2 hợp đồng sắp hết hạn', time: '5 phút trước' },
    { icon: 'person-plus', variant: 'info', text: 'Khách hàng mới đăng ký', time: '1 giờ trước' },
    { icon: 'cash-stack', variant: 'success', text: 'Thanh toán thành công', time: '2 giờ trước' }
  ],

  // Navigation menu
  menuItems: [
    { key: 'dashboard', label: 'Tổng quan', icon: 'house-door', to: '/' }
  ],

  // Page titles mapping
  pageTitles: {
    '/': 'Tổng quan',
    '/test': 'Test Page',
    '/profile': 'Hồ sơ cá nhân'
  },

  // Mobile detection
  isMobile: false
})

export const mutations = {
  // Sidebar mutations
  SET_SIDEBAR_OPEN(state, value) {
    state.sidebarOpen = value
  },
  TOGGLE_SIDEBAR(state) {
    state.sidebarOpen = !state.sidebarOpen
  },

  // Menu group mutations
  SET_OPEN_GROUP(state, key) {
    state.openGroup = key
  },
  TOGGLE_GROUP(state, key) {
    state.openGroup = state.openGroup === key ? null : key
  },
  CLOSE_ALL_GROUPS(state) {
    state.openGroup = null
  },

  // Notification mutations
  SET_NOTIFICATION_COUNT(state, count) {
    state.notificationCount = count
  },
  ADD_NOTIFICATION(state, notification) {
    state.notifications.unshift(notification)
    state.notificationCount++
  },
  REMOVE_NOTIFICATION(state, index) {
    state.notifications.splice(index, 1)
    state.notificationCount = Math.max(0, state.notificationCount - 1)
  },
  CLEAR_NOTIFICATIONS(state) {
    state.notifications = []
    state.notificationCount = 0
  },

  // Mobile mutations
  SET_MOBILE(state, value) {
    state.isMobile = value
  },

  // Page titles mutations
  SET_PAGE_TITLE(state, { path, title }) {
    state.pageTitles[path] = title
  }
}

export const actions = {
  // Sidebar actions
  toggleSidebar({ commit, state }) {
    commit('TOGGLE_SIDEBAR')
    if (!state.sidebarOpen) {
      commit('CLOSE_ALL_GROUPS')
    }
  },

  openSidebar({ commit }) {
    commit('SET_SIDEBAR_OPEN', true)
  },

  closeSidebar({ commit }) {
    commit('SET_SIDEBAR_OPEN', false)
    commit('CLOSE_ALL_GROUPS')
  },

  // Menu group actions
  toggleGroup({ commit, state }, key) {
    if (!state.sidebarOpen) {
      commit('SET_SIDEBAR_OPEN', true)
      setTimeout(() => {
        commit('SET_OPEN_GROUP', key)
      }, 0)
    } else {
      commit('TOGGLE_GROUP', key)
    }
  },

  // Mobile actions
  checkMobile({ commit, state }) {
    const isMobile = window.innerWidth < 992
    commit('SET_MOBILE', isMobile)
    if (isMobile && state.sidebarOpen) {
      commit('SET_SIDEBAR_OPEN', false)
    }
  },

  handleResize({ commit, state }) {
    const wasMobile = state.isMobile
    const isMobile = window.innerWidth < 992
    commit('SET_MOBILE', isMobile)

    if (!wasMobile && isMobile) {
      commit('SET_SIDEBAR_OPEN', false)
    } else if (wasMobile && !isMobile) {
      commit('SET_SIDEBAR_OPEN', true)
    }
  },

  // Notification actions
  addNotification({ commit }, notification) {
    commit('ADD_NOTIFICATION', {
      ...notification,
      time: notification.time || 'Vừa xong'
    })
  },

  clearNotifications({ commit }) {
    commit('CLEAR_NOTIFICATIONS')
  }
}

export const getters = {
  // Get page title by path
  getPageTitle: (state) => (path) => {
    return state.pageTitles[path] || null
  },

  // Check if a menu item is active
  isMenuActive: (state) => (path) => {
    return (currentPath) => {
      return currentPath === path || currentPath.startsWith(path + '/')
    }
  },

  // Get notifications with formatted time
  formattedNotifications: (state) => {
    return state.notifications
  },

  // Get active menu item
  activeMenuItem: (state) => (currentPath) => {
    for (const item of state.menuItems) {
      if (item.to === currentPath) return item
      if (item.children) {
        const child = item.children.find(c => c.to === currentPath)
        if (child) return { parent: item, child }
      }
    }
    return null
  }
}
