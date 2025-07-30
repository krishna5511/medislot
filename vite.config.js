import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        book: 'book.html',
        login: 'login.html',
        user: 'user.html',
        doctors: 'doctors.html',
        appointment: 'appointment.html',
        contact: 'contact.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});