import type { BlockContent } from "~/models/blocks.server";
import type { BlockOptions } from "@prisma/client";
import { ClientOnly } from "~/components/Utility/ClientOnly";
import { concatBlockContent } from "~/helpers/blockContentHelpers";
import Carousel from "./Carousel/index.client";

type Props = {
  content: BlockContent;
  options: BlockOptions[];
};

const CarouselBlock = ({ content, options: ArrayOptions }: Props) => {
  const joinedContent = concatBlockContent(content);

  return (
    <ClientOnly fallback={<div id="skeleton" />}>
      {() => <Carousel options={ArrayOptions} joinedContent={joinedContent} />}
    </ClientOnly>
  );
};

export default CarouselBlock;
