import { useState, useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { userApi } from "@/lib/api";
import { BookOpen, Award, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

interface Quiz {
  quiz_id: string;
  title: string;
  duration: number;
  marks: number;
}

interface Question {
  question_id: string;
  question_text: string;
  options: Record<string, string>;
}

const User = () => {
  const auth = useAuth();
  const [activeView, setActiveView] = useState<"dashboard" | "quizList" | "takeQuiz" | "review" | "result" | "viewScores">("dashboard");
  const [loading, setLoading] = useState(false);
  
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<any[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const hasSubmittedRef = useRef(false);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await userApi.listQuizzes(idToken);
      setQuizzes(data.quizzes || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (quiz: Quiz) => {
    setLoading(true);
    setSelectedQuiz(quiz);
    setAnswers({});
    setQuizResult(null);
    setTimeLeft(quiz.duration * 60); // Convert minutes to seconds
    hasSubmittedRef.current = false;

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await userApi.getQuizQuestions(idToken, quiz.quiz_id);
      setQuestions(data.questions || []);
      setActiveView("takeQuiz");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load quiz questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const submitQuiz = async () => {
    if (!selectedQuiz || hasSubmittedRef.current) return;

    hasSubmittedRef.current = true;
    setLoading(true);
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      // Convert numeric key (0/1/2/3) to actual option text before sending
      const formattedAnswers: Record<string, string> = {};

      questions.forEach((q) => {
        const selectedKey = answers[q.question_id]; // "0" | "1" | "2" | "3"
        formattedAnswers[q.question_id] = selectedKey ? q.options[selectedKey] : "";
      });

      const result = await userApi.submitQuiz(idToken, selectedQuiz.quiz_id, formattedAnswers);

      // Store correct answers for review
      const correctAns: Record<string, string> = {};
      if (result.correct_answers) {
        Object.keys(result.correct_answers).forEach((qId) => {
          correctAns[qId] = result.correct_answers[qId];
        });
      }
      setCorrectAnswers(correctAns);
      setQuizResult(result);
      setActiveView("review");

      // Auto-transition to results page after 8 seconds
      setTimeout(() => {
        setActiveView("result");
      }, 8000);
    } catch (error: any) {
      hasSubmittedRef.current = false;
      toast({
        title: "Error",
        description: error.message || "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadScores = async () => {
    setLoading(true);
    setActiveView("viewScores");

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await userApi.viewScore(idToken);
      
      // Fetch quiz list to map quiz IDs to titles
      const quizzesData = await userApi.listQuizzes(idToken);
      const quizMap = new Map((quizzesData.quizzes || []).map((q: Quiz) => [q.quiz_id, q.title]));
      
      // Enhance scores with quiz titles
      const scoresWithTitles = (data.scores || data.results || data.items || []).map((score: any) => ({
        ...score,
        quiz_title: quizMap.get(score.quiz_id) || score.quiz_id
      }));
      
      setScores(scoresWithTitles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (activeView === "quizList") {
      loadQuizzes();
    }
  }, [activeView]);

  // Timer countdown effect
  useEffect(() => {
    if (activeView === "takeQuiz" && timeLeft > 0 && !hasSubmittedRef.current) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeView]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (activeView === "takeQuiz" && timeLeft === 0 && !hasSubmittedRef.current && selectedQuiz && questions.length > 0) {
      submitQuiz();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allQuestionsAnswered = questions.length > 0 && questions.every(q => answers[q.question_id]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />
      
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">User Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {auth.user?.profile.name || auth.user?.profile.email}
            </p>
          </div>

          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveView("quizList")}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Take Quiz</h3>
                    <p className="text-sm text-muted-foreground">Start a new quiz</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={loadScores}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">My Scores</h3>
                    <p className="text-sm text-muted-foreground">View your results</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeView === "quizList" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Available Quizzes</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading quizzes...</p>
                </div>
              ) : quizzes.length > 0 ? (
                <div className="grid gap-4">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.quiz_id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground mb-2">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Duration: {quiz.duration} mins • Total Marks: {quiz.marks}
                          </p>
                        </div>
                        <Button onClick={() => startQuiz(quiz)}>
                          Start Quiz
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No quizzes available</p>
              )}
            </Card>
          )}

          {activeView === "takeQuiz" && selectedQuiz && !quizResult && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedQuiz.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Total Marks: {selectedQuiz.marks}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold px-4 py-2 rounded-lg ${
                    timeLeft < 60 ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'
                  }`}>
                    Time: {formatTime(timeLeft)}
                  </div>
                  <Button variant="outline" onClick={() => setActiveView("quizList")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading questions...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {questions.map((question, index) => (
                    <Card 
                      key={question.question_id} 
                      className="p-6 space-y-4 animate-fade-in border-2 border-border hover:border-primary/50 transition-all"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <h3 className="text-lg font-semibold text-foreground">
                        {index + 1}. {question.question_text}
                      </h3>
                      <RadioGroup
                        value={answers[question.question_id] || ""}
                        onValueChange={(key) =>
                          setAnswers({ ...answers, [question.question_id]: key })
                        }
                        className="space-y-3"
                      >
                        {Object.entries(question.options).map(([key, value]) => {
                          const isSelected = answers[question.question_id] === key;
                          return (
                            <div 
                              key={key} 
                              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-primary bg-primary/10' 
                                  : 'border-border hover:border-primary/30 hover:bg-accent/5'
                              }`}
                            >
                              <RadioGroupItem value={key} id={`${question.question_id}-${key}`} />
                              <Label 
                                htmlFor={`${question.question_id}-${key}`} 
                                className="cursor-pointer flex-1 font-medium"
                              >
                                {value}
                              </Label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </Card>
                  ))}

                  <Button
                    onClick={submitQuiz}
                    disabled={!allQuestionsAnswered || loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? "Submitting..." : "Submit Quiz"}
                  </Button>
                </div>
              )}
            </Card>
          )}

          {activeView === "review" && (
            <Card className="p-8">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">Review Your Answers</h2>
                <p className="text-muted-foreground">Your score: {quizResult?.score || 0}</p>
              </div>

              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userAnswerKey = answers[q.question_id];
                  const userAnswer = q.options[userAnswerKey];
                  const correctAnswer = correctAnswers[q.question_id] || '';
                  const isCorrect = userAnswer === correctAnswer;

                  return (
                    <Card
                      key={q.question_id}
                      className={`p-6 shadow-[var(--shadow-card)] border-2 transition-all duration-500 animate-fade-in ${
                        isCorrect
                          ? "border-green-500/50 bg-green-500/5"
                          : "border-red-500/50 bg-red-500/5"
                      }`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                            isCorrect
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <XCircle className="w-6 h-6" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-4">
                            {idx + 1}. {q.question_text}
                          </h3>

                          <div className="space-y-2">
                            {Object.entries(q.options).map(([key, value]) => {
                              const isUserAnswer = key === userAnswerKey;
                              const isCorrectAnswer = value === correctAnswer;

                              return (
                                <div
                                  key={key}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    isCorrectAnswer
                                      ? "border-green-500 bg-green-500/10"
                                      : isUserAnswer && !isCorrect
                                      ? "border-red-500 bg-red-500/10"
                                      : "border-border bg-background/50"
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {isCorrectAnswer && (
                                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <XCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    <span className="font-medium">{value}</span>
                                    {isCorrectAnswer && (
                                      <span className="ml-auto text-sm text-green-500 font-semibold">
                                        Correct Answer
                                      </span>
                                    )}
                                    {isUserAnswer && !isCorrect && (
                                      <span className="ml-auto text-sm text-red-500 font-semibold">
                                        Your Answer
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground animate-pulse">
                  Redirecting to results...
                </p>
              </div>
            </Card>
          )}

          {activeView === "result" && quizResult && (
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 animate-scale-in">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2 animate-fade-in">
                  Quiz Completed!
                </h2>
                <p className="text-5xl font-bold text-primary mb-4 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                  {quizResult.score || 0} / {selectedQuiz?.marks || 0}
                </p>
                <p className="text-muted-foreground">
                  You scored {Math.round(((quizResult.score || 0) / (selectedQuiz?.marks || 1)) * 100)}% on {selectedQuiz?.title}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => setActiveView("quizList")} size="lg">
                  Take Another Quiz
                </Button>
                <Button onClick={() => setActiveView("dashboard")} variant="outline" size="lg">
                  Back to Dashboard
                </Button>
              </div>
            </Card>
          )}

          {activeView === "viewScores" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">My Scores</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading scores...</p>
                </div>
              ) : scores.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz Title</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{score.quiz_title || score.quiz_id || "N/A"}</TableCell>
                        <TableCell className="font-semibold">{score.score || 0}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No scores yet. Take a quiz to see your results!</p>
              )}
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default User;
