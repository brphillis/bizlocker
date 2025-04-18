import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Toast } from "../../../components/Notifications/Toast";
import { useSubmit } from "@remix-run/react";
import { ClientOnly } from "~/components/Client/ClientOnly";

const LoginGoogle = () => {
  const submit = useSubmit();
  return (
    <ClientOnly>
      <GoogleOAuthProvider clientId="686666134022-iaevmi83pshusrk7nhjs3ctoqq8g9usl.apps.googleusercontent.com">
        <div className="flex w-full justify-center [&>*:first-child]:overflow-hidden">
          <GoogleLogin
            useOneTap={true}
            size="large"
            text="continue_with"
            shape="square"
            auto_select={false}
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const formData = new FormData();
                formData.set("_action", "googleLogin");
                formData.set("credential", credentialResponse.credential);
                submit(formData, { method: "POST", action: "/login" });
              }
            }}
            onError={() => {
              Toast("error", 6500, "Login Failed");
            }}
          />
        </div>
      </GoogleOAuthProvider>
    </ClientOnly>
  );
};

export default LoginGoogle;
