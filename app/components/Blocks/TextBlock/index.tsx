import parse, {
  type HTMLReactParserOptions,
  domToReact,
  Element,
} from "html-react-parser";

type Props = {
  content: string[];
};

const TextBlock = ({ content }: Props) => {
  const options: HTMLReactParserOptions = {
    replace: (node) => {
      if (node instanceof Element && node.name === "p") {
        return (
          <p className="max-w-full px-3 sm:px-0">
            {domToReact(node.children, options)}
          </p>
        );
      }

      if (node instanceof Element && node.name === "h1") {
        return (
          <h2 className="max-w-full px-3 pb-2 text-4xl text-primary sm:px-0">
            {domToReact(node.children, options)}
          </h2>
        );
      }

      if (node instanceof Element && node.name === "h2") {
        return (
          <h2 className="max-w-full px-3 pb-2 text-2xl text-primary sm:px-0">
            {domToReact(node.children, options)}
          </h2>
        );
      }

      if (node instanceof Element && node.name === "h3") {
        return (
          <h2 className="max-w-full px-3 pb-2 text-xl text-primary sm:px-0">
            {domToReact(node.children, options)}
          </h2>
        );
      }
    },
  };

  return (
    <div className="w-full max-w-full sm:w-[1280px]">
      {parse(content[0], options)}
    </div>
  );
};

export default TextBlock;
