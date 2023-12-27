import type {
  Brand,
  Department,
  ProductCategory,
  ProductSubCategory,
  Store,
} from "@prisma/client";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectImageConnection from "~/components/Forms/Select/SelectImageConnection";
import SelectStatus from "~/components/Forms/Select/SelectStatus";
import { capitalizeFirst } from "~/helpers/stringHelpers";

type Props = {
  name?: boolean;
  title?: boolean;
  id?: "text" | "number";
  firstName?: boolean;
  lastName?: boolean;
  imageConnection?: boolean;
  email?: boolean;
  productCategories?: ProductCategory[] | null;
  productSubCategories?: ProductSubCategory[] | null;
  departments?: Department[] | null;
  brands?: Brand[] | null;
  status?: "order" | "approval";
  fromStore?: boolean;
  toStore?: boolean;
  stores?: Store[] | null;
};

const AdminContentSearch = ({
  brands,
  name,
  title,
  id,
  firstName,
  lastName,
  departments,
  email,
  imageConnection,
  productCategories,
  productSubCategories,
  status,
  fromStore,
  toStore,
  stores,
}: Props) => {
  return (
    <div className="mt-3 flex flex-col">
      <div className="flex flex-row gap-3">
        {name && (
          <BasicInput label="Name" name="name" placeholder="Name" type="text" />
        )}

        {title && (
          <BasicInput
            label="Title"
            name="title"
            placeholder="Title"
            type="text"
          />
        )}

        {id && <BasicInput label="ID" name="id" placeholder="ID" type={id} />}

        {firstName && (
          <BasicInput
            label="First Name"
            name="firstName"
            placeholder="First Name"
            type="text"
          />
        )}

        {lastName && (
          <BasicInput
            label="Last Name"
            name="lastName"
            placeholder="Last Name"
            type="text"
          />
        )}

        {email && (
          <BasicInput
            label="Email"
            name="email"
            placeholder="Email"
            type="text"
          />
        )}

        {productCategories && (
          <BasicSelect
            label="Category"
            name="productCategory"
            placeholder="Select a Category"
            selections={productCategories}
          />
        )}

        {productSubCategories && (
          <BasicSelect
            label="Sub Category"
            name="productSubCategory"
            placeholder="Select a Sub Category"
            selections={productSubCategories}
          />
        )}

        {brands && (
          <BasicSelect
            label="Brand"
            name="brand"
            placeholder="Brand"
            selections={brands}
          />
        )}

        {departments && (
          <BasicSelect
            label="Department"
            name="department"
            placeholder="Department"
            selections={departments}
          />
        )}

        {stores && (
          <BasicSelect
            label="Store"
            name="store"
            placeholder="Store"
            selections={stores}
          />
        )}

        {stores && fromStore && (
          <BasicSelect
            label="From Store"
            name="fromStore"
            placeholder="From Store"
            selections={stores}
          />
        )}

        {stores && toStore && (
          <BasicSelect
            label="To Store"
            name="toStore"
            placeholder="To Store"
            selections={stores}
          />
        )}

        {status && (
          <SelectStatus
            label={capitalizeFirst(status) + " Status"}
            type={status}
          />
        )}

        {imageConnection && <SelectImageConnection label="Search Connection" />}
      </div>

      <div className="flex flex-row justify-end sm:justify-start">
        <button
          type="submit"
          className="btn btn-primary mt-6 w-max !rounded-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default AdminContentSearch;
