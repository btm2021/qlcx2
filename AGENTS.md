# Agent Guidelines - Quản Lý Cầm Xe

## Project Overview

- **Framework**: Nuxt.js 2 (SSR disabled)
- **UI Library**: Bootstrap Vue 2
- **Auth**: Supabase (nuxt-supabase v1.0.8)
- **Icons**: Bootstrap Icons (via Bootstrap Vue)
- **Styling**: Custom CSS (Tailwind-inspired) + Bootstrap utilities

## Project Structure

```
├── layouts/
│   ├── dashboard.vue      # Main layout with sidebar + navbar
│   └── auth.vue           # Auth pages layout (login/register)
├── pages/
│   ├── index.vue          # Dashboard homepage
│   ├── login.vue          # Login page
│   ├── register.vue       # Register page
│   ├── forgot-password.vue
│   ├── profile.vue        # User profile
│   ├── test.vue           # Test/Example page
│   ├── contracts/         # Contract management
│   │   └── index.vue
│   ├── customers/         # Customer management
│   │   └── index.vue
│   ├── vehicles/          # Vehicle management
│   │   └── index.vue
│   ├── reports/
│   │   └── index.vue
│   └── settings/
│       └── index.vue
├── middleware/
│   ├── auth.js            # Protect routes (require login)
│   └── guest.js           # Only for non-logged in users
├── plugins/
│   └── supabase.js        # Supabase auth helpers
├── store/
│   └── ui.js              # UI state management (sidebar, menu, notifications)
└── nuxt.config.js         # Config with Supabase keys
```

## Layout Conventions

### Dashboard Layout (`layouts/dashboard.vue`)

