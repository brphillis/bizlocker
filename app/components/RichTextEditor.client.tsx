import React, { Suspense, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RichTextEditor = ({
  value,
  onChange,
  className,
}: RichTextEditorProps) => {
  const [richText, setRichText] = useState(value || "");

  const handleEditorChange = (content: string) => {
    setRichText(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactQuill
        theme="snow"
        value={richText.toString()}
        onChange={handleEditorChange}
        className={className}
      />
    </Suspense>
  );
};

export default RichTextEditor;
