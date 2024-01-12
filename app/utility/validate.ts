import { isEmptyObject } from "~/helpers/objectHelpers";

export interface ValidationErrors {
  [key: string]: string;
}

export interface FormConfig {
  [key: string]: {
    required: boolean;
    validator?: (value: string) => string | null;
  };
}

//the master object, validation helpers below
export const validationMaster: FormConfig = {
  addressLine1: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Enter an Address";
      }
      return null;
    },
  },
  altText: {
    required: true,
    validator: (value: string) => {
      if (!value || value.length < 3) {
        return "Alt Text is invalid";
      }
      return null;
    },
  },
  articleCategories: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Categories Required";
      }
      return null;
    },
  },
  bannerImage: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Banner Image Required";
      }
      return null;
    },
  },
  brand: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Brand is invalid";
      }
      return null;
    },
  },
  country: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Enter a Country";
      }
      return null;
    },
  },
  dateofbirth: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Enter a Date of Birth";
      }
      return null;
    },
  },
  department: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Department is Required";
      }
      return null;
    },
  },
  description: {
    required: true,
    validator: (value: string) => {
      if (!value || value.length < 3) {
        return "Description is invalid";
      }
      return null;
    },
  },
  discountPercentage: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Discount is Required";
      }
      return null;
    },
  },
  email: {
    required: true,
    validator: (value: string) => {
      if (!isValidEmail(value)) {
        return "Enter a valid email address";
      }
      return null;
    },
  },
  faxNumber: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Fax Number is Required";
      }
      return null;
    },
  },
  firstName: {
    required: true,
    validator: (value: string) => {
      if (!value || value.length < 3) {
        return "First name is invalid";
      }
      return null;
    },
  },
  gender: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Gender Required";
      }
      return null;
    },
  },
  lastName: {
    required: true,
    validator: (value: string) => {
      if (!value || value.length < 3) {
        return "Last name is invalid";
      }
      return null;
    },
  },
  latitude: {
    required: true,
    validator: (value: string) => {
      if (!isNaN(parseInt(value))) {
        if (!(parseInt(value) > -90 && parseInt(value) < 90)) {
          return "Enter a Valid Latitude";
        }
      }
      return null;
    },
  },
  longitude: {
    required: true,
    validator: (value: string) => {
      if (!isNaN(parseInt(value))) {
        if (!(parseInt(value) > -180 && parseInt(value) < 180)) {
          return "Enter a Valid Longitude";
        }
      }
      return null;
    },
  },
  phoneNumber: {
    required: true,
    validator: (value: string) => {
      if (!isValidMobileNumber(value)) {
        return "Enter a Valid Phone Number";
      }
      return null;
    },
  },
  password: {
    required: true,
    validator: (value: string) => {
      if (!isValidPassword(value)) {
        return "Password is Not Valid";
      }
      return null;
    },
  },
  postcode: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Enter a Postal Code";
      }
      return null;
    },
  },
  suburb: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Enter a Suburb";
      }
      return null;
    },
  },
  state: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Enter a State";
      }
      return null;
    },
  },

  image: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Image is Required";
      }
      return null;
    },
  },
  images: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Images are Required";
      }
      return null;
    },
  },
  index: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Index Required";
      }
      if (value && Number(value) <= 0) {
        return "Must Be Over 0";
      }
      return null;
    },
  },
  promotion: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Promotion is Required";
      }
      return null;
    },
  },
  variants: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Variants are Required";
      }
      if (value) {
        let parsedVal = JSON.parse(value);

        if (isEmptyObject(parsedVal)) {
          return "Variants are Required";
        }

        if (Array.isArray(parsedVal)) {
          if (isEmptyObject(parsedVal?.[0])) {
            return "Variants are Required";
          }
        }
      }
      return null;
    },
  },
  productCategories: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Categories Required";
      }
      return null;
    },
  },
  productSubCategories: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Sub Categories Required";
      }
      return null;
    },
  },
  brands: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Brands Required";
      }
      return null;
    },
  },
  minSaleRange: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Min Sale Range Required";
      }
      return null;
    },
  },
  maxSaleRange: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Max Sale Range Required";
      }
      return null;
    },
  },
  name: {
    required: true,
    validator: (value: string) => {
      if (!value || value.length < 3) {
        return "Name is invalid";
      }
      return null;
    },
  },
  shippingOptions: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Please Select a Shipping Option";
      }
      return null;
    },
  },
  tileImage: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "Tile Image Required";
      }
      return null;
    },
  },
  price: {
    required: true,
    validator: (value: string) => {
      if (!value || isNaN(parseInt(value))) {
        return "Price Required";
      }
      return null;
    },
  },
  salePrice: {
    required: true,
    validator: (value: string) => {
      if (!value || isNaN(parseInt(value))) {
        return "Sale Price Required";
      }
      return null;
    },
  },
  remainingStock: {
    required: true,
    validator: (value: string) => {
      if (!value || isNaN(parseInt(value))) {
        return "Remaining Stock Required";
      }
      return null;
    },
  },
  sku: {
    required: true,
    validator: (value: string) => {
      if (!value) {
        return "SKU Required";
      }
      return null;
    },
  },
};

