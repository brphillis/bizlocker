import { useEffect, useState } from "react";

type Props = {
  product: Product;
  availableColors: string[];
  availableSizes: string[];
};

const ProductVariantFormModule = ({
  product,
  availableSizes,
  availableColors,
}: Props) => {
  const [activeVariant, setActiveVariant] = useState<NewProductVariant>();

  const [variants, setVariants] = useState<ProductVariant[] | undefined>(
    product?.variants
  );

  const handleAddVariant = () => {
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
        };
      }

      if (variants) {
        setVariants([...variants, updatedActiveVariant as ProductVariant]);
      } else {
        setVariants([updatedActiveVariant as ProductVariant]);
      }
    }
    setActiveVariant(undefined);
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

  const handleEditVariant = (name: string | undefined, index: number) => {
    setActiveVariant(variants?.[index]);
    setVariants(variants?.filter((e) => e?.name !== name));
  };

  const handleNewVariant = () => {
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Variant Name</span>
              </label>
              <input
                type="string"
                placeholder="Variant Name"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={activeVariant?.name || "BASE"}
                onChange={(e) => {
                  const value = e.target.value.trim();
                  setActiveVariant({
                    ...activeVariant,
                    name: value !== "" ? value : "BASE",
                  });
                }}
              />
            </div>

            <div className="w-[95vw] sm:w-[215px]" />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                placeholder="Price"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={activeVariant?.price || ""}
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    price: parseFloat(e.target.value),
                  });
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Sale Price</span>
              </label>
              <input
                type="number"
                placeholder="Sale Price"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={activeVariant?.salePrice || ""}
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    salePrice: parseFloat(e.target.value),
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Remaining Stock</span>
              </label>
              <input
                type="number"
                placeholder="Stock"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={activeVariant?.stock || ""}
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    stock: parseInt(e.target.value),
                  });
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">SKU</span>
              </label>
              <input
                type="text"
                placeholder="SKU"
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={activeVariant?.sku || ""}
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    sku: e.target.value,
                  });
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Color</span>
              </label>
              <select
                name="color"
                className=" select w-[95vw] sm:w-[215px]"
                placeholder="Select a Color"
                value={activeVariant?.color || ""}
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    color: e.target.value,
                  });
                }}
              >
                <option value="">Select a Color</option>
                {availableColors?.map((color: string, index: number) => {
                  return (
                    <option key={color + index} value={color}>
                      {color}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Size</span>
              </label>
              <select
                name="size"
                className=" select w-[95vw] sm:w-[215px]"
                placeholder="Select a Size"
                value={activeVariant?.size || ""}
                onChange={(e) => {
                  setActiveVariant({
                    ...activeVariant,
                    size: e.target.value,
                  });
                }}
              >
                <option value="">Select a Size</option>
                {availableSizes?.map((size: string, index: number) => {
                  return (
                    <option key={size + index} value={size}>
                      {size}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex flex-col flex-wrap gap-3">
            <div className="mt-3 flex flex-wrap justify-evenly gap-3 self-start">
              <div className="form-control pl-0 sm:pl-6">
                <label className="label cursor-pointer !pb-0">
                  <input
                    type="checkbox"
                    className="toggle-success toggle ml-3"
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
                    className="toggle-success toggle ml-3"
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
                    className="toggle-success toggle ml-3"
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

            <button type="button" className="btn" onClick={handleAddVariant}>
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
            <table className="table-md table">
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
                {variants.map((variant: ProductVariant, index) => {
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
                    ((price - salePrice) / price) * 100;

                  return (
                    <tr
                      key={"variant_" + (name || index)}
                      onClick={() => handleEditVariant(name, index)}
                      className="hover cursor-pointer"
                    >
                      <th>{index + 1}</th>
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
              className="btn-primary btn-md mx-auto mt-6 block"
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
