// src/pages/auth/Onboarding.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, User } from "lucide-react";
import { checkUsername } from "@/services/auth/user";
import {
  generateRandomUsername,
  validateUsernameFormat,
} from "@/utils/username";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

const OnboardingUsername: React.FC = () => {
  const navigate = useNavigate();
  const { width, height } = useWindowSize();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleCheckUsername = async () => {
    const validationError = validateUsernameFormat(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsChecking(true);
    try {
      const { available } = await checkUsername(username);
      setIsAvailable(available);
      if (!available) {
        setError("Username is already taken");
      } else {
        setError("");
      }
    } catch (err) {
      setError("Failed to check username availability");
    } finally {
      setIsChecking(false);
    }
  };

  const generateRandom = () => {
    const randomName = generateRandomUsername("founder");
    setUsername(randomName);
    setError("");
    setIsAvailable(null);
  };

  const handleSubmit = async () => {
    if (isAvailable === false) {
      setError("Please choose an available username");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Call your API to save the username
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowConfetti(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to save username");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/50 shadow-lg overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={generateRandom}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Claim Your FoundrCard
            </CardTitle>
            <CardDescription className="text-center">
              Your journey starts with a unique username
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Choose a username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setIsAvailable(null);
                  }}
                  className="pl-10"
                  placeholder="yourname"
                />
                {isAvailable === true && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Your card will be available at:{" "}
                <span className="font-mono text-foreground">
                  foundrcard.com/@{username || "yourname"}
                </span>
              </p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant="destructive" className="rounded-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <Button
                onClick={handleCheckUsername}
                disabled={!username || isChecking}
                className="w-full"
              >
                {isChecking && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Check Availability
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={!isAvailable || isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Claim @{username || "username"}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Want a premium username?</p>
              <Button variant="link" className="h-auto p-0 text-sm">
                Check availability and pricing
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingUsername;
