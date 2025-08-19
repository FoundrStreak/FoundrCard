import { z } from "zod";
import { toast } from "sonner";
import type {
  LoginFormData,
  PasswordStrength,
  RegisterFormData,
} from "@/types/auth";
import { loginSchema } from "@/types/auth";
import { checkEmail } from "@/services/auth/user";

export const validateLoginForm = (
  formData: LoginFormData,
  setErrors: React.Dispatch<React.SetStateAction<Partial<LoginFormData>>>
): boolean => {
  try {
    loginSchema.parse(formData);
    setErrors({});
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce<Partial<LoginFormData>>(
        (acc, err) => {
          if (err.path[0]) {
            acc[err.path[0] as keyof LoginFormData] = err.message;
          }
          return acc;
        },
        {}
      );

      setErrors(fieldErrors);
      toast.error("Please fix the form errors before submitting");
    }
    return false;
  }
};

const PASSWORD_CHECKS = [
  { test: (p: string) => p.length >= 8, message: "At least 8 characters" },
  {
    test: (p: string) => /[a-z]/.test(p),
    message: "At least one lowercase letter",
  },
  {
    test: (p: string) => /[A-Z]/.test(p),
    message: "At least one uppercase letter",
  },
  { test: (p: string) => /\d/.test(p), message: "At least one number" },
  {
    test: (p: string) => /[!@#$%^&*(),.?\":{}|<>]/.test(p),
    message: "At least one special character",
  },
];

export const validatePasswordStrength = (
  password: string
): PasswordStrength => {
  const feedback = PASSWORD_CHECKS.filter((check) => !check.test(password)).map(
    (check) => check.message
  );

  const score = PASSWORD_CHECKS.length - feedback.length;

  return {
    score,
    feedback,
    isValid: score >= 4,
  };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateForm = async (
  formData: RegisterFormData,
  passwordStrength: PasswordStrength,
  setErrors: React.Dispatch<React.SetStateAction<Partial<RegisterFormData>>>
): Promise<boolean> => {
  const errors: Partial<RegisterFormData> = {};
  let valid = true;
  if (!formData.email) {
    errors.email = "Email is required";
    valid = false;
  } else if (!EMAIL_REGEX.test(formData.email)) {
    errors.email = "Please enter a valid email address";
    valid = false;
  } else {
    const emailExists = await checkEmail(formData.email);
    if (emailExists === false) {
      errors.email = "Email is already taken";
      valid = false;
    }
  }

  if (!formData.password) {
    errors.password = "Password is required";
    valid = false;
  } else if (!passwordStrength.isValid) {
    errors.password = "Password does not meet strength requirements";
    valid = false;
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
    valid = false;
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    valid = false;
  }

  setErrors(errors);

  return valid;
};

const STRENGTH_COLORS = [
  "bg-red-500", // Very Weak (score 1)
  "bg-orange-500", // Weak (score 2)
  "bg-yellow-500", // Fair (score 3)
  "bg-blue-500", // Good (score 4)
  "bg-green-500", // Strong (score 5)
];

const STRENGTH_LABELS = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

export const getPasswordStrengthDisplay = (
  formData: RegisterFormData,
  passwordStrength: PasswordStrength
) => {
  if (!formData.password) return null;

  const scoreIndex = passwordStrength.score - 1;
  const width = `${(passwordStrength.score / 5) * 100}%`;

  return {
    color: STRENGTH_COLORS[scoreIndex] || "bg-gray-200",
    label: STRENGTH_LABELS[scoreIndex] || "",
    width,
  };
};
