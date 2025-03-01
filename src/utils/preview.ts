import { stringify } from 'querystring'


export const previewDocx = (file: { name: string, url: string }) => {
  const query = stringify(file);
  const url = `/preview/docx?${query}`;
  const win = window.open(url, '_blank');
  if (win?.document) win.document.title = file.name;
}

export const previewPdf = (file: { name: string, url: string }) => {
  const win = window.open(file.url, '_blank');
  if (win?.document) win.document.title = file.name;
}
