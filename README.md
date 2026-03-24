# 🧠 HeaLer's Notebook

> A modern, minimal, tech-focused blog platform designed as a public **AI/ML engineering notebook** — built to document experiments, learnings, failures, and ideas in a clean, structured way.

---

## 🚀 Overview

**My Notebook** is not a typical blog.

It is a **personal engineering log system** where ideas evolve into experiments, experiments turn into learnings, and failures become insights.

Built with a focus on:

* ✨ Simplicity
* ⚡ Performance
* 🧠 Structured thinking
* 🛠️ Developer experience

---

## 🎯 Features

### 📝 Blog System

* Markdown-powered blog posts
* Clean reading experience
* Syntax-highlighted code blocks

### 🔗 Dynamic Routing

* Unique URL for each post (`/post/:slug`)
* Tag-based filtering (`/tags/:tag`)

### 🏷️ Tagging System

* Multi-tag support
* Explore related content easily

### 🧪 Experiment Status System

Each post is categorized as:

* 🟢 Success
* 🔵 Learning
* 🟡 Building
* 🔴 Failed
* ⚪ Idea

---

### 💬 Comments (No Auth)

* Lightweight comment system
* No login required
* Stored in database

---

### 🔍 Search

* Search posts by:

  * Title
  * Tags

---

### 📱 Responsive Design

* Optimized for desktop, tablet, and mobile

---

### ⚡ Performance Focused

* Fast load times
* Optimized rendering
* Clean architecture

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Tailwind CSS

### Backend / Database

* Supabase (PostgreSQL)

### Deployment

* Vercel

---

## 📂 Project Structure

```bash
.
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level components
│   ├── layouts/         # Layout wrappers
│   ├── lib/             # API / utilities
│   ├── styles/          # Global styles
│   └── main.jsx
│
├── public/              # Static assets
├── index.html
└── package.json
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Code-name-HeaLer/HeaLer-s-Notebook/
cd HeaLer-s-Notebook
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Setup Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL="my-app-base-url"
```

---

### 4. Run Locally

```bash
npm run dev
```

---

## 🗄️ Database Schema

### Posts Table

| Column       | Type      |
| ------------ | --------- |
| id           | uuid      |
| title        | text      |
| slug         | text      |
| content      | text      |
| created_at   | timestamp |
| updated_at   | timestamp |
| tags         | text[]    |
| status       | enum      |
| summary      | text      |
| reading_time | integer   |

---

### Comments Table

| Column     | Type      |
| ---------- | --------- |
| id         | uuid      |
| post_id    | uuid      |
| name       | text      |
| content    | text      |
| created_at | timestamp |

---

## 🧠 Writing a Blog Post

Posts are stored in Markdown format.

Example:

````markdown
# My First Experiment

## What I Tried
Testing LLM prompt tuning.

## Result
It worked better than expected.

## Code
```python
print("Hello AI")
````

---

## 🎨 Design Philosophy

- Minimal, distraction-free UI
- Dark-first theme
- Developer-centric layout
- Content > decoration

---

## 🔐 Authentication

🚫 No authentication system

This project is intentionally:
- Open
- Public
- Simple

---

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub  
2. Import project in Vercel  
3. Add environment variables  
4. Deploy  

---

## 🧩 Future Improvements

- 🧠 AI-powered search
- ✍️ Auto-tagging using LLMs
- 📊 Analytics dashboard
- 🔗 Knowledge graph view
- 📝 Rich editor (MDX support)

---

## 🤝 Contributing

Contributions are welcome!

If you’d like to improve the project:
- Fork the repo
- Create a feature branch
- Submit a PR

---

## 📜 License

MIT License

---

## 🙌 Acknowledgements

Inspired by:
- Personal knowledge systems
- Engineering blogs
- Research notebooks

---

## 💭 Final Note

> This project is a reflection of how engineers actually think:
> messy, iterative, and constantly evolving.

If you build something cool with it, share it 🚀
