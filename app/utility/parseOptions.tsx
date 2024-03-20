import {
  type HTMLReactParserOptions,
  domToReact,
  Element,
} from "html-react-parser";

export const parseOptions: HTMLReactParserOptions = {
  replace: (node) => {
    if (node instanceof Element && node.name === "p") {
      return (
        <p className="relative max-w-full px-0 max-xl:px-3">
          {domToReact(node.children, parseOptions)}
        </p>
      );
    }

    if (node instanceof Element && node.name === "ul") {
      return (
        <ul className="relative max-w-full px-0 pt-3 max-xl:px-3">
          {domToReact(node.children, parseOptions)}
        </ul>
      );
    }

    if (node instanceof Element && node.name === "h1") {
      return (
        <h2 className="relative max-w-full px-0 pb-3 text-5xl font-bold max-xl:px-3">
          {domToReact(node.children, parseOptions)}
        </h2>
      );
    }

    if (node instanceof Element && node.name === "h2") {
      return (
        <h2 className="relative max-w-full px-0 pb-3 text-3xl font-bold max-xl:px-3">
          {domToReact(node.children, parseOptions)}
        </h2>
      );
    }

    if (node instanceof Element && node.name === "h3") {
      return (
        <h2 className="relative max-w-full px-0 text-xl font-bold max-xl:px-3">
          {domToReact(node.children, parseOptions)}
        </h2>
      );
    }
  },
};