**Structure:**
- Fixed top navbar (40px height, **white theme** with subtle border)
- Collapsible sidebar (220px expanded, 60px collapsed, **white theme**)
- Main content area (scrollable, light gray/blue background #f8fafc)
- Top bar with breadcrumb + page title (inline)
- Content box wrapper for page content

**Key Features:**
- Minimal, clean design with white background
- Toggle button to collapse/expand sidebar
- Sidebar has smooth width transition (0.25s)
- Main content fills remaining width when sidebar collapsed
- Scrollbars are styled (thin, rounded)
- Mobile: sidebar overlays as fixed panel with backdrop blur

**Design Updates (Minimal Theme):**
- Navbar: White background, subtle bottom border (#e5e7eb), height 40px
- Sidebar: White background, right border (#e5e7eb), width 60px → 220px
- Menu items: Height 36px, rounded corners (6px), blue accent for active state
- Typography: 13px labels, 12px submenu, gray-700 text
- Active state: Blue soft background (#eff6ff) with blue text (#2563eb)

**UI Configuration Store (`store/ui.js`):**
All UI state is centralized in Vuex store for better reactivity:

```javascript
// Access in components
computed: {
  ...mapState('ui', [
    'sidebarOpen',      // Boolean: sidebar expanded state
    'openGroup',        // String: currently expanded menu group key
    'notificationCount',// Number: unread notifications count
    'notifications',    // Array: notification items
    'menuItems',        // Array: sidebar navigation menu
    'pageTitles',       // Object: route -> title mapping
    'isMobile'          // Boolean: mobile viewport detection
  ])
}

// Mutations
this.$store.commit('ui/SET_SIDEBAR_OPEN', true)
this.$store.commit('ui/TOGGLE_SIDEBAR')
this.$store.commit('ui/SET_OPEN_GROUP', 'contracts')
this.$store.commit('ui/SET_MOBILE', true)

// Actions
this.$store.dispatch('ui/toggleSidebar')
this.$store.dispatch('ui/toggleGroup', 'contracts')
this.$store.dispatch('ui/checkMobile')
```

**Menu Configuration (in store/ui.js):**
```javascript
// File: store/ui.js
menuItems: [
  { key: 'unique-key', label: 'Menu Name', icon: 'bootstrap-icon', to: '/path' },
  { 
    key: 'parent-key', 
    label: 'Parent Menu', 
    icon: 'bootstrap-icon',
    children: [
      { key: 'child-key', label: 'Child', to: '/path' }
    ]
  }
]
```

### Auth Layout (`layouts/auth.vue`)

- Centered card design
- Gradient background
- No sidebar/navbar
- Only for login/register pages

## Page Structure Conventions

### Standard Page Template (Simplified)

**Layout (`layouts/dashboard.vue`) đã tự động xử lý:**
- ✅ Top Bar với Breadcrumb
- ✅ Page Title  
- ✅ Content Box wrapper

**Các page CHỈ CẦN viết nội dung thuần túy:**

```vue
<template>
  <!-- Your content here - NO wrapper needed! -->
  <div class="cards-grid">
    <div class="card">...</div>
  </div>
</template>

<script>
export default {
  name: 'PageName',
  layout: 'dashboard'
}
</script>

<style scoped>
/* Page-specific styles only */
</style>
```

### Page Title Configuration

Layout tự động lấy title từ (theo thứ tự ưu tiên):

1. **Route meta** (khuyến nghị):
```javascript
// nuxt.config.js or page component
export default {
  meta: {
    title: 'Tên trang'
  }
}
```

2. **Page titles mapping** (trong layout):
```javascript
// layouts/dashboard.vue
data() {
  return {
    pageTitles: {
      '/contracts': 'Danh sách hợp đồng',
      '/contracts/create': 'Tạo hợp đồng mới',
      // ...add your routes here
    }
  }
}
```

3. **Auto-generated** từ URL path (fallback)

## Card Component Pattern

Standard card structure (from `pages/test.vue`):

```vue
<!-- Single Card -->
<div class="card">
  <div class="card-header">
    <div class="card-icon bg-primary-soft">
      <b-icon icon="icon-name" variant="primary" />
    </div>
    <span class="card-title">Card Title</span>
    <b-badge variant="light" class="ml-auto count-badge">Count</b-badge>
  </div>
  <div class="card-body">
    <!-- Content -->
  </div>
</div>

<!-- Cards Grid -->
<div class="cards-grid">
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

**Note:** All card styles are loaded globally from `assets/css/components.css`. No need to copy CSS to each page.

## Global CSS Components

All common styles are defined in `assets/css/components.css` and automatically loaded.

**Available global classes:**
- `.cards-grid` - Grid layout for cards
- `.card`, `.card-header`, `.card-body` - Card structure
- `.card-icon` with `.bg-{variant}-soft` - Icon backgrounds
- `.list-body`, `.list-item`, `.list-bullet`, `.list-text`, `.list-tag` - List items
- `.mini-grid`, `.mini-item` - Mini grid layout
- `.table-card`, `.table-container`, `.data-table` - Tables
- `.status-pill` with `.status-active/pending/completed` - Status badges
- `.btn-action` - Action buttons
- `.count-badge` - Badge in card header
- Utilities: `.ml-auto`, `.fw-medium`, `.text-right`

## List Pattern

For list items inside cards:

```vue
<div class="card">
  <div class="card-header">
    <div class="card-icon bg-warning-soft">
      <b-icon icon="list-ul" variant="warning" />
    </div>
    <span class="card-title">List Title</span>
    <b-badge variant="light" class="count-badge">20</b-badge>
  </div>
  <div class="card-body list-body">
    <div v-for="i in 5" :key="i" class="list-item">
      <div class="list-bullet" />
      <span class="list-text">Item số {{ i }}</span>
      <b-badge variant="secondary" class="list-tag">#{{ i }}</b-badge>
    </div>
  </div>
</div>
```

## Table Pattern

```vue
<div class="card table-card">
  <div class="card-header">
    <div class="card-icon bg-danger-soft">
      <b-icon icon="table" variant="danger" />
    </div>
    <span class="card-title">Table Title</span>
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
            <td>Item {{ i }}</td>
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
```

**Note:** All table, status pills, and action button styles are loaded globally from `assets/css/components.css`.

## Store (Vuex)

### UI Store (`store/ui.js`)

Centralized state management for dashboard UI components.

**State:**
```javascript
state: {
  sidebarOpen: true,           // Sidebar expanded/collapsed
  openGroup: null,             // Currently expanded menu group
  notificationCount: 3,        // Unread notifications count
  notifications: [...],        // Array of notification objects
  menuItems: [...],            // Sidebar navigation menu
  pageTitles: {...},           // Route -> title mapping
  isMobile: false              // Mobile viewport flag
}
```

**Mutations:**
```javascript
// Sidebar
SET_SIDEBAR_OPEN(state, boolean)
TOGGLE_SIDEBAR(state)

// Menu groups
SET_OPEN_GROUP(state, key)
TOGGLE_GROUP(state, key)
CLOSE_ALL_GROUPS(state)

// Notifications
SET_NOTIFICATION_COUNT(state, count)
ADD_NOTIFICATION(state, notification)
REMOVE_NOTIFICATION(state, index)
CLEAR_NOTIFICATIONS(state)

// Mobile
SET_MOBILE(state, boolean)
```

**Actions:**
```javascript
toggleSidebar()       // Toggle sidebar + close groups if collapsed
openSidebar()         // Open sidebar
closeSidebar()        // Close sidebar + close groups
toggleGroup(key)      // Toggle menu group (opens sidebar if needed)
checkMobile()         // Check viewport and update mobile state
handleResize()        // Handle window resize
addNotification(notification)  // Add new notification
clearNotifications()  // Clear all notifications
```

**Getters:**
```javascript
getPageTitle(path)    // Get page title by route path
isMenuActive(path)    // Check if menu item is active
activeMenuItem(currentPath)  // Get active menu item object
formattedNotifications       // Get formatted notifications array
```

**Usage Examples:**

**1. Truy cập state từ bất kỳ component nào:**
```javascript
// Trong template
<template>
  <div v-if="$store.state.ui.sidebarOpen">Sidebar đang mở</div>
  <span>{{ $store.state.ui.notificationCount }} thông báo</span>
</template>

// Trong script
export default {
  methods: {
    checkSidebar() {
      return this.$store.state.ui.sidebarOpen
    }
  }
}
```

**2. Sử dụng mapState (khuyến nghị):**
```javascript
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('ui', [
      'sidebarOpen',
      'menuItems', 
      'notifications',
      'notificationCount'
    ])
  },
  methods: {
    ...mapMutations('ui', ['SET_SIDEBAR_OPEN']),
    ...mapActions('ui', ['toggleSidebar', 'toggleGroup', 'addNotification'])
  }
}
```

**3. Ví dụ thực tế - Toggle sidebar từ button:**
```vue
<template>
  <button @click="toggleSidebar">
    {{ sidebarOpen ? 'Đóng' : 'Mở' }} sidebar
  </button>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState('ui', ['sidebarOpen'])
  },
  methods: {
    ...mapActions('ui', ['toggleSidebar'])
  }
}
</script>
```

**4. Ví dụ - Thêm thông báo mới:**
```javascript
// Khi có sự kiện thành công
this.$store.dispatch('ui/addNotification', {
  icon: 'check-circle',
  variant: 'success',
  text: 'Hợp đồng đã được tạo thành công!'
})

