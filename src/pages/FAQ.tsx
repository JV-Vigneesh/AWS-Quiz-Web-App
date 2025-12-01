import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const FAQ = () => {
  const faqs = [
    {
      question: "How does the quiz system work?",
      answer: "Our quiz system loads questions from a secure database, tracks your progress in real-time, and provides instant feedback upon submission. You can choose between vertical or horizontal view modes for the best experience.",
    },
    {
      question: "Can I retake a quiz?",
      answer: "Yes! After completing a quiz and viewing your results, you can click the 'Retake Quiz' button to start over. Your previous scores are saved for tracking your improvement.",
    },
    {
      question: "What happens to my quiz data?",
      answer: "All your quiz data is stored securely and encrypted. We use industry-standard security practices to protect your information. Your data is never shared with third parties.",
    },
    {
      question: "How is my score calculated?",
      answer: "Your score is calculated based on the number of correct answers divided by the total number of questions, shown as both a numerical score and a percentage. A passing score is typically 50% or higher.",
    },
    {
      question: "Can I see the correct answers after submitting?",
      answer: "Yes! After submitting your quiz, you'll see a detailed review showing all questions with correct answers highlighted in green and incorrect answers in red. This helps you learn from your mistakes.",
    },
    {
      question: "Is there a time limit for quizzes?",
      answer: "Currently, there is no time limit for completing quizzes. You can take as much time as you need to carefully consider each question and provide your best answers.",
    },
    {
      question: "Do I need to answer all questions before submitting?",
      answer: "Yes, you must answer all questions before the submit button becomes active. This ensures you've reviewed the entire quiz and gives you the most accurate score.",
    },
    {
      question: "Can I change my answers before submitting?",
      answer: "Absolutely! You can change your answers as many times as you want before clicking the submit button. Your final selection will be the one that gets graded.",
    },
    {
      question: "What are the different view modes?",
      answer: "We offer two view modes: Vertical (all questions displayed in a scrollable list) and Horizontal (one question at a time with a sidebar navigation). Choose the mode that works best for you!",
    },
    {
      question: "How do I sign up or log in?",
      answer: "Click the 'Sign In' button in the header to access our secure authentication system. You can create a new account or log in with your existing credentials using AWS Cognito authentication.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      <main className="flex-1 relative">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our quiz platform. Can't find what you're looking for? Contact us!
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="p-8 shadow-[var(--shadow-elevated)] border-border/50 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50 pb-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>

            <div className="mt-12 text-center">
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 inline-block animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <h3 className="text-xl font-semibold text-foreground mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Our support team is here to help you with any questions or concerns.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:opacity-90 transition-all duration-300"
                >
                  Contact Support
                </a>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
