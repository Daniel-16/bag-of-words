import { motion } from "framer-motion";
import { FileText, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExampleTextsProps {
  onSelect: (text: string) => void;
}

const examples = [
  {
    label: "419 Scam Email",
    type: "scam",
    text: `Dear Friend,

I am Prince Abubakar from Nigeria. My late father, the King, left behind $15,000,000 USD in a private security company. I need your urgent assistance to transfer this money to your country. 

You will receive 30% of the total sum for your cooperation. Please send your bank details and a small processing fee of $500 to initiate the transfer.

Kindly reply urgently as this matter is time-sensitive.

Best regards,
Prince Abubakar`,
  },
  {
    label: "Lottery Scam",
    type: "scam",
    text: `CONGRATULATIONS!!! 

Your email address has won £1,500,000.00 GBP in our international lottery promotion. You were selected from millions of email addresses worldwide.

To claim your prize, contact our claims agent immediately at claims@lottery-winner.tk and provide:
- Full name
- Address  
- Phone number
- Bank account details
- Copy of ID

Pay the processing fee of £150 to receive your winnings within 48 hours.

UK National Lottery Board`,
  },
  {
    label: "Legitimate Email",
    type: "legitimate",
    text: `Hi John,

Thanks for your order! Your package #12345 has shipped and should arrive by Friday.

You can track your delivery at our website using the tracking number above.

If you have any questions about your order, reply to this email or call our customer service at 1-800-555-0123.

Best,
Customer Support Team
Amazon.com`,
  },
  {
    label: "Job Scam",
    type: "scam",
    text: `WORK FROM HOME - EARN $5000/WEEK!

No experience needed! We are hiring data entry clerks immediately.

Job requirements:
- Must have bank account (for payment)
- Pay $200 registration fee
- Receive packages and forward them

This is a legitimate opportunity to work for an international trading company. Send your personal details and registration fee to get started TODAY!

Email: hr@quick-jobs-now.ru`,
  },
];

export function ExampleTexts({ onSelect }: ExampleTextsProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <FileText className="h-4 w-4 text-primary" />
          Try Example Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {examples.map((example, index) => (
          <motion.div
            key={example.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-left h-auto py-2"
              onClick={() => onSelect(example.text)}
            >
              {example.type === "scam" ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              ) : (
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
              )}
              <span className="truncate">{example.label}</span>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
