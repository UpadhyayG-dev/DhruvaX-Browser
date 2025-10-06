/// <reference types="vite/client" />

declare global {
  interface Window {
    sparsh?: {
      onDownload: (handler: (url: string) => void) => () => void;
    }
  }
}

export {};
