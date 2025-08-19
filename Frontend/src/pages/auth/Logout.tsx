import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LogOut,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Shield,
} from "lucide-react";
import { Logout } from "@/services/auth/logout.service";

const LogoutPage = () => {
  const navigate = useNavigate();
  const [logoutStatus, setLogoutStatus] = useState<
    "idle" | "logging-out" | "success" | "error"
  >("idle");
  const [countdown, setCountdown] = useState(5);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Auto logout effect
  useEffect(() => {
    if (logoutStatus === "success" && autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (logoutStatus === "success" && autoRedirect && countdown === 0) {
      navigate("/login");
    }
  }, [logoutStatus, countdown, autoRedirect, navigate]);

  const handleLogout = async () => {
    setLogoutStatus("logging-out");

    try {
      const response = await Logout();
      if (response === true) {
        setLogoutStatus("success");
        toast.success("Logged out successfully", {
          description: "You have been securely signed out of your account",
        });
      } else {
        setLogoutStatus("error");
        toast.error("Logout failed", {
          description: "Unable to complete logout process. Please try again.",
        });
      }
    } catch (error) {
      setLogoutStatus("error");
      toast.error("Logout failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const handleStayOnPage = () => {
    setAutoRedirect(false);
    setCountdown(0);
  };

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  // Render different states
  const renderContent = () => {
    switch (logoutStatus) {
      case "idle":
        return (
          <>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <LogOut className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
                <CardDescription className="mt-2">
                  Are you sure you want to sign out of your account?
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Signing out will end your current session and you'll need to
                  sign in again to access your account.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Yes, Sign Out
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </CardFooter>
          </>
        );

      case "logging-out":
        return (
          <>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Signing Out...
                </CardTitle>
                <CardDescription className="mt-2">
                  Please wait while we securely sign you out
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full animate-pulse"
                    style={{ width: "60%" }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Clearing session data...
                </p>
              </div>
            </CardContent>
          </>
        );

      case "success":
        return (
          <>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-green-600">
                  Signed Out Successfully
                </CardTitle>
                <CardDescription className="mt-2">
                  You have been securely signed out of your account
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Your session has been ended and all data has been cleared from
                  this device.
                </AlertDescription>
              </Alert>

              {autoRedirect && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Redirecting to login page in {countdown} seconds...
                  </p>
                  <Button
                    onClick={handleStayOnPage}
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Stay on this page
                  </Button>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button onClick={handleGoToLogin} className="w-full" size="lg">
                Sign In Again
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Go to Home Page
              </Button>
            </CardFooter>
          </>
        );

      case "error":
        return (
          <>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-red-600">
                  Logout Failed
                </CardTitle>
                <CardDescription className="mt-2">
                  There was an issue signing you out. Please try again.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Unable to complete logout process. Your session may still be
                  active.
                </AlertDescription>
              </Alert>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
                size="lg"
              >
                Try Again
              </Button>
              <Button
                onClick={handleGoToDashboard}
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardFooter>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">{renderContent()}</Card>
    </div>
  );
};

export default LogoutPage;
