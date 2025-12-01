# Serverless Quiz Application Using AWS Cloud Services
AWS Quiz Web App

A fully serverless, secure, and scalable quiz application built using **Amazon Web Services (AWS)**.  
This project was developed as part of my internship at **Rejolt EdTech Private Limited** and forms a
complete cloud-native assessment platform with separate **Admin** and **User** modules.

---

## 📌 Features

### 🔐 Authentication & User Roles
- Secure login using **Amazon Cognito**
- Role-based access: **Admin** and **User**
- JWT-based authorization handled by API Gateway and Lambda

### 🛠️ Admin Module
- Add new quiz questions  
- Create quizzes by grouping question IDs  
- View, update, and delete questions  
- View all registered users with roles  
- View all quiz scores from users  

### 🧑‍💻 User Module
- View list of available quizzes  
- Fetch quiz questions  
- Submit quiz answers  
- Automatic score evaluation  
- View previous quiz scores  

---

## 🏗️ System Architecture

The system is built entirely using AWS Serverless Services:

- **Amazon Cognito** – Authentication & Authorization  
- **API Gateway** – REST API management  
- **AWS Lambda (Python)** – Backend logic  
- **Amazon DynamoDB** – NoSQL storage (Questions, Quizzes, Results)  
- **Amazon S3** – Frontend hosting  
- **AWS CloudFront** – Global CDN delivery  
- **AWS CloudWatch** – Logs & monitoring  

---

## 📂 Project Structure

```

root/
│── src/                  # ReactJS frontend
│── Lambda Functions/     # All AWS Lambda functions (Admin & User)
│── screenshots/          # App screenshots
│── README.md             # Project documentation

````

---

## ⚙️ AWS Services Used

| Service        | Purpose |
|----------------|---------|
| **Cognito**    | Authentication, User Pools, Admin/User groups |
| **API Gateway**| Routing HTTP requests to Lambda |
| **Lambda**     | All backend logic implemented in Python |
| **DynamoDB**   | Storage for questions, quizzes, and results |
| **S3**         | Frontend hosting |
| **CloudFront** | CDN for faster global access |
| **CloudWatch** | Monitoring, debugging, and logs |

---

## ⚡ API Endpoints

### 🔧 Admin Endpoints
| Method | Endpoint                 | Description |
|--------|---------------------------|-------------|
| POST   | `/admin/addQuestion`      | Add new question |
| POST   | `/admin/createQuiz`       | Create quiz |
| GET    | `/admin/viewUsers`        | View Cognito users |
| GET    | `/admin/viewScores`       | View quiz results |
| GET/PUT/DELETE | `/admin/viewQuestions` | CRUD operations for questions |

### 👤 User Endpoints
| Method | Endpoint                    | Description |
|--------|------------------------------|-------------|
| GET    | `/user/listQuizzes`          | List quizzes |
| GET    | `/user/getQuizQuestions`     | Get quiz questions |
| POST   | `/user/submitQuiz`           | Submit quiz answers |
| GET    | `/user/viewScore`            | View scores |

---

## 🚀 Tech Stack

- **Frontend**: ReactJS (JavaScript)  
- **Backend**: AWS Lambda (Python)  
- **Database**: DynamoDB  
- **Auth**: Cognito  
- **Deployment**: S3 + CloudFront  

---

## ▶️ How to Run Locally

### **1. Clone the Repository**
```bash
git clone https://github.com/JV-Vigneesh/AWS-Quiz-Web-App.git
cd AWS-Quiz-Web-App
````

### **2. Install Frontend Dependencies**

```bash
cd frontend
npm install
npm run dev
```

### **3. Backend (AWS Lambda)**

* All Lambda code can be deployed directly using the AWS Console
* Or through any CI/CD / infrastructure tool (SAM, CloudFormation, etc.)

### **4. Configure Environment Variables**

Set inside Lambda:

```
QUESTION_TABLE=QuestionBank
QUIZ_TABLE=Quizzes
RESULTS_TABLE=Results
USER_POOL_ID=your_cognito_pool
```

### **5. Frontend Configuration (constants.ts)**

The frontend stores all AWS configuration values in the following file:

```
AWS Project/project/src/config/constants.ts
```

This file contains the API Gateway base URL and Amazon Cognito authentication configuration.
You must update these values with your own AWS credentials before running the application.

```ts
// AWS Configuration - Centralized sensitive information
export const AWS_CONFIG = {
  // API Gateway Base URL
  API_BASE_URL: "", // https://link/prod
  
  // Cognito Configuration
  COGNITO: {
    REGION: "",
    USER_POOL_ID: "",
    AUTHORITY: "", // Cognito Link
    CLIENT_ID: "",
    DOMAIN: "",
    REDIRECT_URI: window.location.origin + "/callback",
    POST_LOGOUT_REDIRECT_URI: window.location.origin + "/",
    SCOPES: "openid email profile aws.cognito.signin.user.admin",
  }
};
```

### **Fields to Update**

| Field          | Description                                                                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `API_BASE_URL` | Your deployed API Gateway invoke URL (e.g., [https://xxxx.execute-api.region.amazonaws.com/prod](https://xxxx.execute-api.region.amazonaws.com/prod)) |
| `REGION`       | AWS region where Cognito User Pool is created                                                                                                         |
| `USER_POOL_ID` | Cognito User Pool ID                                                                                                                                  |
| `AUTHORITY`    | Cognito hosted UI domain link                                                                                                                         |
| `CLIENT_ID`    | Cognito App Client ID                                                                                                                                 |
| `DOMAIN`       | Cognito domain prefix                                                                                                                                 |

---

## 📸 Screenshots

Will be added soon

* Login Page
* Quiz List
* Admin Dashboard
* Add Question
* Create Quiz
* Score View

---

## 🧪 Testing

Tools used:

* **AWS Console (Lambda, DynamoDB)**
* **Postman / Thunder Client**
* **CloudWatch Logs**

Testing included:

* Authentication
* CRUD operations
* Quiz submission and scoring
* Error handling
* Admin/User permissions

---

## 🛡️ Security

* Cognito for role-based access
* IAM roles for each Lambda
* CORS enabled in API Gateway
* DynamoDB access restricted using least-privilege policies

---

## 📈 Future Enhancements

* AI-based question generation
* Analytics dashboards with QuickSight
* Mobile app (with offline mode)
* Multi-language support
* Multi-tenant setup for universities
* Step Functions for workflow orchestration
