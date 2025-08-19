import { motion } from "framer-motion";

const SpinningLoader = ({ message = "Loading" }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
      {/* Responsive background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ y: [0, 30, -20, 0], x: [0, 15, -10, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[clamp(8rem,20vw,18rem)] h-[clamp(8rem,20vw,18rem)] bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{ y: [0, -20, 25, 0], x: [0, -20, 15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 15,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-0 right-0 w-[clamp(8rem,20vw,18rem)] h-[clamp(8rem,20vw,18rem)] bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{ y: [0, 40, -30, 0] }}
          transition={{
            repeat: Infinity,
            duration: 18,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[clamp(8rem,22vw,20rem)] h-[clamp(8rem,22vw,20rem)] bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
      </div>

      {/* Loader content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="z-10 w-full max-w-sm px-4"
      >
        {/* Spinner */}
        <div className="relative flex items-center justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="border-4 border-muted-foreground border-t-primary rounded-full"
            style={{
              width: "clamp(3rem,6vw,4.5rem)",
              height: "clamp(3rem,6vw,4.5rem)",
            }}
          />
        </div>

        {/* Text + bouncing dots */}
        <div className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-center">
            {message}
          </h3>

          <div className="flex justify-center space-x-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 bg-primary rounded-full"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SpinningLoader;
