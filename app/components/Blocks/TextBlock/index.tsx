import { parseOptions } from "~/utility/parseOptions";
import parse from "html-react-parser";

type Props = {
  content: string[];
};

const TextBlock = ({ content }: Props) => {
  return (
    <div className="w-full max-w-full sm:w-[1280px]">
      {parse(content[0], parseOptions)}
    </div>
  );
};

export default TextBlock;
