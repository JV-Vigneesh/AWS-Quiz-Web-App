import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Brain, Clock, Trophy, Shield, BarChart3, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "Smart Quiz Generation",
      description: "AI-powered question generation that adapts to your learning needs and creates diverse, challenging questions.",
    },
    {
      icon: Clock,
      title: "Real-time Feedback",
      description: "Get instant feedback on your answers with detailed explanations to help you learn from mistakes.",
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Track your progress with achievements, badges, and leaderboards to stay motivated.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and secure. We prioritize your privacy with industry-standard security.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics to track your performance, identify weak areas, and monitor improvement.",
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Join study groups, share knowledge, and learn together with thousands of other students.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      <main className="flex-1 relative">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Powerful Features for
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Better Learning</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover all the tools and features designed to make your quiz experience engaging, efficient, and effective.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 hover:scale-105 animate-fade-in border-border/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 inline-block">
              <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Start Learning?</h2>
              <p className="text-muted-foreground">Login to start taking quizzes and track your progress.</p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;
