import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="flex-1 relative z-10">
        <section className="container px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-center animate-fade-in">
              About QuizApp
            </h1>
            <p className="text-lg text-muted-foreground text-center mb-12 animate-fade-in">
              Empowering learners through interactive knowledge assessment
            </p>

            <Card className="p-8 mb-12 shadow-[var(--shadow-elevated)] border-border/50">
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground mb-4">
                QuizApp is dedicated to making learning engaging and accessible for everyone.
                We believe that regular knowledge testing is key to retaining information
                and mastering new skills.
              </p>
              <p className="text-muted-foreground">
                Our platform provides a seamless quiz-taking experience with instant feedback,
                helping you identify strengths and areas for improvement.
              </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 text-center">
                <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Goal-Oriented
                </h3>
                <p className="text-sm text-muted-foreground">
                  Focused on helping you achieve your learning objectives
                </p>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 text-center">
                <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  User-Centric
                </h3>
                <p className="text-sm text-muted-foreground">
                  Designed with your learning experience in mind
                </p>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-card)] border-border/50 text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Fast & Efficient
                </h3>
                <p className="text-sm text-muted-foreground">
                  Quick assessments with instant, actionable feedback
                </p>
              </Card>
            </div>

            <Card className="p-8 shadow-[var(--shadow-elevated)] border-border/50 bg-gradient-to-br from-primary/10 to-accent/10">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Us?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Professional, intuitive interface designed for optimal learning</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Comprehensive question database covering various topics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Instant scoring and detailed performance analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Mobile-friendly design for learning on the go</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
