
export default {
  /*
  ** Headers of the page
  */
  ssr: false,
  head: {
    title: 'BSS. BẢO PHƯƠNG STORE SYSTEM V0.9',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  components: true,
  plugins: [
    '~/plugins/supabase.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['nuxt-supabase', {
      //  supabaseUrl: `https://spbp.trinhminhbao.workers.dev`,
      supabaseUrl: 'https://kmnsdgaykixjfsjnajht.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttbnNkZ2F5a2l4amZzam5hamh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MzM5OTAsImV4cCI6MjA4NjAwOTk5MH0.wZfigzQzRwnPe__h5KWoG6ZMAFyE9zWUkPGRUglmlwg'
    }],
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/moment',
    '@nuxtjs/axios',
    // '@nuxtjs/sentry'

  ],


  bootstrapVue: {
    icons: true
  },
  moment: {
    plugins: [
      'moment-lunar'
    ]

  },
  router: {
    middleware: ['auth']
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isClient }) {
      if (isClient)
        config.devtool = 'eval-source-map'
      else
        config.devtool = "inline-source-map"
    }
  },
  // server: {
  //   host: "0.0.0.0"
  // }

}
