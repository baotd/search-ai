/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Thêm các biến môi trường khác bắt đầu bằng VITE_ ở đây
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}