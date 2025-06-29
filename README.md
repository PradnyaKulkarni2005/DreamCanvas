# 🌟 DreamCanvas

**DreamCanvas** is your AI-powered personal career coach that generates a tailored **30-day learning roadmap** to help you become job-ready in your desired role. It integrates streaks, badges, progress tracking, and YouTube resources to create a gamified learning experience.

---

## 🚀 Features

- 🎯 **AI-Generated Roadmap**: Uses **GROQ AI** to create a personalized 30-day plan with **daily topics and subtasks**.
- 🎥 **YouTube Integration**: Each subtask links to a relevant video for faster, guided learning.
- 🔥 **Streak Tracking**: Maintain your learning consistency with streaks.
- 🏆 **Gamification & Badges**:
  - **Starter Day Badge**
  - **3-Day, 7-Day, 14-Day Streak Badges**
  - **Ultimate Finisher Badge**
- 📈 **Progress Tracking**: Visual progress bar to track your roadmap completion.
- 🧠 **Missing Skills Detection**: Suggests what you're lacking for your target role.
- 🛠️ **Supabase Integration**: Secure authentication and data persistence using **Supabase**.

---

## 🧰 Tech Stack

| Tech            | Badge |
|-----------------|--------|
| ![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white) | **App Router** |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white) | Strong typing |
| ![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=white) | Auth & DB |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) | Styling |
| ![GROQ](https://img.shields.io/badge/GROQ_AI-000000?logo=openai&logoColor=white) | AI Roadmap |
| ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white) | Animations |
| ![SweetAlert2](https://img.shields.io/badge/SweetAlert2-FF5F5F?logo=javascript&logoColor=white) | Alerts |
| ![React Icons](https://img.shields.io/badge/React_Icons-61DAFB?logo=react&logoColor=white) | Icon set |
| ![html2pdf.js](https://img.shields.io/badge/html2pdf.js-ff69b4?logo=javascript&logoColor=white) | PDF Export |

---


## 🧑‍💻 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/DreamCanvas.git
cd dreamcanvas
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Setup Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```


## 🛡️ Auth & Database (Supabase)
✅ User authentication (login/register)

✅ Saves target role & roadmap

✅ Fetches roadmap if previously saved

✅ Saves progress and badge status

## 🌐 Live Demo
### https://dreamcanvas-murex.vercel.app


