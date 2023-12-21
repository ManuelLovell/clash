import path from 'path'

export default {
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        subindex: path.resolve(__dirname, 'submenu/subindex.html'),
        whatsnew: path.resolve(__dirname, 'submenu/whatsnew.html'),
        dicewindow: path.resolve(__dirname, 'dicewindow.html')
      }
    }
  }
}