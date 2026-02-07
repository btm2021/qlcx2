export default async function ({ $supabase, redirect }) {
  // Middleware cho trang login/register - chỉ cho phép guest
  const session = $supabase.auth.session()
  
  // Nếu đã đăng nhập -> redirect về dashboard
  if (session) {
    return redirect('/')
  }
}
