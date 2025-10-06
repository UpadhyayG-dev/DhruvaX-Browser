export function registerElectronDownloadHook(onDownload: (url: string) => void): () => void {
  if (typeof window === 'undefined' || !window.sparsh) return () => {};
  return window.sparsh.onDownload(onDownload);
}
