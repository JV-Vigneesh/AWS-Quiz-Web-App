import { Link, useLocation } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { AWS_CONFIG } from "@/config/constants";

export const Header = () => {
  const location = useLocation();
  const auth = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-bold text-xl">QuizApp</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="font-medium"
              >
                Home
              </Button>
            </Link>
            <Link to="/features">
              <Button
                variant={isActive("/features") ? "secondary" : "ghost"}
                className="font-medium"
              >
                Features
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant={isActive("/about") ? "secondary" : "ghost"}
                className="font-medium"
              >
                About
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant={isActive("/contact") ? "secondary" : "ghost"}
                className="font-medium"
              >
                Contact
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-3">
          {auth.isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">{auth.user?.profile.name || auth.user?.profile.email}</span>
              </div>
              <Link to={auth.user?.profile["cognito:groups"]?.includes("Admins") ? "/admin" : "/user"}>
                <Button
                  variant={isActive("/admin") || isActive("/user") ? "secondary" : "default"}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  auth.removeUser();
                  const logoutUri = window.location.origin + "/";
                  const cognitoDomain = AWS_CONFIG.COGNITO.DOMAIN;
                  window.location.href = `${cognitoDomain}/logout?client_id=${AWS_CONFIG.COGNITO.CLIENT_ID}&logout_uri=${encodeURIComponent(logoutUri)}`;
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
