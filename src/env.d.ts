/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORYBOOK?: string;
  readonly VITE_USE_STUB_DATA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.css?raw' {
  const content: string;
  export default content;
}