// Hoặc dùng mapActions
methods: {
  ...mapActions('ui', ['addNotification']),
  
  async createContract() {
    try {
      await api.createContract(data)
      this.addNotification({
        icon: 'check',
        variant: 'success', 
        text: 'Tạo hợp đồng thành công!'
      })
    } catch (error) {
      this.addNotification({
        icon: 'exclamation',
        variant: 'danger',
        text: 'Có lỗi xảy ra!'
      })
    }
  }
}
```

**5. Ví dụ - Mở menu group programmatically:**
```javascript
// Mở group "contracts" khi vào trang hợp đồng
mounted() {
  this.$store.dispatch('ui/toggleGroup', 'contracts')
}
```

**6. Truy cập getters:**
```javascript
// Lấy tiêu đề trang hiện tại
const title = this.$store.getters['ui/getPageTitle']('/contracts')

// Hoặc dùng mapGetters
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('ui', ['getPageTitle', 'activeMenuItem'])
  }
}
```

## Authentication

### Supabase API (nuxt-supabase v1.0.8)

```javascript
// Get current user
const user = this.$supabase.auth.user()

// Get session
const session = this.$supabase.auth.session()

// Sign in
const { user, session, error } = await this.$supabase.auth.signIn({
  email, password
})

// Sign up
const { user, error } = await this.$supabase.auth.signUp({
  email, password, options: { data: { full_name: name } }
})

// Sign out
await this.$supabase.auth.signOut()

// Update user
const { user, error } = await this.$supabase.auth.update({
  data: { full_name: name }
})
```

### Middleware Usage

```javascript
// For protected pages (require login)
export default {
  middleware: ['auth']
}

// For guest-only pages (login/register)
export default {
  middleware: ['guest']
}
```

## Design System (CSS Themes)

### Overview

Tất cả styles được chuẩn hóa trong `assets/css/themes.css` sử dụng **CSS Variables**.  
Không hard-code màu sắc, spacing, hoặc typography - luôn sử dụng CSS variables.

### CSS Variables

#### Colors
```css
/* Primary */
var(--color-primary)         /* #3b82f6 */
var(--color-primary-dark)    /* #2563eb */
var(--color-primary-soft)    /* #eff6ff */

