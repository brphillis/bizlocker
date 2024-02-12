import { CURRENT_BUCKET } from "../../../build/clientEnv";
import { extractBucketName } from "../../../helpers/stringHelpers";

const currentBucket = CURRENT_BUCKET;

export const getBucketImageSrc = (source: string): string => {
  const dbBucket = extractBucketName(source);

  if (dbBucket) {
    const correctSrc = source.replace(dbBucket, currentBucket);

    return correctSrc;
  } else return source;
};
