import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Target, Zap, FileStack, ArrowRight, ClipboardCheck, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const valueProps = [
  {
    icon: Target,
    title: "Strict AFF Focus",
    description:
      "Trained specifically on advance fee fraud patterns including 419 scams, lottery fraud, and fake job postings.",
  },
  {
    icon: Zap,
    title: "Fast & Accurate",
    description:
      "ML-powered instant detection with confidence scores. Get results in milliseconds, not minutes.",
  },
  {
    icon: FileStack,
    title: "Multi-Format",
    description:
      "Works seamlessly on emails, SMS messages, and job postings. Paste any suspicious text to analyze.",
  },
];

const steps = [
  {
    icon: ClipboardCheck,
    step: "1",
    title: "Paste Text",
    description: "Copy the suspicious email, SMS, or job posting",
  },
  {
    icon: Sparkles,
    step: "2",
    title: "Get Result",
    description: "Our ML model analyzes the text instantly",
  },
  {
    icon: ShieldCheck,
    step: "3",
    title: "Stay Safe",
    description: "Know if it's a scam before you lose a dime",
  },
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-subtle">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          </div>

          <div className="container relative">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl text-center"
            >
              {/* Badge */}
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                  <Shield className="h-4 w-4" />
                  Advance Fee Fraud Detector
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              >
                Detect Advance Fee Fraud{" "}
                <span className="text-gradient">Before You Lose a Dime</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
              >
                Protect yourself from 419 scams, lottery fraud, and fake job postings.
                Paste any suspicious message and let our ML model tell you if it's safe.
              </motion.p>

              {/* CTA */}
              <motion.div variants={itemVariants} className="mt-8 flex justify-center gap-4">
                <Link to="/detector">
                  <Button size="lg" className="gap-2 text-base">
                    Check a Message
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>

              {/* Shield Animation */}
              <motion.div
                variants={itemVariants}
                className="mt-12 flex justify-center"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-hero shadow-lg md:h-32 md:w-32">
                    <Shield className="h-12 w-12 text-primary-foreground md:h-16 md:w-16" />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Value Props Section */}
        <section className="border-t border-border bg-card py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold md:text-4xl">Why Choose Baggage?</h2>
              <p className="mt-4 text-muted-foreground">
                Purpose-built to detect advance fee fraud with precision
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {valueProps.map((prop, index) => (
                <motion.div
                  key={prop.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <Card className="h-full border-2 transition-colors hover:border-primary/20">
                    <CardContent className="flex flex-col items-center p-6 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                        <prop.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold">{prop.title}</h3>
                      <p className="text-muted-foreground">{prop.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-bold md:text-4xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground">
                Three simple steps to protect yourself from fraud
              </p>
            </motion.div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-8 md:grid-cols-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                    className="relative text-center"
                  >
                    {/* Connector line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-1/2 top-10 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-primary/10 md:block" />
                    )}

                    <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-lg ring-4 ring-background">
                      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {step.step}
                      </span>
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 text-center"
            >
              <Link to="/detector">
                <Button size="lg" className="gap-2">
                  Try the Detector Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
