import { parseOptions } from "~/utility/parseOptions";
import parse from "html-react-parser";

type Props = {
  content: any;
};

const TextBlock = ({ content: contentArray }: Props) => {
  const content = contentArray[0].richText;
  return (
    <div className="w-full max-w-full py-3 sm:w-[920px]">
      {parse(content, parseOptions)}
    </div>
  );
};

export default TextBlock;
