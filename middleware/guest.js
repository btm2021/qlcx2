export default function ({ redirect }) {
  // Check if user is already logged in via custom auth
  let user = null
  if (process.client) {
    user = localStorage.getItem('auth_user')
  }

  // If logged in, redirect away from guest-only pages
  if (user) {
    return redirect('/')
  }
}
