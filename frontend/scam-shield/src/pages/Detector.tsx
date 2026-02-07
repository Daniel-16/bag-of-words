import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultCard } from "@/components/ResultCard";
import { ExampleTexts } from "@/components/ExampleTexts";
import { CheckHistory } from "@/components/CheckHistory";
import { predictFraud, addToCheckHistory, APIError, type PredictResponse, type CheckHistoryItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Detector = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);
  const { toast } = useToast();

  const handleSubmit = useCallback(async () => {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      setError("Please enter some text to analyze.");
      return;
    }

    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const response = await predictFraud(trimmedText);
      setResult(response);
      
      // Add to history
      addToCheckHistory({
        text: trimmedText,
        label: response.label,
        confidence: response.confidence,
      });
      setHistoryRefresh((prev) => prev + 1);
    } catch (err) {
      if (err instanceof APIError) {
        if (err.status === 400) {
          setError("The text provided is invalid. Please try again with a different message.");
        } else if (err.status >= 500) {
          setError("The server is experiencing issues. Please try again in a moment.");
        } else {
          setError(err.message);
        }
      } else if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Unable to connect to the server. Make sure the API is running on localhost:8000.");
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "The fraud detection API is not reachable. Is the server running?",
        });
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [text, toast]);

  const handleCheckAnother = useCallback(() => {
    setResult(null);
    setText("");
    setError(null);
  }, []);

  const handleSelectExample = useCallback((exampleText: string) => {
    setText(exampleText);
    setResult(null);
    setError(null);
  }, []);

  const handleSelectHistoryItem = useCallback((item: CheckHistoryItem) => {
    setText(item.text);
    setResult({
      label: item.label,
      confidence: item.confidence,
    });
    setError(null);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <Header />

      <main className="flex-1 py-8 md:py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center"
          >
            <h1 className="text-3xl font-bold md:text-4xl">Fraud Detector</h1>
            <p className="mt-2 text-muted-foreground">
              Paste a suspicious email, SMS, or job posting to analyze
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Main content area */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {result ? (
                  <ResultCard
                    key="result"
                    result={result}
                    onCheckAnother={handleCheckAnother}
                  />
                ) : (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Search className="h-5 w-5 text-primary" />
                          Analyze Message
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Paste your suspicious email, SMS, or job posting here..."
                            value={text}
                            onChange={(e) => {
                              setText(e.target.value);
                              if (error) setError(null);
                            }}
                            className="min-h-[200px] resize-none text-base leading-relaxed"
                            disabled={isLoading}
                          />
                          
                          {/* Error message */}
                          <AnimatePresence>
                            {error && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
                              >
                                {error.includes("connect") ? (
                                  <WifiOff className="mt-0.5 h-4 w-4 shrink-0" />
                                ) : (
                                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                )}
                                <span>{error}</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <Button
                          onClick={handleSubmit}
                          disabled={isLoading || !text.trim()}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Search className="h-4 w-4" />
                              Check for Fraud
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Example texts - show when no result */}
              {!result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ExampleTexts onSelect={handleSelectExample} />
                </motion.div>
              )}
            </div>

            {/* Sidebar - Check History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <CheckHistory
                refreshTrigger={historyRefresh}
                onSelectItem={handleSelectHistoryItem}
              />
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Detector;
