import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { googleLogin } from "../../../utility/authHandlers";
import { Toast } from "../../Notifications/Toast";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENTID}>
      <div
        className="flex w-full justify-center 
        [&>*:first-child]:overflow-hidden

      "
      >
        <GoogleLogin
          useOneTap={true}
          size="large"
          text="continue_with"
          shape="square"
          auto_select={false}
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleLogin(credentialResponse.credential);
            }
          }}
          onError={() => {
            Toast("error", 6500, "Login Failed");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
