import {
  type HTMLReactParserOptions,
  domToReact,
  Element,
} from "html-react-parser";

export const parseOptions: HTMLReactParserOptions = {
  replace: (node) => {
    if (node instanceof Element && node.name === "p") {
      return (
        <p className="max-w-full px-3 sm:px-0">
          {domToReact(node.children, parseOptions)}
        </p>
      );
    }

    if (node instanceof Element && node.name === "h1") {
      return (
        <h2 className="max-w-full pb-6 text-5xl font-bold sm:px-0">
          {domToReact(node.children, parseOptions)}
        </h2>
      );
    }

    if (node instanceof Element && node.name === "h2") {
      return (
        <h2 className="max-w-full px-3 pb-2 text-2xl text-primary sm:px-0">
          {domToReact(node.children, parseOptions)}
        </h2>
      );
    }

    if (node instanceof Element && node.name === "h3") {
      return (
        <h2 className="max-w-full px-3 pb-2 text-xl text-primary sm:px-0">
          {domToReact(node.children, parseOptions)}
        </h2>
      );
    }
  },
};
