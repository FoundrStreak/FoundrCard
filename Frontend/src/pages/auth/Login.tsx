import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, AlertCircle, Loader2 } from "lucide-react";

import type { LoginFormData } from "@/types/auth";
import { loginUser } from "@/services/auth/login.service";
import { googleSuccess, googleError } from "@/services/auth/google.service";
import { validateLoginForm } from "@/utils/validate-form";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!validateLoginForm(formData, setErrors)) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      await loginUser(formData);
      toast.success("Login successful! Redirecting...", {
        description: "Welcome back",
      });
      setTimeout(() => navigate(redirectTo || "/feed"), 500);
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error && typeof error === "object") {
        if ("status" in error && error.status === 401) {
          setServerError("Invalid email or password");
          errorMessage = "Invalid email or password";
        } else if (error instanceof Error) {
          errorMessage = error.message || "An error occurred during login";
        }
      }

      toast.error("Login failed", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Redirecting to password reset...");
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 font-inter overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="border-border rounded-lg shadow-lg">
          <CardHeader className="space-y-1 p-6 pb-4">
            <CardTitle className="text-3xl font-bold text-center text-foreground">
              Login
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-6 pt-0">
            {serverError && (
              <Alert variant="destructive" className="rounded-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div
              className="space-y-4"
              onKeyDown={handleKeyPress}
              role="presentation"
              tabIndex={0}
            >
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`pl-10 bg-card rounded-md ${
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <Alert
                    variant="destructive"
                    className="py-2 border-destructive rounded-md"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.email}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Button
                    variant="link"
                    type="button"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-primary hover:no-underline transition-colors duration-200"
                    onClick={handleForgotPassword}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`pr-10 bg-card rounded-md ${
                      errors.password
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <Alert
                    variant="destructive"
                    className="py-2 border-destructive rounded-md"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.password}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Login Button */}
              <Button
                onClick={handleSubmit}
                className="w-full py-2 text-lg font-semibold rounded-md transition-all duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-4">
              <Separator className="flex-grow bg-border" style={{width: "7px"}}/>
              <span className="absolute left-1/2 -translate-x-1/2 px-4 text-sm text-muted-foreground bg-card">
                Or continue with
              </span>
              <Separator className="flex-grow bg-border" />
            </div>

            {/* Google Login Button (external component) */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(response: any) => {
                  googleSuccess(response.credential!, navigate, redirectTo);
                }}
                onError={() => googleError()}
                theme="outline"
                size="large"
                text="signin_with"
                shape="circle"
                width={200}
                useOneTap
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-primary hover:no-underline hover:text-primary-foreground transition-colors duration-200"
                onClick={handleRegister}
                disabled={isLoading}
              >
                Sign up
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;