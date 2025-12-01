import { Card } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Brain, Clock, Award, TrendingUp } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
              Test Your Knowledge
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in">
              Challenge yourself with our interactive quizzes and track your progress
              as you master new topics.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Smart Questions
              </h3>
              <p className="text-sm text-muted-foreground">
                Carefully curated questions to test your knowledge effectively
              </p>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <Clock className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Flexible Timing
              </h3>
              <p className="text-sm text-muted-foreground">
                Take quizzes at your own pace without time pressure
              </p>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <Award className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Instant Results
              </h3>
              <p className="text-sm text-muted-foreground">
                Get your score immediately and see detailed feedback
              </p>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300">
              <TrendingUp className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement and identify areas to focus on
              </p>
            </Card>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
