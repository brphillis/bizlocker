import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { IoMdTrash } from "react-icons/io";
import { getBrands } from "~/models/brands.server";
import { capitalizeFirst } from "~/utility/stringHelpers";
import RichTextEditor from "~/components/RichTextEditor.client";
import ImageUploadSlider from "~/components/ImageUploadSlider.client";
import { getProductCategories } from "~/models/productCategories.server";
import { getAvailableColors, getAvailableSizes } from "~/models/enums.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  deleteProduct,
  getProduct,
  upsertProduct,
} from "~/models/products.server";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/server-runtime";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;

  if (id && id !== "add") {
    const product = await getProduct(id);
    const productCategories = await getProductCategories();
    const brands = await getBrands();
    const availableColors = await getAvailableColors();
    const availableSizes = await getAvailableSizes();
    return json({
      product,
      productCategories,
      brands,
      availableColors,
      availableSizes,
    });
  } else {
    return null;
  }
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    categories,
    description,
    gender,
    isActive,
    variants,
    images,
    brand,
  } = form;

  //if single variant we set it to base
  let variantData = variants && JSON.parse(variants?.toString());
  if (!Array.isArray(variantData)) {
    variantData = [variantData];
    variantData[0] = { ...variantData[0], name: "base" };
  }

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const updateData = {
        name: name.toString(),
        categories: categories && JSON.parse(categories?.toString()),
        variants: variantData,
        description: description.toString(),
        gender: gender.toString(),
        isActive: isActive ? true : false,
        images:
          images && (JSON.parse(images?.toString()).filter(Boolean) as Image[]),
        brand: brand.toString() || "Generic",
        id: id,
      };

      await upsertProduct(updateData);

      return redirect("/admin/products");

    case "delete":
      await deleteProduct(id as string);
      return redirect("/admin/products");
  }
};

