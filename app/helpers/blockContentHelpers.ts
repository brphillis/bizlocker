export const determineSingleContentType = (
  content: BlockContent
): BlockContentType | undefined => {
  if (content.product) {
    return "product";
  } else if (content.promotion) {
    return "promotion";
  } else if (content.campaign) {
    return "campaign";
  } else if (content.image) {
    return "image";
  }
};
