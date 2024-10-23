import React, { useEffect, useRef } from 'react';

const CKEditorContent = ({ content }) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const images = contentRef.current.getElementsByTagName('img');
      Array.from(images).forEach(img => {
        const aspectRatio = img.getAttribute('style')?.match(/aspect-ratio:([\d/.]+)/);
        if (aspectRatio) {
          img.style.aspectRatio = aspectRatio[1];
        }
      });
    }
  }, [content]);

  return (
    <div 
      ref={contentRef}
      className="ck-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default CKEditorContent;