import { Suspense, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RichTextInput = ({ value, onChange, className }: RichTextEditorProps) => {
  const [richText, setRichText] = useState(value || "");

  const handleEditorChange = (content: string) => {
    setRichText(content);
    if (onChange) {
      onChange(content);
    }
  };

  var tools = [
    ["bold", "italic", "underline", "strike"],
    [{ header: "1" }, { header: "2" }],
    ["size"],
    [
      {
        color: [
          "#000000",
          "#e60000",
          "#ff9900",
          "#ffff00",
          "#008a00",
          "#0066cc",
          "#9933ff",
          "#ffffff",
          "#facccc",
          "#ffebcc",
          "#ffffcc",
          "#cce8cc",
          "#cce0f5",
          "#ebd6ff",
          "#bbbbbb",
          "#f06666",
          "#ffc266",
          "#ffff66",
          "#66b966",
          "#66a3e0",
          "#c285ff",
          "#888888",
          "#a10000",
          "#b26b00",
          "#b2b200",
          "#006100",
          "#0047b2",
          "#6b24b2",
          "#444444",
          "#5c0000",
          "#663d00",
          "#666600",
          "#003700",
          "#002966",
          "#3d1466",
          "custom-color",
        ],
      },
    ],
  ];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReactQuill
        theme="snow"
        modules={{ toolbar: tools }}
        value={richText.toString()}
        defaultValue={richText.toString() || ""}
        onChange={handleEditorChange}
        className={className}
      />
    </Suspense>
  );
};

export default RichTextInput;
