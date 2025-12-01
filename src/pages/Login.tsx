import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AWS_CONFIG } from "@/config/constants";
import { LogIn, Shield, User } from "lucide-react";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const groups = (auth.user?.profile["cognito:groups"] as string[]) || [];
      const isAdmin = groups.includes("Admins");
      navigate(isAdmin ? "/admin" : "/user");
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  const signOutRedirect = () => {
    auth.removeUser();
    const logoutUri = window.location.origin;
    window.location.href = `${AWS_CONFIG.COGNITO.DOMAIN}/logout?client_id=${AWS_CONFIG.COGNITO.CLIENT_ID}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading authentication...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md">
            <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
            <p className="text-muted-foreground mb-4">{auth.error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (auth.isAuthenticated) {
    const userGroups = (auth.user?.profile["cognito:groups"] as string[]) || [];
    const isAdmin = userGroups.includes("admin");
    const isUser = userGroups.includes("users");

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 max-w-2xl w-full shadow-[var(--shadow-elevated)]">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                {isAdmin ? (
                  <Shield className="w-10 h-10 text-primary-foreground" />
                ) : (
                  <User className="w-10 h-10 text-primary-foreground" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back!</h2>
              <p className="text-muted-foreground">You are successfully authenticated</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="font-semibold text-foreground">{auth.user?.profile.name || auth.user?.profile.email}</p>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <div className="flex items-center gap-2">
                  {isAdmin && (
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold flex items-center gap-1">
                      <Shield className="w-4 h-4" />
                      Admin
                    </span>
                  )}
                  {isUser && (
                    <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-semibold flex items-center gap-1">
                      <User className="w-4 h-4" />
                      User
                    </span>
                  )}
                  {!isAdmin && !isUser && (
                    <span className="text-muted-foreground">No groups assigned</span>
                  )}
                </div>
              </div>

              {auth.user?.id_token && (
                <details className="p-4 bg-secondary/50 rounded-lg">
                  <summary className="text-sm text-muted-foreground cursor-pointer mb-2">
                    ID Token (Click to expand)
                  </summary>
                  <pre className="text-xs overflow-auto max-h-32 text-foreground/80">
                    {auth.user.id_token}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/")}
                className="flex-1 bg-gradient-to-r from-primary to-accent"
              >
                Go to Home
              </Button>
              <Button
                onClick={signOutRedirect}
                variant="outline"
                className="flex-1"
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="p-8 md:p-12 max-w-md w-full shadow-[var(--shadow-elevated)] text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-6 flex items-center justify-center">
            <LogIn className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-3">Welcome to QuizApp</h1>
          <p className="text-muted-foreground mb-8">
            Sign in with your AWS Cognito account to access the quiz platform
          </p>

          <div className="space-y-4">
            <Button
              onClick={() => auth.signinRedirect()}
              size="lg"
              className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Sign In with Cognito
            </Button>

            <div className="pt-4 border-t border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Supported Roles:</p>
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
                <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-semibold flex items-center gap-1">
                  <User className="w-3 h-3" />
                  User
                </span>
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
