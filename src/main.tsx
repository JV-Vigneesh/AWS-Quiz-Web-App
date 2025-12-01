import { createRoot } from "react-dom/client";
import { AuthProvider } from "react-oidc-context";
import App from "./App.tsx";
import "./index.css";

// Configure AWS Cognito OIDC settings
const cognitoAuthConfig = {
  authority: "", // "https://cognito-idp.location.amazonaws.com/location_*********",
  client_id: "",
  redirect_uri: window.location.origin + "/callback",
  response_type: "code",
  scope: "aws.cognito.signin.user.admin email openid profile",
};

createRoot(document.getElementById("root")!).render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
