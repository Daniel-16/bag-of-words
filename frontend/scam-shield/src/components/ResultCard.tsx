import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfidenceGauge } from "./ConfidenceGauge";
import { cn } from "@/lib/utils";
import type { PredictResponse } from "@/lib/api";

interface ResultCardProps {
  result: PredictResponse;
  onCheckAnother: () => void;
}

export function ResultCard({ result, onCheckAnother }: ResultCardProps) {
  const isScam = result.label === "SCAM / FRAUD";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-2 transition-all",
          isScam
            ? "border-destructive/50 glow-destructive"
            : "border-success/50 glow-success"
        )}
      >
        <CardContent className="flex flex-col items-center gap-6 p-8">
          {/* Icon Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full",
              isScam ? "bg-destructive/10" : "bg-success/10"
            )}
          >
            {isScam ? (
              <AlertTriangle className="h-8 w-8 text-destructive" />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-success" />
            )}
          </motion.div>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h3
              className={cn(
                "text-2xl font-bold",
                isScam ? "text-destructive" : "text-success"
              )}
            >
              {result.label}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isScam
                ? "This message shows signs of advance fee fraud"
                : "This message appears to be legitimate"}
            </p>
          </motion.div>

          {/* Confidence Gauge */}
          <ConfidenceGauge value={result.confidence} isScam={isScam} />

          {/* Check Another Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              variant="outline"
              onClick={onCheckAnother}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Check Another Message
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