/* Status */
var(--color-success)         /* #10b981 */
var(--color-warning)         /* #f59e0b */
var(--color-danger)          /* #ef4444 */
var(--color-info)            /* #3b82f6 */

/* Grayscale */
var(--color-gray-50)         /* #f9fafb */
var(--color-gray-100)        /* #f3f4f6 */
var(--color-gray-200)        /* #e5e7eb */
var(--color-gray-300)        /* #d1d5db */
var(--color-gray-400)        /* #9ca3af */
var(--color-gray-500)        /* #6b7280 */
var(--color-gray-600)        /* #4b5563 */
var(--color-gray-700)        /* #374151 */
var(--color-gray-800)        /* #1f2937 */
var(--color-gray-900)        /* #111827 */
```

#### Typography
```css
var(--font-size-xs)          /* 10px */
var(--font-size-sm)          /* 12px */
var(--font-size-base)        /* 13px */
var(--font-size-md)          /* 14px */
var(--font-size-lg)          /* 16px */

var(--font-weight-normal)    /* 400 */
var(--font-weight-medium)    /* 500 */
var(--font-weight-semibold)  /* 600 */
var(--font-weight-bold)      /* 700 */
```

#### Spacing
```css
var(--space-1)               /* 4px */
var(--space-2)               /* 8px */
var(--space-3)               /* 10px */
var(--space-4)               /* 12px */
var(--space-5)               /* 16px */
var(--space-6)               /* 20px */
var(--space-7)               /* 24px */
```

#### Border Radius
```css
var(--radius-sm)             /* 4px */
var(--radius-md)             /* 6px */
var(--radius-lg)             /* 8px */
var(--radius-full)           /* 9999px */
```

#### Shadows
```css
var(--shadow-sm)             /* 0 1px 2px rgba(0,0,0,0.05) */
var(--shadow-md)             /* 0 1px 3px rgba(0,0,0,0.1) */
var(--shadow-lg)             /* 0 4px 6px rgba(0,0,0,0.1) */
```

### Component Classes

#### Cards
```html
<div class="card">
  <div class="card-header">
    <div class="card-icon bg-primary-soft">
      <b-icon icon="file-text" variant="primary" />
    </div>
    <span class="card-title">Tiêu đề</span>
  </div>
  <div class="card-body">
    Nội dung card
  </div>
</div>
```

#### Buttons
```html
<!-- Primary -->
<button class="btn btn-primary">Click me</button>

<!-- Secondary -->
<button class="btn btn-secondary">Cancel</button>

<!-- Outline -->
<button class="btn btn-outline">Outline</button>

<!-- Action (Icon only) -->
<button class="btn-action">
  <b-icon icon="three-dots-vertical" />
</button>

<!-- Sizes -->
<button class="btn btn-primary btn-sm">Small</button>
<button class="btn btn-primary btn-lg">Large</button>
```

#### Badges & Status
```html
<!-- Badge variants -->
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>

<!-- Status pills -->
<span class="status-pill status-active">Active</span>
<span class="status-pill status-pending">Pending</span>
<span class="status-pill status-completed">Completed</span>
<span class="status-pill status-cancelled">Cancelled</span>
```

#### Forms
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input class="form-control" placeholder="Placeholder" />
</div>

<!-- Sizes -->
<input class="form-control form-control-sm" />
<input class="form-control form-control-lg" />
```

#### Tables
```html
<div class="table-container">
  <table class="data-table">
    <thead>
      <tr>
        <th>Header</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Icon Backgrounds
```html
<div class="card-icon bg-primary-soft">...</div>
<div class="card-icon bg-success-soft">...</div>
<div class="card-icon bg-warning-soft">...</div>
<div class="card-icon bg-danger-soft">...</div>
<div class="card-icon bg-info-soft">...</div>
```

### Custom Styles trong Page/Component

Khi viết CSS scoped cho page/component, **luôn sử dụng CSS variables**:

```vue
<style scoped>
.custom-element {
  /* ✅ Tốt - Sử dụng CSS variables */
  color: var(--color-gray-700);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  
  /* ❌ Không tốt - Hard code */
  color: #374151;
  padding: 12px;
  border-radius: 6px;
  background: #eff6ff;
}
</style>
```

### Utility Classes

```html
<!-- Text -->
<span class="text-muted">Muted text</span>
<span class="text-primary">Primary text</span>
<span class="font-medium">Medium weight</span>
<span class="font-semibold">Semibold weight</span>

