// AWS API Gateway endpoints
const API_BASE_URL = ""; // https://link/prod

// Helper to get auth headers
export const getAuthHeaders = (idToken: string) => ({
  "Authorization": `Bearer ${idToken}`,
  "Content-Type": "application/json",
});

// Admin APIs
export const adminApi = {
  addQuestion: async (idToken: string, questionData: {
    question_id: string;
    question_text: string;
    options: Record<string, string>;
    answer: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/addQuestion`, {
      method: "POST",
      headers: getAuthHeaders(idToken),
      body: JSON.stringify(questionData),
    });
    return response.json();
  },

  createQuiz: async (idToken: string, quizData: {
    quiz_id: string;
    title: string;
    question_ids: string[];
    duration: number;
    marks: number;
    created_at: string;
    topic?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/createQuiz`, {
      method: "POST",
      headers: getAuthHeaders(idToken),
      body: JSON.stringify(quizData),
    });
    return response.json();
  },

  viewUsers: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/viewUsers`, {
      method: "GET",
      headers: getAuthHeaders(idToken),
    });
    return response.json();
  },

  viewScores: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/viewScores`, {
      method: "GET",
      headers: getAuthHeaders(idToken),
    });
    return response.json();
  },

  viewQuestions: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/viewQuestions`, {
      method: "GET",
      headers: getAuthHeaders(idToken),
    });
    return response.json();
  },

  updateQuestion: async (idToken: string, questionData: {
    question_id: string;
    question_text: string;
    options: Record<string, string>;
    answer: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/viewQuestions`, {
      method: "PUT",
      headers: getAuthHeaders(idToken),
      body: JSON.stringify(questionData),
    });
    return response.json();
  },

  deleteQuestion: async (idToken: string, questionId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/viewQuestions`, {
      method: "DELETE",
      headers: getAuthHeaders(idToken),
      body: JSON.stringify({ question_id: questionId }),
    });
    return response.json();
  },
};

// User APIs
export const userApi = {
  listQuizzes: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}/user/listQuizzes`, {
      method: "GET",
      headers: getAuthHeaders(idToken),
    });
    return response.json();
  },

  getQuizQuestions: async (idToken: string, quizId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/getQuizQuestions?quiz_id=${quizId}`, {
      method: "GET",
      headers: getAuthHeaders(idToken),
    });
    return response.json();
  },

  submitQuiz: async (idToken: string, quizId: string, answers: Record<string, string>) => {
    const response = await fetch(`${API_BASE_URL}/user/submitQuiz`, {
      method: "POST",
      headers: getAuthHeaders(idToken),
      body: JSON.stringify({
        quiz_id: quizId,
        answers,
      }),
    });
    return response.json();
  },

  viewScore: async (idToken: string) => {
    const response = await fetch(`${API_BASE_URL}/user/viewScore`, {
      method: "GET",
      headers: getAuthHeaders(idToken),
    });
    return response.json();
  },
};
