import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    mode: "development",
    build: {
        minify: false,
    },
    plugins: [react()],
});