<!-- Spacing -->
<div class="ml-auto">Margin left auto</div>
<div class="mx-auto">Margin x auto</div>

<!-- Flex -->
<div class="d-flex items-center gap-4">
  <span>Item 1</span>
  <span>Item 2</span>
</div>

<!-- Display -->
<div class="d-none d-lg-block">Hidden on mobile</div>
<div class="d-lg-none">Visible only on mobile</div>

<!-- Borders -->
<div class="border rounded-md">Bordered box</div>
<div class="rounded-full">Circle</div>

<!-- Shadows -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
```

## Bootstrap Vue Components

### Common Components

```vue
<!-- Buttons -->
<b-button variant="primary" size="sm">Small</b-button>
<b-button variant="outline-secondary">Outline</b-button>

<!-- Icons -->
<b-icon icon="house-door" />
<b-icon icon="plus" class="mr-1" />

<!-- Badges -->
<b-badge variant="success">Active</b-badge>
<b-badge variant="light" class="ml-auto">Count</b-badge>

<!-- Cards -->
<b-card header="Title" class="shadow-sm border-0">
  Content
</b-card>

<!-- Tables -->
<b-table :items="items" :fields="fields" small hover />

<!-- Grid -->
<b-row>
  <b-col cols="12" md="6" lg="3">Content</b-col>
</b-row>
```

### Form Components

```vue
<b-form-input v-model="value" size="sm" placeholder="Hint" />
<b-form-select v-model="value" size="sm" :options="options" />
<b-form-textarea v-model="value" size="sm" rows="3" />
<b-checkbox v-model="checked">Label</b-checkbox>
```

## Responsive Breakpoints

- **sm**: < 576px
- **md**: < 768px
- **lg**: < 992px
- **xl**: < 1200px
- **xxl**: ≥ 1200px

### Common Patterns

```css
/* Grid columns */
<b-col cols="12" md="6" lg="3">
  Mobile: full, Tablet: half, Desktop: quarter
</b-col>

/* Hide on mobile */
<div class="d-none d-md-block">
  Hidden on mobile, visible on md+
</div>

/* Show only on mobile */
<div class="d-md-none">
  Only visible on mobile
</div>
```

## Supabase Database Tables

### Expected Tables

**contracts**
- id, contract_code, customer_id, vehicle_id
- loan_amount, interest_rate, start_date, end_date
- status (active/expired/closed/pending)
- created_at, updated_at

**customers**
- id, full_name, phone, id_card, address
- created_at

**vehicles**
- id, license_plate, brand, model, color, year
- status (active/sold/pending)
- created_at

## File Naming Conventions

- **Components**: PascalCase (e.g., `ContractCard.vue`)
- **Pages**: kebab-case (e.g., `create-contract.vue`)
- **Layouts**: kebab-case (e.g., `dashboard.vue`)
- **Middleware**: kebab-case (e.g., `auth.js`)

## Code Style

### Vue Options Order

```javascript
export default {
  name: 'ComponentName',
  layout: 'dashboard',
  middleware: ['auth'],
  
  components: {},
  
  data() {
    return {}
  },
  
  computed: {},
  
  async mounted() {},
  
  methods: {}
}
```

### Async/Await Pattern

```javascript
async fetchData() {
  this.loading = true
  try {
    const { data, error } = await this.$supabase
      .from('table')
      .select('*')
    
    if (error) throw error
    
    this.items = data || []
  } catch (error) {
    console.error('Error:', error)
  } finally {
    this.loading = false
  }
}
```

## Common Utilities

### Money Formatting

```javascript
formatMoney(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount || 0)
}

formatMoneyCompact(amount) {
  const num = amount || 0
  if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'T'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'tr'
  if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
  return num.toString()
}
```

### Date Formatting

```javascript
formatDate(date) {
  if (!date) return '-'
  return this.$moment(date).format('DD/MM/YYYY')
}

formatDateShort(date) {
  if (!date) return '-'
  return this.$moment(date).format('DD/MM')
}
```

## Development Commands

```bash
# Install dependencies
npm install
# or
pnpm install

# Run dev server
npm run dev
# or
pnpm dev

