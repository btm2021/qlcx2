export default (ctx, inject) => {
  // nuxt-supabase đã inject $supabase sẵn
  // Plugin này để thêm các helper methods
  
  const supabase = ctx.$supabase

  // Helper: Lấy user hiện tại
  const getUser = () => {
    return supabase.auth.user()
  }

  // Helper: Lấy session hiện tại
  const getSession = () => {
    return supabase.auth.session()
  }

  // Helper: Đăng nhập với email/password
  const signIn = async (email, password) => {
    const { user, session, error } = await supabase.auth.signIn({
      email,
      password
    })
    if (error) throw error
    return { user, session }
  }

  // Helper: Đăng ký
  const signUp = async (email, password, metadata = {}) => {
    const { user, session, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    if (error) throw error
    return { user, session }
  }

  // Helper: Đăng xuất
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // Helper: Reset password
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.api.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  // Helper: Update user
  const updateUser = async (attributes) => {
    const { user, error } = await supabase.auth.update(attributes)
    if (error) throw error
    return user
  }

  // Inject các helper
  inject('auth', {
    getUser,
    getSession,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateUser
  })
}
