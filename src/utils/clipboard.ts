const supportedClipboard = 'clipboard' in navigator;

export const copyTextToClipboard = (content: string) => {
  if (supportedClipboard) {
    navigator.clipboard.writeText(content);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = content;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};
