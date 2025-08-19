import { type ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

function ErrorFallback() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4">
      <Alert className="mb-6 max-w-md border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
        <AlertCircle className="h-5 w-5" />
        <div>
          <AlertTitle className="text-xl font-semibold">
            Oops! Something went wrong
          </AlertTitle>
          <AlertDescription className="mt-1 text-muted-foreground">
            We're sorry, but an unexpected error occurred.
          </AlertDescription>
        </div>
      </Alert>

      <Button
        onClick={() => window.location.reload()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reload Page
      </Button>
    </div>
  );
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={() => <>{fallback || <ErrorFallback />}</>}
      onError={(error, info) => {
        console.error("Uncaught error:", error, info);
        // Optional: logErrorToMyService(error, info);
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default ErrorBoundary;
