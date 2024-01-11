import { useNavigation } from "@remix-run/react";
import DarkOverlay from "../DarkOverlay";
import Spinner from "~/components/Spinner";

const LoadingOverlay = () => {
  const navigation = useNavigation();

  return (
    <>
      {navigation.state === ("loading" || "submitting") && (
        <DarkOverlay>
          <Spinner mode="circle" extendStyle={"mt-16"} />
        </DarkOverlay>
      )}
    </>
  );
};

export default LoadingOverlay;
