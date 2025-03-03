import { message } from 'antd';
import { stringify } from 'querystring'

/**
 * 检查URL是否为PDF文件
 * @param url 需要检查的URL
 * @returns 如果URL以.pdf结尾则返回true
 */
export const isPDF = (url: string) => url.endsWith('.pdf');

/**
 * 检查URL是否为Word文档
 * @param url 需要检查的URL
 * @returns 如果URL以.docx或.doc结尾则返回true
 */
export const isDocx = (url: string) => url.endsWith('.docx') || url.endsWith('.doc');

/**
 * 在新的浏览器标签页中打开 Docx 文件的预览。
 * 
 * @param file - 包含文件名称和 URL 信息的文件对象
 * @param file.name - 文档的名称（将用作浏览器标签页的标题）
 * @param file.url - 需要预览的文档的 URL
 * 
 * 该函数构建一个带有包含文件名和 URL 的查询参数的 URL，
 * 然后打开一个新的浏览器标签页指向文档预览路由。
 * 如果窗口成功打开，它将文档标题设置为文件名。
 */
export const previewDocx = (file: { fileName: string, url: string }) => {
  const query = stringify({ name: file.fileName, file: file.url });
  const url = `${window.location.origin}${window.location.pathname}#/preview/docx?${query}`;
  const win = window.open('', '_blank');
  if (win) {
    win.location.href = url;
    if (win.document) win.document.title = file.fileName;
  }
}

/**
 * 在新的浏览器标签页中直接打开PDF文件
 * @param file 包含文件名称和URL信息的文件对象
 * @param file.name 文档的名称（将用作浏览器标签页的标题）
 * @param file.url 需要预览的PDF文件的URL
 */
export const previewPdf = (file: { fileName: string, url: string }) => {
  const win = window.open(file.url, '_blank');
  if (win?.document) win.document.title = file.fileName;
}


export const previewFile = (file: { fileName: string, url: string }) => {
  if (isPDF(file.fileName)) return previewPdf(file);
  if (isDocx(file.fileName)) return previewDocx(file);
  message.error('文件类型不支持预览');
}