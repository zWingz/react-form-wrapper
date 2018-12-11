export default {
  base: '/react-form-wrapper/',
  title: 'React FormWrapper Component',
  description: 'A React Component',
  dest: 'website',
  typescript: true,
  // src: './doc',
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  themeConfig: {
    mode: 'light'
  },
  hashRouter: true,
  codeSandbox: false
}
