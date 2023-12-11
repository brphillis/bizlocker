import { useEffect, useState } from "react";
import type { ValidationErrors } from "~/utility/validate";
import { useNavigate } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { StockLevel } from "@prisma/client";
import { Toast } from "~/components/Notifications/Toast";
import type {
  ProductVariantWithDetails,
  ProductWithDetails,
} from "~/models/products.server";
import BasicInput from "../../Input/BasicInput";
import BasicSelect from "../../Select/BasicSelect";

type Props = {
  storeId: number | null;
  product: ProductWithDetails;
  availableColors: string[];
};

const ProductVariantFormModule = ({
  storeId,
  product,
  availableColors,
}: Props) => {
  const navigate = useNavigate();

  const [activeVariant, setActiveVariant] = useState<
    ProductVariantWithDetails | NewProductVariant | {}
  >();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();
  const [variants, setVariants] = useState<
    ProductVariantWithDetails[] | null | undefined
  >(product?.variants);

  const [upsertState, setUpsertState] = useState<"edit" | "add" | undefined>();

  const handleAddVariant = () => {
    const form = new FormData();
    const formDataObject: Record<string, FormDataEntryValue> = {};

    for (const key in activeVariant) {
      if (activeVariant.hasOwnProperty(key)) {
        form.append(key, (activeVariant as any)[key]);
      }
    }

    for (const [key, value] of form.entries()) {
      formDataObject[key] = value;
    }

    const validate = {
      name: true,
      price: true,
      sku: true,
    };

    const validationErrors = validateForm(formDataObject, validate);
    if (validationErrors) {
      setValidationErrors(validationErrors);
      return;
    }

    if (activeVariant) {
      let updatedActiveVariant = activeVariant;
      if (!activeVariant.hasOwnProperty("isActive")) {
        updatedActiveVariant = {
          ...activeVariant,
          isActive: true,
        };
      }

      if (!activeVariant.hasOwnProperty("name")) {
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
          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              name="name"
              label="Variant Name"
              placeholder="Name"
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

            <div className="w-[95vw] sm:w-[215px]" />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              name="price"
              label="Price"
              placeholder="Price"
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

            <BasicSelect
              id="VariantColor"
              name="color"
              label="Color"
              placeholder="Color"
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
            />

            <BasicInput
              id="VariantSize"
              name="size"
              label="Size"
              placeholder="Size"
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

            <BasicInput
              name="length"
              label="Length (cm)"
              placeholder="Length"
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

            <div className="flex w-full items-end justify-center gap-3 justify-self-start px-[2.3rem] max-md:px-0">
              <BasicInput
                id="VariantSKU"
                name="sku"
                label="SKU"
                placeholder="SKU"
                type="text"
                customWidth="!w-full !max-w-full"
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

            <div className="flex w-full items-end justify-center gap-3 justify-self-start px-[2.3rem] max-md:px-0">
              <BasicInput
                name="remainingStock"
                label="Remaining Stock"
                placeholder="Remaining Stock"
                type="number"
                customWidth="!w-full !max-w-full"
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
                    `stock/${(activeVariant as ProductVariantWithDetails)?.id}`,
                    { replace: true }
                  )
                }
              >
                See Stock
              </button>
            </div>
          </div>

          <div className="flex flex-col flex-wrap gap-3">
            <div className="mt-3 flex flex-wrap justify-evenly gap-3 self-start">
              <div className="form-control pl-0 sm:pl-6">
                <label className="label cursor-pointer !pb-0">
                  <input
                    type="checkbox"
                    className="toggle toggle-success ml-3"
                    checked={
                      activeVariant.hasOwnProperty("isActive")
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
                  <span className="label-text ml-3">Active</span>
                </label>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-evenly gap-3 self-start">
              <div className="form-control pl-0 sm:pl-6">
                <label className="label cursor-pointer !pb-0">
                  <input
                    type="checkbox"
                    className="toggle toggle-success ml-3"
                    checked={
                      (activeVariant as ProductVariantWithDetails)?.isOnSale ||
                      false
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
                  <span className="label-text ml-3">On Sale</span>
                </label>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap justify-evenly gap-3 self-start">
              <div className="form-control pl-0 sm:pl-6">
                <label className="label cursor-pointer !pb-0">
                  <input
                    type="checkbox"
                    className="toggle toggle-success ml-3"
                    checked={
                      (activeVariant as ProductVariantWithDetails)
                        ?.isPromoted || false
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
                  <span className="label-text ml-3">Promo Item</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap justify-evenly gap-3 self-start">
            <div className="form-control pl-0 sm:pl-6">
              <label className="label cursor-pointer !pb-0">
                <input
                  type="checkbox"
                  className="toggle toggle-success ml-3"
                  checked={
                    activeVariant.hasOwnProperty("isFragile")
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
                <span className="label-text ml-3">Fragile</span>
              </label>
            </div>
          </div>

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
              className="btn rounded-sm !border-base-300 bg-error text-white hover:bg-red-500"
              onClick={handleCancelEditVariant}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn rounded-sm !border-base-300 bg-primary text-white hover:bg-primary-focus"
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
            <table className="table table-md">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Sale Discount</th>
                  <th>On Sale</th>
                  <th>Promo</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant: ProductVariantWithDetails, i) => {
                  const {
                    name,
                    color,
                    size,
                    isActive,
                    isOnSale,
                    isPromoted,
                    price,
                    salePrice,
                  } = variant || {};

                  const discountPercentage =
                    ((price - salePrice!) / price) * 100;

                  return (
                    <tr
                      key={"variant_" + (name || i)}
                      onClick={() => handleEditVariant(name, i)}
                      className="hover cursor-pointer"
                    >
                      <th>{i + 1}</th>
                      <td>{name}</td>
                      <td>{color}</td>
                      <td>{size}</td>
                      <td>{discountPercentage.toFixed()}%</td>
                      <td>
                        {!isOnSale && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {isOnSale && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                      <td>
                        {!isPromoted && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {isPromoted && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                      <td>
                        {!isActive && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {isActive && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              className="btn-primary btn-md mx-auto mt-6 block !rounded-sm"
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

export default ProductVariantFormModule;
