import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import BoxedTabs from "~/components/Tabs/BoxedTabs";
import TabContent from "~/components/Tabs/TabContent";
import BasicTable from "~/components/Tables/BasicTable";
import { Toast } from "~/components/Notifications/Toast";
import type { ValidationErrors } from "~/utility/validate";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicToggle from "~/components/Forms/Toggle/BasicToggle";
import type { Order, Product, StockLevel } from "@prisma/client";
import {
  ProductVariantWithDetails,
  ProductWithDetails,
} from "~/models/Products/types";

type Props = {
  storeId: number | null;
  product: ProductWithDetails;
};

export type NewProductVariant = {
  id?: number;
  name?: string;
  sku?: string;
  price?: number;
  salePrice?: number;
  isOnSale?: boolean;
  isFragile?: boolean;
  stock?: number;
  product?: Product;
  color?: string;
  size?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  orders?: Order[];
  isActive?: boolean;
  isPromoted?: boolean;
};

const ProductVariantUpsert = ({ storeId, product }: Props) => {
  const navigate = useNavigate();

  const [activeVariant, setActiveVariant] = useState<
    ProductVariantWithDetails | NewProductVariant | object
  >();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();
  const [variants, setVariants] = useState<
    ProductVariantWithDetails[] | null | undefined
  >(product?.variants);

  const [upsertState, setUpsertState] = useState<"edit" | "add" | undefined>();

  const tabNames = ["basic", "price", "shipping"];
  const [activeTab, setActiveTab] = useState<string>(tabNames[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleAddVariant = () => {
    const form = new FormData();

    if (typeof activeVariant === "object" && activeVariant !== null) {
      for (const key in activeVariant) {
        if (Object.prototype.hasOwnProperty.call(activeVariant, key)) {
          form.append(
            key,
            (activeVariant as Record<string, unknown>)[key] as string,
          );
        }
      }
    }

    const validate = {
      name: true,
      price: true,
      sku: true,
    };

    const { formErrors } = validateForm(form, validate);

    if (formErrors) {
      setValidationErrors(formErrors);
      return;
    }

    if (activeVariant) {
      let updatedActiveVariant = activeVariant;

      if (!("isActive" in activeVariant)) {
        updatedActiveVariant = {
          ...activeVariant,
          isActive: true,
        };
      }

      if (!("name" in activeVariant)) {
        updatedActiveVariant = {
          ...activeVariant,
          name: "BASE",
          isActive: true,
        };
      }

      if (variants) {
        setVariants([
          ...variants,
          updatedActiveVariant,
        ] as ProductVariantWithDetails[]);
      } else {
        setVariants([updatedActiveVariant] as ProductVariantWithDetails[]);
      }
    }
    setValidationErrors(undefined);
    setActiveVariant(undefined);
    setUpsertState(undefined);
  };

  const handleCancelEditVariant = () => {
    if (upsertState === "edit" && variants) {
      setVariants([...variants, activeVariant as ProductVariantWithDetails]);
    } else if (upsertState === "add" && variants) {
      setVariants([...variants]);
    }
    setValidationErrors(undefined);
    setActiveVariant(undefined);
    setUpsertState(undefined);
  };

  //   const handleDeleteVariant = (name: string | undefined) => {
  //     if (name && variants) {
  //       const indexToRemove = variants.findIndex((e) => e?.name === name);
  //       if (indexToRemove !== -1) {
  //         variants.splice(indexToRemove, 1);
  //       }
  //     }
  //     setActiveVariant(undefined);
  //   };

  const handleEditVariant = (name: string | undefined, i: number) => {
    setUpsertState("edit");

    const newActiveVariant = {
      ...variants?.[i],
      stock: Array.isArray(variants?.[i]?.stock)
        ? variants?.[i]?.stock?.find((e: StockLevel) => e.storeId === storeId)
            ?.quantity || 0
        : typeof variants?.[i]?.stock === "number"
        ? variants?.[i]?.stock
        : 0,
    };

    setActiveVariant(newActiveVariant);
    variants && setVariants(variants?.filter((e) => e?.name !== name));
  };

  const handleNewVariant = () => {
    setUpsertState("add");

    if (variants) {
      Toast("info", 3000, "Data Prefilled.");

      setActiveVariant({
        price: variants?.[0]?.price,
        salePrice: variants?.[0]?.salePrice,
        height: variants?.[0]?.height,
        weight: variants?.[0]?.weight,
        width: variants?.[0]?.width,
        length: variants?.[0]?.length,
      });
    } else {
      setActiveVariant({});
    }
  };

  const generateSku = () => {
    const nameInput =
      (document.querySelector("#ProductName") as HTMLInputElement) || "";

    const colorInput =
      (document.querySelector("#VariantColor") as HTMLSelectElement) || "";

    const sizeInput =
      (document.querySelector("#VariantSize") as HTMLInputElement) || "";

    const SKUInput = document.querySelector("#VariantSKU") as HTMLInputElement;

    const name = nameInput.value;
    const color = colorInput.value;
    const size = sizeInput.value;

    let generatedSKU: string = "";

    if (name) {
      generatedSKU += name.split(" ")[0].toUpperCase();

      if (name.split(" ")[1]) {
        generatedSKU += name.split(" ")[1].toUpperCase();
      }
    }
    if (color) {
      generatedSKU += color.toUpperCase();
    }
    if (size) {
      generatedSKU += size.toUpperCase().replace(" ", "");
    }

    generatedSKU.trim();

    SKUInput.value = generatedSKU;

    setActiveVariant({
      ...activeVariant,
      sku: generatedSKU,
    });
  };

  useEffect(() => {
    if (!product?.variants) {
      setActiveVariant({});
    }
  }, [product?.variants?.length, product]);

  return (
    <div>
      {activeVariant && (
        <div className="form-control gap-3">
          <div> Variant Editor </div>
          <BoxedTabs
            tabNames={tabNames}
            activeTab={activeTab}
            setActiveTab={handleTabChange}
          />

          <TabContent tab="basic" activeTab={activeTab} extendStyle="gap-3">
            <>
              <BasicInput
                name="name"
                label="Variant Name"
                placeholder="Name"
                extendContainerStyle="w-full"
                type="text"
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.name || "BASE"
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    name: e !== "" ? (e as string) : "BASE",
                  });
                }}
                validationErrors={validationErrors}
              />

              {/* <BasicSelect
                id="VariantColor"
                name="color"
                label="Color"
                placeholder="Color"
                extendContainerStyle="w-full"
                selections={availableColors.map((e) => {
                  return { id: e, name: e };
                })}
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.color || ""
                }
                onChange={(e) =>
                  setActiveVariant({
                    ...activeVariant,
                    color: e,
                  })
                }
              /> */}

              <BasicInput
                id="VariantSize"
                name="size"
                label="Size"
                placeholder="Size"
                extendContainerStyle="w-full"
                type="text"
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.size || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    size: e as string,
                  });
                }}
                validationErrors={validationErrors}
              />

              <div className="flex w-full items-end justify-center gap-3 justify-self-start max-md:px-0">
                <BasicInput
                  id="VariantSKU"
                  name="sku"
                  label="SKU"
                  placeholder="SKU"
                  type="text"
                  extendContainerStyle="!w-full !max-w-full"
                  // disabled={upsertState === "edit" ? true : false}

                  defaultValue={
                    (activeVariant as ProductVariantWithDetails)?.sku || ""
                  }
                  onChange={(e) => {
                    setActiveVariant({
                      ...activeVariant,
                      sku: e as string,
                    });
                  }}
                  validationErrors={validationErrors}
                />

                <button
                  type="button"
                  onClick={generateSku}
                  //   disabled={upsertState === "edit" ? true : false}
                  className="btn btn-primary flex !h-[41px] !min-h-[41px] w-[103px] items-center justify-center !rounded-sm sm:!ml-0"
                >
                  Generate
                </button>
              </div>

              <div className="flex w-full items-end justify-center gap-3 justify-self-start max-md:px-0">
                <BasicInput
                  name="remainingStock"
                  label="Remaining Stock"
                  placeholder="Remaining Stock"
                  type="number"
                  extendContainerStyle="!w-full !max-w-full"
                  defaultValue={
                    (activeVariant as ProductVariantWithDetails)?.stock || ""
                  }
                  onChange={(e) => {
                    setActiveVariant({
                      ...activeVariant,
                      stock: parseFloat(e as string),
                    });
                  }}
                  validationErrors={validationErrors}
                />

                <button
                  type="button"
                  className="btn btn-primary flex !h-[41px] !min-h-[41px] w-[103px] items-center justify-center !rounded-sm sm:!ml-0"
                  onClick={() =>
                    navigate(
                      `/admin/upsert/product/productStock?contentId=${(
                        activeVariant as ProductVariantWithDetails
                      )?.id}`,
                    )
                  }
                >
                  See Stock
                </button>
              </div>

              <div className="mt-3">
                <BasicToggle
                  label="Active"
                  defaultValue={
                    "isActive" in activeVariant
                      ? (activeVariant as ProductVariantWithDetails)?.isActive
                      : true
                  }
                  onChange={(e) => {
                    setActiveVariant({
                      ...activeVariant,
                      isActive: e.target.checked,
                    });
                  }}
                />
              </div>
            </>
          </TabContent>

          <TabContent tab="price" activeTab={activeTab} extendStyle="gap-3">
            <>
              <BasicInput
                name="price"
                label="Price"
                placeholder="Price"
                extendContainerStyle="w-full"
                type="number"
                decimals={2}
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.price || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    price: Number(e as string),
                  });
                }}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="salePrice"
                label="Sale Price"
                placeholder="Sale Price"
                extendContainerStyle="w-full"
                type="number"
                decimals={2}
                defaultValue={
                  (activeVariant as NewProductVariant)?.salePrice || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    salePrice: Number(e as string),
                  });
                }}
                validationErrors={validationErrors}
              />

              <div className="mt-3">
                <BasicToggle
                  label="On Sale"
                  defaultValue={
                    (activeVariant as ProductVariantWithDetails)?.isOnSale
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setActiveVariant((prevVariant) => ({
                        ...prevVariant,
                        isOnSale: true,
                        isPromoted: false,
                      }));
                    } else {
                      setActiveVariant((prevVariant) => ({
                        ...prevVariant,
                        isOnSale: false,
                      }));
                    }
                  }}
                />

                <BasicToggle
                  label="On Promo"
                  defaultValue={
                    (activeVariant as ProductVariantWithDetails)?.isPromoted
                  }
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setActiveVariant((prevVariant) => ({
                        ...prevVariant,
                        isPromoted: true,
                        isOnSale: false,
                      }));
                    } else {
                      setActiveVariant((prevVariant) => ({
                        ...prevVariant,
                        isPromoted: false,
                      }));
                    }
                  }}
                />
              </div>
            </>
          </TabContent>

          <TabContent tab="shipping" activeTab={activeTab} extendStyle="gap-3">
            <>
              <BasicInput
                name="length"
                label="Length (cm)"
                placeholder="Length"
                extendContainerStyle="w-full"
                type="number"
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.length || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    length: parseInt(e as string),
                  });
                }}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="width"
                label="Width (cm)"
                placeholder="Width"
                extendContainerStyle="w-full"
                type="number"
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.width || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    width: parseInt(e as string),
                  });
                }}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="height"
                label="Height (cm)"
                placeholder="Height"
                extendContainerStyle="w-full"
                type="number"
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.height || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    height: parseFloat(e as string),
                  });
                }}
                validationErrors={validationErrors}
              />

              <BasicInput
                name="weight"
                label="Weight (kg)"
                placeholder="Weight"
                extendContainerStyle="w-full"
                type="number"
                decimals={2}
                defaultValue={
                  (activeVariant as ProductVariantWithDetails)?.weight || ""
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    weight: parseFloat(e as string),
                  });
                }}
                validationErrors={validationErrors}
              />

              <BasicToggle
                label="Is Fragile"
                defaultValue={
                  "isFragile" in activeVariant
                    ? (activeVariant as ProductVariantWithDetails)?.isFragile
                    : false
                }
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    isFragile: e.target.checked,
                  });
                }}
              />
            </>
          </TabContent>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {/* <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    handleDeleteVariant(activeVariant?.name);
                  }}
                >
                  Delete Variant
                </button> */}

            <button
              type="button"
              className="btn !rounded-sm bg-error text-white hover:bg-red-500"
              onClick={handleCancelEditVariant}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn !rounded-sm  bg-primary text-white hover:bg-primary-dark"
              onClick={handleAddVariant}
            >
              Confirm Variant
            </button>
          </div>
        </div>
      )}

      <input
        hidden
        readOnly
        name="variants"
        value={JSON.stringify(variants) || JSON.stringify(activeVariant) || ""}
      />

      <div className="form-control items-center gap-3 pt-3">
        {!activeVariant && <p>Current Variants</p>}

        {variants && !activeVariant && (
          <div className="max-w-full overflow-x-auto sm:max-w-none">
            <BasicTable
              onRowClick={(_, index, name) => handleEditVariant(name, index)}
              size="md"
              mobileSize="xs"
              objectArray={variants?.map((e: ProductVariantWithDetails) => ({
                name: e.name,
                color: e.color,
                size: e.size,
                discount: (
                  ((e.price - e.salePrice!) / e.price) *
                  100
                ).toFixed(),
                sale: e.isOnSale,
                promo: e.isPromoted,
                active: e.isActive,
              }))}
            />
            <button
              className="btn-primary btn-md mx-auto mt-6 block !rounded-sm bg-primary hover:bg-primary-dark"
              onClick={() => handleNewVariant()}
            >
              Add Variant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductVariantUpsert;
