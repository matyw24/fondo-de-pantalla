import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This ensures process.env.API_KEY is available in your client-side code
    // when built on Netlify
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});