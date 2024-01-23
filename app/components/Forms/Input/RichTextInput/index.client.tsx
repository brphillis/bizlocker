import { Suspense, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ToolTip from "~/components/Indicators/ToolTip";
import type { ValidationErrors } from "~/utility/validate";

interface RichTextEditorProps {
  extendStyle?: string;
  label?: string;
  labelStyle?: string;
  name?: string;
  onChange?: (value: string) => void;
  validationErrors?: ValidationErrors;
  value?: string;
}

const RichTextInput = ({
  extendStyle,
  label,
  labelStyle,
  name,
  onChange,
  validationErrors,
  value,
}: RichTextEditorProps) => {
  const [richText, setRichText] = useState(value || "");

  const handleEditorChange = (content: string) => {
    setRichText(content);
    if (onChange) {
      onChange(content);
    }
  };

  const tools = [
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
      <div className="form-control relative mt-6 mb-3 w-full self-center">
        {label && (
          <label
            className={`label text-brand-white mb-[24px] mt-[-12px] ${labelStyle}`}
          >
            {label}
          </label>
        )}

        <div className="bg-brand-white mt-[-24px]">
          <ReactQuill
            theme="snow"
            modules={{ toolbar: tools }}
            value={richText.toString()}
            defaultValue={richText.toString() || ""}
            onChange={handleEditorChange}
            className={`bg-brand-white py-0 ${extendStyle} ${
              validationErrors && name && name in validationErrors
                ? "border border-[oklch(var(--er))]"
                : ""
            }`}
          />
        </div>

        {validationErrors && name && name in validationErrors && (
          <ToolTip tip={validationErrors[name]} iconColor="text-error" />
        )}

        <input hidden readOnly name="description" value={value} />
      </div>
    </Suspense>
  );
};

export default RichTextInput;
