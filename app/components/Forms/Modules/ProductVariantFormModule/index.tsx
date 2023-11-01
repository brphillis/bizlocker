import { useEffect, useState } from "react";
import BasicInput from "../../Input/BasicInput";
import BasicSelect from "../../Select/BasicSelect";
import { validateForm } from "~/utility/validate";

type Props = {
  product: Product;
  availableColors: string[];
};

const ProductVariantFormModule = ({ product, availableColors }: Props) => {
  const [activeVariant, setActiveVariant] = useState<NewProductVariant>();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>();
  const [variants, setVariants] = useState<ProductVariant[] | undefined>(
    product?.variants
  );

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
        setVariants([...variants, updatedActiveVariant as ProductVariant]);
      } else {
        setVariants([updatedActiveVariant as ProductVariant]);
      }
    }
    setValidationErrors(undefined);
    setActiveVariant(undefined);
    setUpsertState(undefined);
  };

  const handleCancelEditVariant = () => {
    if (upsertState === "edit" && variants) {
      setVariants([...variants, activeVariant as ProductVariant]);
    } else if (upsertState === "add" && variants) {
      setVariants([...variants]);
    }
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
    setActiveVariant(variants?.[i]);
    setVariants(variants?.filter((e) => e?.name !== name));
  };

  const handleNewVariant = () => {
    setUpsertState("add");
    setActiveVariant({});
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
              defaultValue={activeVariant?.name || "BASE"}
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
              defaultValue={activeVariant?.price || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  price: parseFloat(e as string),
                });
              }}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="salePrice"
              label="Sale Price"
              placeholder="Sale Price"
              type="number"
              defaultValue={activeVariant?.salePrice || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  salePrice: parseFloat(e as string),
                });
              }}
              validationErrors={validationErrors}
            />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              name="remainingStock"
              label="Remaining Stock"
              placeholder="Remaining Stock"
              type="number"
              defaultValue={activeVariant?.stock || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  stock: parseFloat(e as string),
                });
              }}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="sku"
              label="SKU"
              placeholder="SKU"
              type="text"
              defaultValue={activeVariant?.sku || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  sku: e as string,
                });
              }}
              validationErrors={validationErrors}
            />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicSelect
              name="color"
              label="Color"
              placeholder="Color"
              selections={availableColors.map((e) => {
                return { id: e, name: e };
              })}
              defaultValue={activeVariant?.color || ""}
              onChange={(e) =>
                setActiveVariant({
                  ...activeVariant,
                  color: e,
                })
              }
            />

            <BasicInput
              name="size"
              label="Size"
              placeholder="Size"
              type="text"
              defaultValue={activeVariant?.size || ""}
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
              defaultValue={activeVariant?.length || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  length: parseFloat(e as string),
                });
              }}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="width"
              label="Width (cm)"
              placeholder="Width"
              type="number"
              defaultValue={activeVariant?.width || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  width: parseFloat(e as string),
                });
              }}
              validationErrors={validationErrors}
            />

            <BasicInput
              name="height"
              label="Height (cm)"
              placeholder="Height"
              type="number"
              defaultValue={activeVariant?.height || ""}
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
              defaultValue={activeVariant?.weight || ""}
              onChange={(e) => {
                setActiveVariant({
                  ...activeVariant,
                  weight: parseFloat(e as string),
                });
              }}
              validationErrors={validationErrors}
            />
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
                        ? activeVariant.isActive
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
                    checked={activeVariant?.isOnSale || false}
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
                    checked={activeVariant?.isPromoted || false}
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
                      ? activeVariant.isFragile
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
                {variants.map((variant: ProductVariant, i) => {
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
