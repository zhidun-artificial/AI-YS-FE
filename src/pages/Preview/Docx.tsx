import React, { useEffect } from "react";


const DocxPreview: React.FC = () => {
  useEffect(() => {
    document.querySelector('#root')?.classList.add('h-full', 'w-full', 'overflow-hidden')
  }, [])
  return (
    <div className="w-full h-full flex justify-center items-center">
      <h1>Docx Preview</h1>
    </div>
  );
}

export default DocxPreview;