const Product = () => {
  const navigate = useNavigate();
  const {
    product,
    productCategories,
    brands,
    availableColors,
    availableSizes,
  } =
    (useLoaderData() as {
      product: Product;
      productCategories: ProductCategory[];
      brands: Brand[];
      availableColors: string[];
      availableSizes: string[];
    }) || {};
  const { statusText } = (useActionData() as { statusText: string }) || {};

  const mode = product ? "edit" : "add";

  const [currentImages, setCurrentImages] = useState<Image[] | undefined>(
    product?.images
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.categories.map((e) => e?.name) || [""]
  );

  const [activeVariant, setActiveVariant] = useState<NewProductVariant>();
  const [variants, setVariants] = useState<ProductVariant[] | undefined>(
    product?.variants
  );

  const [isActive, setisActive] = useState<string | undefined>(
    mode === "add" ? " " : product?.isActive ? " " : ""
  );

  const [richText, setRichText] = useState<string>(product?.description);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedCategories(selectedOptions);
  };

  const handleAddVariant = () => {
    if (activeVariant) {
      if (variants) {
        setVariants([...variants, activeVariant as ProductVariant]);
      } else {
        setVariants([activeVariant as ProductVariant]);
      }
    }
    setActiveVariant(undefined);
  };

  const handleDeleteVariant = (name: string | undefined) => {
    if (name && variants) {
      const indexToRemove = variants.findIndex((e) => e?.name === name);
      if (indexToRemove !== -1) {
        variants.splice(indexToRemove, 1);
      }
    }
    setActiveVariant(undefined);
  };

  const handleEditVariant = (name: string | undefined, index: number) => {
    setActiveVariant(variants?.[index]);
    setVariants(variants?.filter((e) => e?.name !== name));
  };

  useEffect(() => {
    if (!product?.variants) {
      setActiveVariant({});
    }
  }, [product?.variants?.length, product]);

  return (
    <div
      className="
    absolute inset-0 flex h-max max-w-[100vw] flex-col items-center justify-start bg-black/80 py-3"
    >
      <Form
        method="POST"
        className="
        relative w-[600px] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <Form method="POST" className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Product</h1>

          <label className="label absolute right-16 top-[1.1rem] cursor-pointer">
            <input
              type="checkbox"
              className="toggle-success toggle ml-3"
              checked={isActive ? true : false}
              onChange={(e) =>
                setisActive(e.target.checked ? "true" : undefined)
              }
            />
            <span className="label-text ml-3">Active</span>
          </label>

          <button
            type="submit"
            name="_action"
            value="delete"
            className="relative w-max rounded-full bg-red-500 p-1 text-white"
          >
            <IoMdTrash size={18} />
          </button>
        </Form>
        <input name="isActive" value={isActive || ""} readOnly hidden />

        <div className="divider w-full" />

        <div className="form-control">
          <div className="form-control gap-3">
            <div className="flex flex-wrap justify-evenly gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="input-bordered input w-[95vw] sm:w-[215px]"
                  defaultValue={product?.name}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Brand</span>
                </label>
                <select
                  name="brand"
                  className="select-bordered select w-[95vw] sm:w-[215px]"
                  defaultValue={product?.brand?.name}
                  placeholder="Select a Value"
                >
                  <option value="">Select a Brand</option>
                  {brands?.map(({ id, name }: Brand) => {
                    return (
                      <option key={name + id} value={name}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Categories</span>
                </label>
                <select
                  className="select-bordered select w-[95vw] sm:w-[215px]"
                  onChange={handleCategoryChange}
                  value={selectedCategories}
                  multiple
                >
                  <option disabled value="">
                    Select a Category
                  </option>
                  {productCategories?.map(({ id, name }: ProductCategory) => (
                    <option key={id} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <input
                  hidden
                  readOnly
                  name="categories"
                  value={JSON.stringify(selectedCategories)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product is Gendered?</span>
                </label>

                <select
                  name="gender"
                  className="select-bordered select w-[95vw] sm:w-[215px]"
                  defaultValue={product?.gender}
                  placeholder="Select a Gender"
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="KIDS">Kids</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divider w-full pt-4" />

          <ImageUploadSlider
            images={currentImages}
            onUpdateImages={setCurrentImages}
          />

          <input
            hidden
            readOnly
            name="images"
            value={JSON.stringify(currentImages) || ""}
          />

          <div className="divider w-full pt-4" />

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
                    value={activeVariant?.name || "BASE"}
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
                    className="select-bordered select w-[95vw] sm:w-[215px]"
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
                    className="select-bordered select w-[95vw] sm:w-[215px]"
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
                        checked={activeVariant?.isActive || true}
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
                          setActiveVariant({
                            ...activeVariant,
                            isOnSale: e.target.checked,
                          });
                        }}
                      />
                      <span className="label-text ml-3">On Sale</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    handleDeleteVariant(activeVariant?.name);
                  }}
                >
                  Delete Variant
                </button>

                <button
                  type="button"
                  className="btn"
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
            value={
              JSON.stringify(variants) || JSON.stringify(activeVariant) || ""
            }
          />

          <div className="form-control items-center gap-3 pt-3">
            {!activeVariant && <p>Current Variants</p>}
            {variants &&
              !activeVariant &&
              variants.map((variant: ProductVariant, index) => {
                const { name, color, size, isActive } = variant || {};

                return (
                  <button
                    className="btn-wide btn relative"
                    type="button"
                    key={"varBtn" + (name || index)}
                    onClick={() => handleEditVariant(name, index)}
                  >
                    {`${name + "- ( " + color + "/" + size + " )"}`}

                    {!isActive && (
                      <div className="absolute right-6 h-3 w-3 rounded-full bg-red-500" />
                    )}
                    {isActive && (
                      <div className="absolute right-6 h-3 w-3 rounded-full bg-success" />
                    )}
                  </button>
                );
              })}
          </div>

          <div className="divider w-full pt-4" />

          <div className="form-control mt-3 w-[495px] max-w-[95vw] self-center">
            <label className="label">
              <span className="label-text">Description</span>
            </label>

            <RichTextEditor
              value={richText}
              onChange={setRichText}
              className="mb-6 h-[200px] pb-3"
            />

            <input
              hidden
              readOnly
              name="description"
              value={richText || product?.description}
            />
          </div>

          <div className="divider w-full pt-12" />

          {statusText && (
            <p className="my-2 text-center text-sm text-red-500/75">
              {statusText}
            </p>
          )}

          <div className="flex flex-row justify-center gap-6">
            <button
              type="button"
              className="btn-primary btn mt-6 w-max"
              onClick={() => navigate("..")}
            >
              Back
            </button>

            <button
              type="submit"
              name="_action"
              value="upsert"
              className="btn-primary btn mt-6 w-max"
            >
              Submit
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Product;
