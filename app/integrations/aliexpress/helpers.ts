import {
  filterWordsFromString,
  returnCorrectGender,
} from "~/helpers/stringHelpers";
import {
  AliExpressHubGetProduct_ResultDelivery,
  AliExpressHubProduct_ResultItem,
  AliExpressHubProduct_ResultItem_Sku_Base,
  AliExpress_Product,
  AliExpress_ProductVariant,
} from "./types";
import { CartDimensions } from "~/helpers/cartHelpers";
import { NewProductVariant } from "~/modules/Admin/Upsert/ProductUpsert/ProductVariantUpsert";
import { addPercentage } from "~/helpers/numberHelpers";

const findAliExpressVariantSize = (
  itemSearching: AliExpressHubProduct_ResultItem,
  sizeCode: string,
): string | undefined => {
  const sizeObjectArray = itemSearching.sku.props.find(
    (e) => e.name.includes("Size") || e.name.includes("Length"),
  );

  if (sizeObjectArray) {
    const sizeToReturn = sizeObjectArray.values.find(
      (c) => c.vid.toString() == sizeCode,
    )?.name;

    if (sizeToReturn) {
      return sizeToReturn.toLocaleUpperCase();
    }
  }
};

const findAliExpressVariantColor = (
  itemSearching: AliExpressHubProduct_ResultItem,
  colorCode: string,
): string | undefined => {
  const colorObjectArray = itemSearching.sku.props.find((e) =>
    e.name.includes("Color"),
  );

  if (colorObjectArray) {
    const colorToReturn = colorObjectArray.values
      .find((c) => c.vid.toString() == colorCode)
      ?.name.toLocaleUpperCase();

    if (colorToReturn) {
      return colorToReturn;
    }
  }
};

export const getAliExpresProductShippingDimensions = (
  aliexpressDeliveryDetails: AliExpressHubGetProduct_ResultDelivery,
): CartDimensions => {
  const packageDetails = aliexpressDeliveryDetails?.packageDetail;
  return {
    height: packageDetails?.height,
    width: packageDetails?.width,
    length: packageDetails?.length,
    weight: packageDetails?.weight,
    fragile: false,
  };
};

export const getAliExpressProductVariants = (
  item: AliExpressHubProduct_ResultItem,
): AliExpress_ProductVariant[] => {
  return item.sku.base
    .map((variant: AliExpressHubProduct_ResultItem_Sku_Base) => {
      const propMapParts = variant.propMap.split(";");
      const color = propMapParts[0].split(":")[1] || "";
      const size = propMapParts[1].split(":")[1] || "";

      return {
        sku: variant.skuId,
        price: variant.price,
        color:
          findAliExpressVariantColor(item, color) &&
          filterWordsFromString(findAliExpressVariantColor(item, color)!),
        size: findAliExpressVariantSize(item, size),
        quantity: Math.ceil(variant.quantity / 2),
      };
    })
    .sort((a, b) => b.quantity - a.quantity);
};

export const getAliExpressProductDetails = (
  item: AliExpressHubProduct_ResultItem,
): AliExpress_Product => {
  const product = {
    name: item.title,
    images: item.images,
    dropshipURL: item.itemUrl,
    dropshipSKU: item.itemId,
    isActive: true,
    sales: item.sales,
    gender: item.properties.list.find((g) => g.name === "Gender")?.value
      ? returnCorrectGender(
          item.properties.list.find((g) => g.name === "Gender")!.value,
        )
      : "UNISEX",
  };

  return product;
};

export const convertAliToCmsVariantData = (
  variantData: AliExpress_ProductVariant[],
  shippingDimensions: CartDimensions,
  markupPercentage: number,
): NewProductVariant[] => {
  const convertedVariantData: NewProductVariant[] = [];

  variantData.forEach(
    ({ sku, price, color, size, quantity }: AliExpress_ProductVariant) => {
      const convertedVariant = {
        name: (color + " " + size).toLocaleUpperCase(),
        sku,
        size,
        price: addPercentage(Math.ceil(price), markupPercentage),
        salePrice: price,
        isOnSale: false,
        isFragile: false,
        stock: quantity,
        color,
        isActive: true,
        isPromoted: false,
        ...shippingDimensions,
      };

      if (quantity > 1) {
        convertedVariantData.push(convertedVariant);
      }
    },
  );

  return convertedVariantData;
};
