export default function ({ redirect, route }) {
  // Check custom auth in localStorage
  let user = null
  if (process.client) {
    user = localStorage.getItem('auth_user')
  }

  // List of public pages that don't need authentication
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPage = publicPages.some(path => route.path.startsWith(path))

  // If not logged in and trying to access a restricted page
  if (!user && !isPublicPage) {
    return redirect('/login')
  }

  // If already logged in and trying to access public auth pages
  if (user && isPublicPage) {
    return redirect('/')
  }
}
