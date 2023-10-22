//gets the correct option for the item, example "title1"
export const getItemOption = (
  options: BlockOptions,
  key: string,
  index: number
) => {
  return options[`${key}${index + 1}` as keyof BlockOptions];
};

export const determineSingleContentType = (
  content: BlockContent
): BlockContentType | undefined => {
  if (content?.product) {
    return "product";
  } else if (content?.promotion) {
    return "promotion";
  } else if (content?.campaign) {
    return "campaign";
  } else if (content?.brand) {
    return "brand";
  } else if (content?.image) {
    return "image";
  } else if (content?.icon) {
    return "icon";
  }
};

export const concatBlockContent = (content: BlockContent): any => {
  const joinedContent: any = [];

  if ((content?.image as Image[])?.length > 0) {
    (content?.image as Image[])?.forEach((e: any) =>
      joinedContent.push({ image: e })
    );
  }
  if ((content?.promotion as Promotion[])?.length > 0) {
    (content?.promotion as Promotion[]).forEach((e: any) =>
      joinedContent.push({ promotion: e })
    );
  }
  if ((content?.campaign as Campaign[])?.length > 0) {
    (content?.campaign as Campaign[])?.forEach((e: any) =>
      joinedContent.push({ campaign: e })
    );
  }
  if ((content?.brand as Brand[])?.length > 0) {
    (content?.brand as Brand[])?.forEach((e: any) =>
      joinedContent.push({ brand: e })
    );
  }
  if ((content?.icon as string[])?.length > 0) {
    (content?.icon as string[])?.forEach((e: any) =>
      joinedContent.push({ icon: e })
    );
  }

  return joinedContent;
};

export const buildContentImageFromContent = (
  contentType: BlockContentType,
  contentData: BlockContent,
  tileOrBanner: "tileImage" | "bannerImage",
  itemLink: string
) => {
  let name: string = "tileImage";
  let link: string = " ";
  let imageSrc: string = " ";
  if (contentType === "promotion") {
    const promotion = contentData?.promotion as Promotion;
    name = promotion?.name || name;
    link = `/promotion/${name}`;
    imageSrc = promotion?.[tileOrBanner]?.url || imageSrc;
  } else if (contentType === "campaign") {
    const campaign = contentData?.campaign as Campaign;
    name = campaign?.name || name;
    link = `/campaign/${name}`;
    imageSrc = campaign?.[tileOrBanner]?.url || imageSrc;
  } else if (contentType === "brand") {
    const brand = contentData?.brand as Brand;
    name = brand?.name || name;
    link = `/products?brand=${name}`;
    imageSrc = brand?.image?.url || imageSrc;
  } else if (contentType === "image") {
    imageSrc = ((contentData as BlockContent)?.image as Image)?.url || imageSrc;
    name = ((contentData as BlockContent)?.image as Image)?.altText || "";

    if (itemLink) {
      link = itemLink;
    }
  }

  //if a custom links is set in the editor we over ride with it
  return { name, link, imageSrc };
};
