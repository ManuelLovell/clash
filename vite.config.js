// vite.config.js
const { resolve } = require('path')

module.exports = {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        submenu: resolve(__dirname, 'submenu/index.html')
      }
    }
  }
}