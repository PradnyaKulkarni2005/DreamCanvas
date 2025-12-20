
# 🌟 DreamCanvas

DreamCanvas is an **AI-powered personal career coach** designed to help users become job-ready through **personalized learning roadmaps, AI guidance, and intelligent job analysis**. It combines **machine learning, large language models, and gamification** to create a complete career development platform.

🌐 **Live Demo:**
[https://dreamcanvas-murex.vercel.app](https://dreamcanvas-murex.vercel.app)

---

## 🚀 Core Features

### 🎯 AI-Generated Learning Roadmap

* Generates a **personalized 30-day roadmap** based on the user’s target role
* Daily topics broken into **actionable subtasks**
* Powered by **GROQ LLM**

---

### 🎥 Smart YouTube Learning Integration

* Automatically fetches **high-quality learning videos** for each subtask
* Combines:

  * Full-course videos for core topics
  * Focused tutorials for individual subtasks
* Avoids low-quality or irrelevant content

---

### 🔥 Streaks, Progress & Gamification

* Daily streak tracking to encourage consistency
* Visual roadmap progress bar
* Achievement badges:

  * Starter Day Badge
  * 3-Day, 7-Day, 14-Day Streak Badges
  * Ultimate Finisher Badge

---

### 🧠 Missing Skills Detection

* Identifies skill gaps based on the user’s target role
* Suggests what to learn next
* Integrated into roadmap generation

---

### 🛡️ Secure Authentication & Persistence

* User authentication with **Supabase**
* Persistent storage of:

  * Roadmaps
  * Progress
  * Badge states
  * User preferences

---

## 🆕 Job Detection & Career Safety Module

DreamCanvas includes an advanced **AI-powered job posting analysis system** to help users avoid fraudulent job listings and make informed career decisions.

---

### 🚨 Job Fraud Detection (ML-Based)

* Uses a **BERT + SVM** machine learning pipeline to classify job postings as:

  * ✅ Real Job Posting
  * ⚠️ Fake Job Posting
* Trained on job posting datasets to detect:

  * Unrealistic salary claims
  * Vague or missing company details
  * Urgency-based and manipulative language

---

### 🔍 Explainable AI (Why the Job is Fake or Real)

* Converts ML predictions into **human-readable explanations**
* Uses **GROQ LLM** to explain:

  * Language patterns
  * Missing information
  * Suspicious promises
* Provides **practical safety advice** instead of just labels

**Example Output:**

```
• Promises unusually high pay with minimal experience
• Lacks clear company or recruiter information
• Uses urgency-based language to pressure applicants

Advice:
Avoid sharing personal details and verify the employer independently.
```

---

### 🤖 AI Career Chatbot (Global Assistant)

* Floating AI assistant available across the app
* Provides:

  * Career guidance
  * Job readiness advice
  * Learning recommendations
* Context-aware:

  * Target role
  * Roadmap
  * Job detection results
* Powered by **GROQ LLM**

---

### 🔗 Integrated Workflow

The job detection system is fully integrated into DreamCanvas:

```
Job Description
   ↓
ML Fraud Detection (BERT + SVM)
   ↓
Explainable AI (GROQ)
   ↓
AI Career Advice & Learning Guidance
```

---

## 🧰 Tech Stack

| Technology               | Purpose                           |
| ------------------------ | --------------------------------- |
| **Next.js (App Router)** | Frontend & API routes             |
| **TypeScript**           | Type safety                       |
| **Tailwind CSS**         | Styling                           |
| **Framer Motion**        | Animations                        |
| **Supabase**             | Authentication & database         |
| **FastAPI**              | ML model serving                  |
| **BERT + SVM**           | Job fraud detection               |
| **GROQ LLM**             | AI roadmap, explanations, chatbot |
| **YouTube Data API**     | Learning resources                |
| **html2pdf.js**          | Roadmap export                    |

---

## 🧑‍💻 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/DreamCanvas.git
cd dreamcanvas
```

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn
```

### 3️⃣ Setup Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-key
YOUTUBE_API_KEY=your-youtube-key
```

### 4️⃣ Run the Development Server

```bash
npm run dev
# or
yarn dev
```

---

## 🧪 Job Detection API (Backend)

The job detection model is served via a **FastAPI backend**, deployed separately.

### Endpoint

```
POST /predict
```

### Request Body

```json
{
  "description": "Job posting text..."
}
```

### Response

```json
{
  "prediction": 1,
  "confidence": 0.84
}
```

---

## 🎯 Why DreamCanvas is Unique

* Combines **ML + LLMs** in a single platform
* Focuses on **trust, explainability, and user safety**
* Not just learning — **career intelligence**
* Built with real-world production practices

---

## 📌 Future Enhancements

* Skill gap analysis vs job requirements
* Resume analyzer with ATS-style feedback
* Job readiness score visualization
* Phrase-level fraud highlighting
* Personalized learning recommendations from job analysis

---

