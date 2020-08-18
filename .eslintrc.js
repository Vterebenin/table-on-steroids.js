module.exports = {
  // Specifies the ESLint parser
  root: true,

  env: {
    node: true
  },

  extends: [
    'standard',
    'plugin:vue/vue3-recommended',
    'plugin:vue/essential',
    '@vue/standard'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
