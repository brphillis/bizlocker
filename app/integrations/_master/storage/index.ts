import { CLIENT_ENV } from "~/build/clientEnv";
export const bucketName_prod = "clutchclothing";
export const bucketName_dev = "clutchclothing-dev";

let bucketName_current = bucketName_prod;

switch (CLIENT_ENV) {
  case "production": {
    bucketName_current = bucketName_prod;
    break;
  }

  case "development": {
    bucketName_current = bucketName_dev;
    break;
  }
}

export const getBucketImageSrc = (source: string): string => {
  const correctSrc = source.replace(bucketName_prod, `${bucketName_current}`);

  return correctSrc;
};