# Build for production
npm run build
```

## Notes for Future Development

### Layout Handles Everything

The `layouts/dashboard.vue` now automatically provides:
- ✅ Top navbar with toggle, notifications, user menu
- ✅ Sidebar with navigation
- ✅ **Top bar with breadcrumb + page title**
- ✅ **Content box wrapper**

**Pages ONLY need to write content - no wrappers needed!**

### Creating New Pages

**Step 1: Create minimal Vue file**
```vue
<template>
  <!-- Your content here - cards, tables, forms, etc. -->
  <div class="cards-grid">
    <div class="card">...</div>
  </div>
</template>

<script>
export default {
  name: 'PageName',
  layout: 'dashboard'
}
</script>

<style scoped>
/* Page-specific styles only */
</style>
```

**Step 2: Add page title (choose one)**

Option A - Route meta (recommended):
```javascript
export default {
  name: 'ContractsPage',
  layout: 'dashboard',
  meta: {
    title: 'Danh sách hợp đồng'
  }
}
```

Option B - Update store mapping:
```javascript
// In store/ui.js
pageTitles: {
  '/your-route': 'Your Page Title',
  // ...
}
```

### UI Store Usage

**Thay đổi UI state từ bất kỳ component/page:**

```javascript
// Toggle sidebar
this.$store.dispatch('ui/toggleSidebar')

// Mở menu group (ví dụ: contracts)
this.$store.dispatch('ui/toggleGroup', 'contracts')

// Thêm thông báo
this.$store.dispatch('ui/addNotification', {
  icon: 'check',
  variant: 'success',
  text: 'Thao tác thành công!'
})

// Hoặc dùng mapActions
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('ui', ['toggleSidebar', 'addNotification'])
  }
}
```

**Lưu ý:** Không thay đổi state trực tiếp, luôn dùng mutations/actions.

### Global CSS Components

All common styles in `assets/css/components.css`:
- Cards: `.card`, `.card-header`, `.card-body`, `.cards-grid`
- Lists: `.list-body`, `.list-item`, `.list-bullet`, `.list-text`
- Tables: `.table-card`, `.data-table`, `.table-container`
- Badges: `.status-pill`, `.status-active`, `.status-pending`, `.status-completed`
- Buttons: `.btn-action`, `.count-badge`
- Utilities: `.ml-auto`, `.fw-medium`, `.text-right`

### Design System Summary

**Colors:**
- Borders: `#e5e7eb` (main), `#f3f4f6` (subtle)
- Backgrounds: `#ffffff` (card), `#fafafa` (header), `#f9fafb` (table header)
- Text: `#1f2937` (heading), `#374151` (primary), `#4b5563` (body)
- Soft: `#eff6ff` (primary), `#ecfdf5` (success), `#fffbeb` (warning)

**Border Radius:**
- Cards: `6px` | Buttons: `4px` | Top Bar: `6px` | Content Box: `8px`

**Typography:**
- Breadcrumb: `12px` | Card Title: `14px` | Body: `13px` | Status: `11px`

### Guidelines

1. **Bootstrap components**: Always use `size="sm"`
2. **Sidebar menu**: Edit in `store/ui.js` (`menuItems` array)
3. **Page titles**: Edit in `store/ui.js` (`pageTitles` object) hoặc dùng route meta
4. **Auth**: Handled by middleware, no manual checks
5. **Icons**: Bootstrap Icons - https://icons.getbootstrap.com/
6. **UI State**: Use `store/ui.js` - never modify UI state directly, use mutations/actions

#### Design System Guidelines

7. **CSS Variables**: Luôn sử dụng CSS variables từ `assets/css/themes.css`:
   ```css
   /* ✅ Tốt */
   color: var(--color-gray-700);
   padding: var(--space-4);
   
   /* ❌ Không tốt */
   color: #374151;
   padding: 12px;
   ```

8. **Component Classes**: Sử dụng classes có sẵn:
   ```html
   <div class="card">
   <button class="btn btn-primary">
   <span class="badge badge-success">
   <table class="data-table">
   ```

9. **Custom Styles**: Khi cần style riêng, extend từ component classes và dùng CSS variables:
   ```vue
   <style scoped>
   .my-custom-card {
     /* Kế thừa từ .card */
     composes: card;
     /* Thêm style riêng */
     border-left: 3px solid var(--color-primary);
   }
   </style>
   ```

10. **New Components**: Nếu component được dùng ở nhiều nơi, thêm vào `assets/css/themes.css`. Nếu chỉ dùng trong 1 page, dùng scoped styles.
