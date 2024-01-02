import { useEffect, useState } from "react";
import { tokenAuth } from "~/auth.server";
import { validateForm } from "~/utility/validate";
import { STAFF_SESSION_KEY } from "~/session.server";
import type { Image, Product } from "@prisma/client";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { getDepartments } from "~/models/departments.server";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import type { ProductWithDetails } from "~/models/products.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  getPromotion,
  type NewPromotion,
  type PromotionWithContent,
  upsertPromotion,
} from "~/models/promotions.server";
import BasicTextArea from "~/components/Forms/TextArea/BasicInput";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const departments = await getDepartments();

  const id = params?.id;

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Promotion Not Found",
    });
  }

  const promotion =
    id === "add" ? ({} as PromotionWithContent) : await getPromotion(id);

  if (!promotion) {
    throw new Response(null, {
      status: 404,
      statusText: "Promotion Not Found",
    });
  }

  return json({ promotion, departments });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    metaDescription,
    department,
    products,
    discountPercentage,
    gender,
    bannerImage,
    tileImage,
    isActive,
  } = form;

  let notification: PageNotification;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        department: true,
        discountPercentage: true,
        bannerImage: true,
        tileImage: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return json({ validationErrors });
      }

      const parsedBanner = JSON.parse(bannerImage?.toString()) as Image;

      const parsedTile = JSON.parse(tileImage?.toString()) as Image;

      const updateData: NewPromotion = {
        parsedBanner: parsedBanner,
        parsedTile: parsedTile,
        name: name as string,
        metaDescription: metaDescription as string,
        department: department as string,
        products: products && JSON.parse(products as string),
        discountPercentage: discountPercentage as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertPromotion(updateData);

      notification = {
        type: "success",
        message: `Promotion ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });

    case "delete":
      notification = {
        type: "warning",
        message: "Promotion Deleted",
      };

      return json({ success: true, notification });
  }
};

const ModifyPromotion = () => {
  const { promotion, departments } = useLoaderData<typeof loader>();
  const { validationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const { products } = (promotion as { products: ProductWithDetails[] }) || {};

  const navigate = useNavigate();
  useNotification(notification);

  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "images", "meta", "products"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={promotion}
          type="Promotion"
          hasIsActive={true}
          hasDelete={true}
          tabNames={tabNames}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <div className={`form-control ${activeTab !== "general" && "hidden"}`}>
          <div className="form-control gap-3">
            <BasicInput
              label="Name"
              name="name"
              type="text"
              placeholder="Name"
              customWidth="w-full"
              defaultValue={promotion?.name || undefined}
              validationErrors={validationErrors}
            />

            <BasicSelect
              name="department"
              label="Department"
              selections={departments}
              placeholder="Department"
              customWidth="w-full"
              defaultValue={promotion?.department?.id.toString()}
            />

            <BasicInput
              name="discountPercentage"
              label="Discount %"
              placeholder="Discount %"
              type="number"
              customWidth="w-full"
              defaultValue={promotion?.discountPercentage || ""}
              validationErrors={validationErrors}
            />

            <SelectGender
              defaultValue={promotion?.targetGender}
              label="Has Target Gender?"
              customWidth="w-full"
            />
          </div>
        </div>

        <div className={`form-control ${activeTab !== "images" && "hidden"}`}>
          <UploadImageCollapse
            name="bannerImage"
            label="Banner Image"
            tooltip="Optimal 8.09:1 Aspect Ratio"
            defaultValue={promotion?.bannerImage}
          />

          <div className="divider w-full pt-4" />

          <UploadImageCollapse
            name="tileImage"
            label="Tile Image"
            tooltip="Optimal Square Image"
            defaultValue={promotion?.tileImage}
          />
        </div>

        <div className={`form-control ${activeTab !== "meta" && "hidden"}`}>
          <BasicTextArea
            name="metaDescription"
            label="Meta Description"
            placeholder="Meta Description"
            customWidth="w-full"
            defaultValue={promotion?.metaDescription || ""}
            validationErrors={validationErrors}
          />
        </div>

        <div className={`form-control ${activeTab !== "products" && "hidden"}`}>
          <div className="max-w-full overflow-x-auto sm:max-w-none">
            <table className="table table-md">
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: Product, i) => {
                  const { id, name, gender, isActive } = product || {};

                  return (
                    <tr
                      key={"product_" + (name || i)}
                      className="hover cursor-pointer"
                      onClick={() => navigate(`/admin/products/${id}`)}
                    >
                      <th>{i + 1}</th>
                      <td>{name}</td>
                      <td>{gender}</td>

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
            <input
              type="hidden"
              name="products"
              value={JSON.stringify(products) || ""}
            />
          </div>
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyPromotion;
