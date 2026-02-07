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
└── nuxt.config.js         # Config with Supabase keys
```

## Layout Conventions

### Dashboard Layout (`layouts/dashboard.vue`)

**Structure:**
- Fixed top navbar (40px height, dark theme)
- Collapsible sidebar (200px width, dark theme)
- Main content area (scrollable, light gray background)

**Key Features:**
- Toggle button (☰) to collapse/expand sidebar
- Sidebar has smooth width transition (0.3s)
- Main content fills remaining width when sidebar collapsed
- Scrollbars are styled (thin, rounded)
- Mobile: sidebar overlays as fixed panel

**Menu Configuration (in data):**
```javascript
menuItems: [
  { key: 'unique-key', label: 'Menu Name', icon: 'bootstrap-icon', to: '/path' },
  { 
    key: 'parent-key', 
    label: 'Parent Menu', 
    icon: 'bootstrap-icon',
    children: [
      { key: 'child-key', label: 'Child', icon: 'icon', to: '/path' }
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

### Standard Page Template

Based on `pages/test.vue`, every page should follow:

```vue
<template>
  <div class="page-container">
    <!-- 1. Breadcrumb -->
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
          <b-icon icon="page-icon" class="breadcrumb-icon" />
          <span>Current Page</span>
        </li>
      </ol>
    </nav>

    <!-- 2. Page Header -->
    <div class="page-header">
      <h1 class="page-title">Page Title</h1>
      <p class="page-subtitle">Page description</p>
    </div>

    <!-- 3. Content -->
    <!-- Use cards, grids, tables as needed -->
  </div>
</template>

<script>
export default {
  name: 'PageName',
  layout: 'dashboard'  // or 'auth' for auth pages
}
</script>

<style scoped>
/* Page-specific styles */
</style>
```

## Card Component Pattern

Standard card structure (from test.vue):

```vue
<div class="test-card">
  <div class="card-header-custom">
    <div class="card-header-icon bg-primary-soft">
      <b-icon icon="icon-name" variant="primary" />
    </div>
    <span class="card-header-title">Card Title</span>
    <b-badge variant="light" class="ml-auto">Optional</b-badge>
  </div>
  <div class="card-body-custom">
    <!-- Content -->
  </div>
</div>
```

**Card CSS Classes:**
- `.test-card` - Main card container
- `.card-header-custom` - Header with icon + title
- `.card-header-icon` - Icon container with soft background
- `.card-body-custom` - Body padding

**Soft Background Colors:**
- `bg-primary-soft` - Blue tint
- `bg-success-soft` - Green tint
- `bg-warning-soft` - Orange tint
- `bg-info-soft` - Light blue tint
- `bg-danger-soft` - Red tint

## Table Pattern

```vue
<div class="table-wrap">
  <table class="custom-table">
    <thead>
      <tr>
        <th>Column</th>
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

**Status Badges:**
```css
.status-active { background: #d1fae5; color: #065f46; }
.status-pending { background: #fef3c7; color: #92400e; }
.status-completed { background: #dbeafe; color: #1e40af; }
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

## CSS/Styling Guidelines

### Color Palette

**Primary Colors:**
- Primary: `#3b82f6` (blue)
- Success: `#10b981` (green)
- Warning: `#f59e0b` (orange)
- Danger: `#ef4444` (red)
- Info: `#3b82f6` (blue)

**Grayscale:**
- 50: `#f9fafb` - Lightest bg
- 100: `#f3f4f6` - Main bg
- 200: `#e5e7eb` - Borders
- 300: `#d1d5db`
- 400: `#9ca3af` - Muted text
- 500: `#6b7280` - Secondary text
- 600: `#4b5563`
- 700: `#374151` - Dark text
- 800: `#1f2937` - Navbar/Sidebar bg
- 900: `#111827` - Darkest

### Spacing Scale

- `0.25rem` (4px) - xs
- `0.5rem` (8px) - sm
- `0.75rem` (12px) - md
- `1rem` (16px) - base
- `1.5rem` (24px) - lg
- `2rem` (32px) - xl

### Border Radius

- `4px` - Small (buttons, inputs)
- `6px` - Medium (cards)
- `8px` - Large (cards, modals)
- `10px` - XL (icon containers)
- `12px` - 2XL (cards)
- `20px` - Full (pills, badges)
- `9999px` - Circle (avatars)

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
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

1. **Always use `size="sm"`** for Bootstrap components to maintain compact UI
2. **Sidebar menu items** are configured in `layouts/dashboard.vue` data
3. **Auth checks** are handled by middleware, no manual checks needed in pages
4. **Scroll behavior**: Only main-content and sidebar scroll independently
5. **Colors**: Use CSS variables or predefined classes for consistency
6. **Icons**: Use Bootstrap Icons, check https://icons.getbootstrap.com/
7. **Responsive**: Mobile-first approach, test on mobile viewport
