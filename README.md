# AI Workflow Automation Agent

A full-stack application that transforms high-level task descriptions into strategic plans and detailed execution results using Groq (Llama 3) or OpenAI.

## 🚀 Features

- **Strategic Planning**: Automatically breaks down complex tasks into logical, numbered steps.
- **Execution Scenarios**: Generates detailed outcomes and verification steps for each plan.
- **Multi-Provider Support**: Seamlessly switches between Groq (Free Tier), OpenAI, and a Mock Mode.
- **Modern UI**: Clean, responsive interface with Markdown support for clear results.
- **History Management**: Persistently save, edit, and delete your recent tasks (powered by `localStorage`).
- **Real-time Feedback**: Visual badges for AI provider status and processing states.

## 🛠️ Tech Stack

- **Frontend**: React, Axios, React-Markdown
- **Backend**: FastAPI (Python), Uvicorn, Groq/OpenAI SDKs
- **AI Models**: Llama 3.3 (Groq), GPT-4o-mini (OpenAI)

## 📋 Prerequisites

- Python 3.8+
- Node.js & npm
- (Optional) Groq API Key or OpenAI API Key

## ⚙️ Setup Instructions

### 1. Backend Setup

```bash
cd backend
python -m venv venv
./venv/Scripts/activate  # On Windows
# source venv/bin/activate # On Linux/Mac

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

Start the backend server:
```bash
python -m uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 🚀 Usage

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Enter a task like "Plan a marketing campaign for a new coffee shop".
3. Click **Run Workflow** to see the AI generate a plan and execution results.
4. Your tasks are saved in the **Recent Tasks** section for future reference.

## 🔒 Security

- The `.env` file is excluded via `.gitignore` to keep your API keys safe.
- Never commit your actual keys to version control.

## 📄 License

MIT
