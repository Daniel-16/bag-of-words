import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getCheckHistory, clearCheckHistory, type CheckHistoryItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CheckHistoryProps {
  refreshTrigger?: number;
  onSelectItem?: (item: CheckHistoryItem) => void;
}

export function CheckHistory({ refreshTrigger, onSelectItem }: CheckHistoryProps) {
  const [history, setHistory] = useState<CheckHistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHistory(getCheckHistory());
  }, [refreshTrigger]);

  const handleClear = () => {
    clearCheckHistory();
    setHistory([]);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  const content = (
    <>
      {history.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No checks yet. Try analyzing a message!
        </p>
      ) : (
        <>
          <ScrollArea className="h-[300px] pr-3">
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelectItem?.(item)}
                    className={cn(
                      "cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50",
                      item.label === "SCAM / FRAUD"
                        ? "border-destructive/20 hover:border-destructive/40"
                        : "border-success/20 hover:border-success/40"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {item.label === "SCAM / FRAUD" ? (
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                      ) : (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      )}
                      <div className="flex-1 space-y-1 overflow-hidden">
                        <p className="text-sm leading-snug">
                          {truncateText(item.text)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span
                            className={cn(
                              "font-medium",
                              item.label === "SCAM / FRAUD"
                                ? "text-destructive"
                                : "text-success"
                            )}
                          >
                            {Math.round(item.confidence * 100)}%
                          </span>
                          <span>•</span>
                          <span>{formatTime(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full text-muted-foreground hover:text-destructive"
            onClick={handleClear}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear History
          </Button>
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer pb-3 hover:bg-muted/50">
              <CardTitle className="flex items-center justify-between text-base font-medium">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Check History
                  {history.length > 0 && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {history.length}
                    </span>
                  )}
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>{content}</CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <History className="h-4 w-4 text-primary" />
          Check History
          {history.length > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {history.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