export const validateForm = (
  formData: FormData,
  validate: Record<string, boolean>,
): {
  formEntries: Record<string, FormDataEntryValue>;
  formErrors: ValidationErrors | null;
} => {
  const formEntries = Object.fromEntries(formData);

  const formConfig: FormConfig = {};

  // loop through the validate object and match keys in the validationMaster
  for (const key in validate) {
    if (validate[key]) {
      formConfig[key] = validationMaster[key];
    }
  }

  const validationErrors: ValidationErrors = {};

  for (const fieldName in formConfig) {
    const fieldConfig = formConfig[fieldName];
    const { required, validator } = fieldConfig;
    const value = formEntries[fieldName];

    if (
      required &&
      (value === undefined ||
        value === null ||
        (typeof value === "string" && value === ""))
    ) {
      validationErrors[fieldName] = `Field is Required`;
    } else if (validator) {
      const errorMessage = validator(value as string);
      if (errorMessage) {
        validationErrors[fieldName] = errorMessage;
      }
    }
  }

  return {
    formEntries,
    formErrors:
      Object.keys(validationErrors).length > 0 ? validationErrors : null,
  };
};

export const isValidEmail = (email: string): boolean => {
  // Defining the email regex pattern
  const regexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Testing the provided email against the pattern
  return regexPattern.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // At least one uppercase letter (A-Z)
  // At least one lowercase letter (a-z)
  // At least one digit (0-9)
  // At least one special character (!@#$%^&*)
  // At least 8 characters long, but no more than 32
  const regexPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  // Testing the provided email against the pattern
  return regexPattern.test(password);
};

export const isValidMobileNumber = (mobileNumber: string) => {
  // Australia
  if (
    mobileNumber.startsWith("61 ") &&
    mobileNumber.replace(/ /g, "").length === 11
  ) {
    return true;
  }
  // UK
  if (
    mobileNumber.startsWith("44 ") &&
    (mobileNumber.length === 10 || mobileNumber.length === 11)
  ) {
    return true;
  }
  // France
  if (
    mobileNumber.startsWith("33 ") &&
    (mobileNumber.length === 10 || mobileNumber.length === 11)
  ) {
    return true;
  }
  // Germany
  if (
    mobileNumber.startsWith("49 ") &&
    (mobileNumber.length === 10 || mobileNumber.length === 11)
  ) {
    return true;
  }
  // United States
  if (mobileNumber.startsWith("1 ") && mobileNumber.length === 11) {
    return true;
  }
  // Canada
  if (mobileNumber.startsWith("1 ") && mobileNumber.length === 11) {
    return true;
  }

  return false;
};
