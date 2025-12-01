import { useState, useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { adminApi } from "@/lib/api";
import { normalizeUsersPayload, normalizeScoresPayload, generateCreatedAt } from "@/lib/adminUtils";
import { Users, Award, PlusCircle, Pencil, Trash2, BarChart3, Upload, Download, Search, X } from "lucide-react";
const Admin = () => {
  const auth = useAuth();
  const [activeView, setActiveView] = useState<
    "dashboard" | "addQuestion" | "createQuiz" | "viewUsers" | "viewScores" | "viewQuestions"
  >("dashboard");
  const [loading, setLoading] = useState(false);

  // Add Question form state (array options + answer = option text)
  const [questionForm, setQuestionForm] = useState({
    question_id: "",
    question_text: "",
    options: ["", "", "", ""], // 4 inputs; we’ll filter empties on submit
    answer: "", // must match one of options[]
  });

  // Create Quiz form state
  const [quizForm, setQuizForm] = useState({
    quiz_id: "",
    title: "",
    question_ids: "",
    duration: "",
    total_marks: "",
    topic: "",
  });

  // Data state
  const [users, setUsers] = useState<any[]>([]);
  const [scores, setScores] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<any[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /** ---------------------------
   * Actions
   * -------------------------- */
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const trimmedOptions = questionForm.options.map((o) => o.trim());
      const finalOptions = trimmedOptions.filter(Boolean);

      if (finalOptions.length < 2) {
        throw new Error("Please provide at least two options.");
      }

      if (!finalOptions.includes(questionForm.answer)) {
        throw new Error("Correct answer must be one of the options.");
      }

      // Convert options array to object with keys A, B, C, D
      const optionsObject: Record<string, string> = {};
      const keys = ['A', 'B', 'C', 'D'];
      finalOptions.forEach((option, index) => {
        if (index < keys.length) {
          optionsObject[keys[index]] = option;
        }
      });

      await adminApi.addQuestion(idToken, {
        question_id: questionForm.question_id.trim(),
        question_text: questionForm.question_text.trim(),
        options: optionsObject,
        answer: questionForm.answer,
      });

      toast({
        title: "Success",
        description: "Question added successfully!",
      });

      setQuestionForm({
        question_id: "",
        question_text: "",
        options: ["", "", "", ""],
        answer: "",
      });
      setActiveView("dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to add question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      await adminApi.createQuiz(idToken, {
        quiz_id: quizForm.quiz_id,
        created_at: new Date().toISOString(),
        duration: parseInt(quizForm.duration),
        marks: parseInt(quizForm.total_marks),
        question_ids: selectedQuestionIds,
        title: quizForm.title,
        topic: quizForm.topic,
      });

      toast({ title: "Success", description: "Quiz created successfully!" });

      setQuizForm({
        quiz_id: "",
        title: "",
        question_ids: "",
        duration: "",
        total_marks: "",
        topic: "",
      });
      setSelectedQuestionIds([]);
      setActiveView("dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsers = async () => {
    setLoading(true);
    setActiveView("viewUsers");

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await adminApi.viewUsers(idToken);
      const normalized = normalizeUsersPayload(data);
      setUsers(normalized);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewScores = async () => {
    setLoading(true);
    setActiveView("viewScores");

    try {
      const idToken = auth.user?.id_token;
      const data = await adminApi.viewScores(idToken);

      const normalized = normalizeScoresPayload(data.results || data);
      setScores(normalized);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch scores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestions = async () => {
    setLoading(true);
    setActiveView("viewQuestions");

    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      const data = await adminApi.viewQuestions(idToken);
      const sortedQuestions = (data.questions || []).sort((a: any, b: any) => {
        const aNum = parseInt(a.question_id.replace(/\D/g, '')) || 0;
        const bNum = parseInt(b.question_id.replace(/\D/g, '')) || 0;
        return aNum - bNum;
      });
      setQuestions(sortedQuestions);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuestion = async (questionData: any) => {
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      await adminApi.updateQuestion(idToken, questionData);
      toast({
        title: "Success",
        description: "Question updated successfully!",
      });
      setEditingQuestion(null);
      handleViewQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update question",
        variant: "destructive",
      });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      await adminApi.deleteQuestion(idToken, questionId);
      toast({
        title: "Success",
        description: "Question deleted successfully!",
      });
      handleViewQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete question",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = () => {
    const dataStr = JSON.stringify(questions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `questions_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Success",
      description: "Questions exported successfully!",
    });
  };

  const handleBulkImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedQuestions = JSON.parse(text);
      
      const idToken = auth.user?.id_token;
      if (!idToken) throw new Error("No authentication token");

      // Import each question
      for (const q of importedQuestions) {
        await adminApi.addQuestion(idToken, {
          question_id: q.question_id,
          question_text: q.question_text,
          options: q.options,
          answer: q.answer,
        });
      }

      toast({
        title: "Success",
        description: `${importedQuestions.length} questions imported successfully!`,
      });
      
      handleViewQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import questions",
        variant: "destructive",
      });
    }
  };

  const loadAvailableQuestions = async () => {
    try {
      const idToken = auth.user?.id_token;
      if (!idToken) return;

      const data = await adminApi.viewQuestions(idToken);
      setAvailableQuestions(data.questions || []);
    } catch (error: any) {
      console.error("Failed to load questions:", error);
    }
  };

  // Filtered questions based on search
  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    
    const query = searchQuery.toLowerCase();
    return questions.filter(q => 
      q.question_id?.toLowerCase().includes(query) ||
      q.question_text?.toLowerCase().includes(query) ||
      Object.values(q.options || {}).some((opt: any) => 
        String(opt).toLowerCase().includes(query)
      )
    );
  }, [questions, searchQuery]);

  /** ---------------------------
   * UI
   * -------------------------- */
  const displayName =
    auth.user?.profile?.name ||
    auth.user?.profile?.preferred_username ||
    auth.user?.profile?.nickname ||
    auth.user?.profile?.email ||
    "Admin";

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/30">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {displayName}</p>
          </div>

          {activeView === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveView("addQuestion")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Add Question</h3>
                    <p className="text-sm text-muted-foreground">Add to question bank</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setActiveView("createQuiz");
                  loadAvailableQuestions();
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <PlusCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Create Quiz</h3>
                    <p className="text-sm text-muted-foreground">Link questions to quiz</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleViewQuestions}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <PlusCircle className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">View Questions</h3>
                    <p className="text-sm text-muted-foreground">See all questions</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleViewUsers}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Users className="h-8 w-8 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">View Users</h3>
                    <p className="text-sm text-muted-foreground">Manage users</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={handleViewScores}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/20 rounded-lg">
                    <Award className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">View Scores</h3>
                    <p className="text-sm text-muted-foreground">Check results</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeView === "addQuestion" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Add New Question</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question_id">Question ID</Label>
                  <Input
                    id="question_id"
                    value={questionForm.question_id}
                    onChange={(e) =>
                      setQuestionForm((s) => ({ ...s, question_id: e.target.value }))
                    }
                    placeholder="e.g., q6"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question_text">Question Text</Label>
                  <Input
                    id="question_text"
                    value={questionForm.question_text}
                    onChange={(e) =>
                      setQuestionForm((s) => ({ ...s, question_text: e.target.value }))
                    }
                    placeholder="What does EC2 provide?"
                    required
                  />
                </div>

                {/* Options as an array */}
                <div className="grid grid-cols-2 gap-4">
                  {questionForm.options.map((opt, idx) => (
                    <div className="space-y-2" key={idx}>
                      <Label htmlFor={`option_${idx}`}>Option {idx + 1}</Label>
                      <Input
                        id={`option_${idx}`}
                        value={opt}
                        onChange={(e) => {
                          const copy = [...questionForm.options];
                          copy[idx] = e.target.value;
                          setQuestionForm((s) => ({
                            ...s,
                            options: copy,
                            // if user edits the option that's currently selected, update answer too
                            answer:
                              s.answer === opt ? e.target.value : s.answer,
                          }));
                        }}
                        placeholder={
                          ["Compute", "Storage", "Database", "Networking"][idx] ||
                          `Option ${idx + 1}`
                        }
                        required={idx < 2} // at least two options required
                      />
                    </div>
                  ))}
                </div>

                {/* Correct answer must be one of the options */}
                <div className="space-y-2">
                  <Label htmlFor="answer">Correct Answer</Label>
                  <select
                    id="answer"
                    value={questionForm.answer}
                    onChange={(e) =>
                      setQuestionForm((s) => ({ ...s, answer: e.target.value }))
                    }
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="" disabled>
                      Select the correct option
                    </option>
                    {questionForm.options
                      .filter((o) => o.trim().length > 0)
                      .map((o, i) => (
                        <option key={`${o}-${i}`} value={o}>
                          {o}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    This will be sent as the exact text (e.g., <code>"Compute"</code>).
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Adding..." : "Add Question"}
                </Button>
              </form>
            </Card>
          )}

          {activeView === "createQuiz" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Create New Quiz</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>

              <form onSubmit={handleCreateQuiz} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="quiz_id">Quiz ID</Label>
                  <Input
                    id="quiz_id"
                    value={quizForm.quiz_id}
                    onChange={(e) => setQuizForm({ ...quizForm, quiz_id: e.target.value })}
                    placeholder="e.g., quiz-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="e.g., AWS Basics Quiz"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={quizForm.topic}
                    onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })}
                    placeholder="e.g., AWS Services"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Questions</Label>
                  <div className="border border-input rounded-md p-4 max-h-64 overflow-y-auto space-y-3">
                    {availableQuestions.length > 0 ? (
                      availableQuestions.map((q) => (
                        <div key={q.question_id} className="flex items-start space-x-3">
                          <Checkbox
                            id={q.question_id}
                            checked={selectedQuestionIds.includes(q.question_id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedQuestionIds([...selectedQuestionIds, q.question_id]);
                              } else {
                                setSelectedQuestionIds(
                                  selectedQuestionIds.filter((id) => id !== q.question_id)
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={q.question_id}
                            className="font-normal cursor-pointer text-sm leading-relaxed"
                          >
                            <span className="font-semibold">{q.question_id}:</span> {q.question_text}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No questions available. Add questions first.</p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Selected: {selectedQuestionIds.length} question(s)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={quizForm.duration}
                      onChange={(e) =>
                        setQuizForm({ ...quizForm, duration: e.target.value })
                      }
                      placeholder="10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_marks">Total Marks</Label>
                    <Input
                      id="total_marks"
                      type="number"
                      value={quizForm.total_marks}
                      onChange={(e) =>
                        setQuizForm({ ...quizForm, total_marks: e.target.value })
                      }
                      placeholder="20"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading || selectedQuestionIds.length === 0} className="w-full">
                  {loading ? "Creating..." : "Create Quiz"}
                </Button>
                {selectedQuestionIds.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    Please select at least one question
                  </p>
                )}
              </form>
            </Card>
          )}

          {activeView === "viewUsers" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">All Users</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Group</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, index) => {
                      const display =
                        user.name ||
                        user.preferred_username ||
                        user.nickname ||
                        [user.given_name, user.family_name]
                          .filter(Boolean)
                          .join(" ")
                          .trim() ||
                        user.username ||
                        user.email ||
                        "User";
                      return (
                        <TableRow key={index}>
                          <TableCell>{user.email || "N/A"}</TableCell>
                          <TableCell>{display}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                user.group === "Admins"
                                  ? "bg-red-500/20 text-red-600"
                                  : "bg-primary/20 text-primary"
                              }`}
                            >
                              {user.group === "Admins" ? "Admin" : "User"}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              )}
            </Card>
          )}

          {activeView === "viewScores" && (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">All Scores</h2>
                <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                  Back to Dashboard
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
                      <TableHead>Response ID</TableHead>
                      <TableHead>Quiz ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Answers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scores.map((score, index) => (
                      <TableRow key={index}>
                        <TableCell>{score.response_id || "N/A"}</TableCell>
                        <TableCell>{score.quiz_id || "N/A"}</TableCell>
                        <TableCell>
                          {score.user_name || score.user_email || "N/A"}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {score.score !== undefined ? score.score : "N/A"}
                        </TableCell>
                        <TableCell>
                          {score.answers ? (
                            <details className="cursor-pointer">
                              <summary className="text-sm text-primary">
                                View Answers
                              </summary>
                              <pre className="text-xs mt-2 p-2 bg-secondary/50 rounded overflow-auto">
                                {JSON.stringify(score.answers, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            <span className="text-muted-foreground text-xs">
                              No answers
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No scores found</p>
              )}
            </Card>
          )}

          {activeView === "viewQuestions" && (
            <Card className="p-8">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-foreground">All Questions</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => document.getElementById('bulk-import')?.click()}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <input
                      id="bulk-import"
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleBulkImport}
                    />
                    <Button variant="outline" onClick={() => setActiveView("dashboard")}>
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions by ID, text, or options..."
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Found {filteredQuestions.length} of {questions.length} questions
                  </p>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading questions...</p>
                </div>
              ) : filteredQuestions.length > 0 ? (
                <div className="space-y-4">
                  {filteredQuestions.map((question, index) => (
                    <Card key={question.question_id || index} className="p-6 border-border/50">
                      {editingQuestion?.question_id === question.question_id ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Question ID</Label>
                            <Input
                              value={editingQuestion.question_id}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Question Text</Label>
                            <Input
                              value={editingQuestion.question_text}
                              onChange={(e) => setEditingQuestion({ ...editingQuestion, question_text: e.target.value })}
                              placeholder="Question text"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {['A', 'B', 'C', 'D'].map((key) => (
                              <div key={key} className="space-y-2">
                                <Label className="font-semibold text-primary">Option {key}</Label>
                                <Input
                                  value={editingQuestion.options?.[key] || ''}
                                  onChange={(e) => setEditingQuestion({
                                    ...editingQuestion,
                                    options: { ...editingQuestion.options, [key]: e.target.value }
                                  })}
                                  placeholder={`Enter option ${key}`}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <select
                              value={editingQuestion.answer}
                              onChange={(e) => setEditingQuestion({ ...editingQuestion, answer: e.target.value })}
                              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                            >
                              {Object.entries(editingQuestion.options || {}).map(([key, value]) => (
                                <option key={key} value={value as string}>{key}: {value as string}</option>
                              ))}
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => handleUpdateQuestion(editingQuestion)} size="sm">
                              Save Changes
                            </Button>
                            <Button onClick={() => setEditingQuestion(null)} variant="outline" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold text-foreground">
                              <span className="text-primary">{question.question_id}:</span> {question.question_text}
                            </h3>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingQuestion(question)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteQuestion(question.question_id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-muted-foreground">Options:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {question.options && typeof question.options === 'object' ? (
                                Object.entries(question.options)
                                  .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                                  .map(([key, value]) => (
                                    <div key={key} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
                                      <span className="font-bold text-primary text-lg min-w-[24px]">{key}.</span>
                                      <span className="text-sm flex-1">{value as string}</span>
                                    </div>
                                  ))
                              ) : (
                                <p className="text-sm text-muted-foreground">No options available</p>
                              )}
                            </div>
                          </div>
                          <div className="pt-3 border-t border-border">
                            <p className="text-sm flex items-center gap-2">
                              <span className="font-medium text-foreground">Correct Answer:</span>
                              <span className="text-green-600 dark:text-green-400 font-semibold">{question.answer}</span>
                            </p>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  {searchQuery ? "No questions match your search" : "No questions found"}
                </p>
              )}
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
