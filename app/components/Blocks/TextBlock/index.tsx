import { parseOptions } from "~/utility/parseOptions";
import parse from "html-react-parser";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const TextBlock = ({ content, options: optionsArray }: Props) => {
  const { richText } = content || {};
  return (
    <>
      {richText && (
        <div className="w-full max-w-full py-3 sm:w-[920px]">
          {parse(richText, parseOptions)}
        </div>
      )}
    </>
  );
};

export default TextBlock;
