import { stringify } from 'querystring'


export const previewDocx = (file: { name: string, url: string }) => {
  const query = stringify({ name: file.name, file: file.url });
  const url = `${window.location.origin}${window.location.pathname}#/preview/docx?${query}`;
  const win = window.open('', '_blank');
  if (win) {
    win.location.href = url;
    if (win.document) win.document.title = file.name;
  }
}

export const previewPdf = (file: { name: string, url: string }) => {
  const win = window.open(file.url, '_blank');
  if (win?.document) win.document.title = file.name;
}
