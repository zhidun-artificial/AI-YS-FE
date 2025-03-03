export const downloadFile = (file: { url: string, fileName: string }) => {
  const a = document.createElement('a');
  a.href = file.url;
  a.download = file.fileName;
  a.click();
};