// AWS Configuration - Centralized sensitive information
export const AWS_CONFIG = {
  // API Gateway Base URL
  API_BASE_URL: "", // https://link/prod
  
  // Cognito Configuration
  COGNITO: {
    REGION: "",
    USER_POOL_ID: "",
    AUTHORITY: "", // Cognito Link
    CLIENT_ID: "",
    DOMAIN: "",
    REDIRECT_URI: window.location.origin + "/callback",
    POST_LOGOUT_REDIRECT_URI: window.location.origin + "/",
    SCOPES: "openid email profile aws.cognito.signin.user.admin",
  }
};
