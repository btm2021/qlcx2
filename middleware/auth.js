export default async function ({ $supabase, redirect, route }) {
  // Lấy session hiện tại
  const session = $supabase.auth.session()
  
  // Các trang public không cần auth
  const publicPages = ['/login', '/register', '/forgot-password', '/reset-password']
  const isPublicPage = publicPages.includes(route.path)

  // Nếu chưa đăng nhập và truy cập trang cần auth -> redirect login
  if (!session && !isPublicPage) {
    return redirect('/login')
  }

  // Nếu đã đăng nhập và vào trang login/register -> redirect dashboard
  if (session && isPublicPage) {
    return redirect('/')
  }
}
