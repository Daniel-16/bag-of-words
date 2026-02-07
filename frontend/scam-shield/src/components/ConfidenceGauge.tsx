import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  value: number; // 0 to 1
  isScam: boolean;
  className?: string;
}

export function ConfidenceGauge({ value, isScam, className }: ConfidenceGaugeProps) {
  const percentage = Math.round(value * 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeOffset = circumference * (1 - value);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted"
        />
        {/* Animated progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn(
            isScam ? "text-destructive" : "text-success"
          )}
          stroke="currentColor"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeOffset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn(
            "text-3xl font-bold",
            isScam ? "text-destructive" : "text-success"
          )}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {percentage}%
        </motion.span>
        <span className="text-xs text-muted-foreground">confidence</span>
      </div>
    </div>
  );
}
