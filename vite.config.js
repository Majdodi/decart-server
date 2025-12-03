import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // تم حذف الـ proxy لأننا بنستخدم السيرفر الحقيقي بعد النشر
  },
});

