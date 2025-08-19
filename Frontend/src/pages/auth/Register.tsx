import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";

import type { RegisterFormData, PasswordStrength } from "@/types/auth";
import { validateForm, validatePasswordStrength } from "@/utils/validate-form";
import { registerUser } from "@/services/auth/register.service";
import { googleSuccess, googleError } from "@/services/auth/google.service";
import { GoogleLogin } from "@react-oauth/google";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});
  const [serverError, setServerError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    isValid: false,
  });

  const handleInputChange = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "password") {
      setPasswordStrength(validatePasswordStrength(value));
    }

    if (errors[field] || serverError) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setServerError("");
    }
  };

  const handleSubmit = async () => {
    if (!(await validateForm(formData, passwordStrength, setErrors))) {
      return;
    }

    try {
      setIsLoading(true);
      await registerUser(formData);
      toast.success("Registration successful!", {
        description: "Welcome! You can now log in to your account.",
      });
      setTimeout(() => navigate("/login"), 500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "An unexpected error occurred";
      setServerError(errorMessage);
      toast.error("Registration failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
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
              Register
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your information to create your account
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

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
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
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 flex-1 rounded-full ${
                          passwordStrength.score > 0
                            ? passwordStrength.score === 1
                              ? "bg-destructive"
                              : passwordStrength.score === 2
                              ? "bg-yellow-500"
                              : passwordStrength.score === 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                      <div
                        className={`h-2 flex-1 rounded-full ${
                          passwordStrength.score > 1
                            ? passwordStrength.score === 2
                              ? "bg-yellow-500"
                              : passwordStrength.score === 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                      <div
                        className={`h-2 flex-1 rounded-full ${
                          passwordStrength.score > 2
                            ? passwordStrength.score === 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                      <div
                        className={`h-2 flex-1 rounded-full ${
                          passwordStrength.score > 3
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {passwordStrength.feedback.length > 0
                        ? passwordStrength.feedback[0]
                        : "Password strength"}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`pr-10 bg-card rounded-md ${
                      errors.confirmPassword
                        ? "border-destructive focus-visible:ring-destructive"
                        : formData.confirmPassword &&
                          formData.password === formData.confirmPassword
                        ? "border-green-500 focus-visible:ring-green-500"
                        : ""
                    }`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {formData.confirmPassword && (
                  <div className="flex items-center text-sm">
                    {formData.password === formData.confirmPassword ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Passwords match
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}

                {errors.confirmPassword && (
                  <Alert
                    variant="destructive"
                    className="py-2 border-destructive rounded-md"
                  >
                    <AlertDescription className="text-sm">
                      {errors.confirmPassword}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full py-2 text-lg font-semibold rounded-md transition-all duration-200 ease-in-out hover:scale-[1.01] active:scale-[0.99]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </div>

            <div className="relative flex items-center py-4">
              <Separator className="flex-grow bg-border" />
              <span className="absolute left-1/2 -translate-x-1/2 px-4 text-sm text-muted-foreground bg-card">
                Or continue with
              </span>
              <Separator className="flex-grow bg-border " style={{width: "7px"}}/>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={(response: any) => {
                  googleSuccess(response.credential!, navigate, "/feed");
                }}
                onError={() => googleError()}
                theme="outline"
                size="large"
                text="signup_with"
                shape="circle"
                width={200}
                useOneTap
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 p-6 pt-0">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                variant="link"
                className="h-auto p-0 text-sm text-primary hover:no-underline hover:text-primary-foreground transition-colors duration-200"
                onClick={handleLogin}
                disabled={isLoading}
              >
                Login
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;