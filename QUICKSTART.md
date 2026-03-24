# Quick Start Guide - AI Money Mentor

## 5-Minute Setup

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- Terminal/Command Prompt

---

## Backend Setup (2 minutes)

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Start Backend Server
**Windows:**
```bash
set PYTHONPATH=%cd%
uvicorn app.main:app --reload --port 8000
```

**Mac/Linux:**
```bash
export PYTHONPATH=$(pwd)
uvicorn app.main:app --reload --port 8000
```

**OR** use the provided script:
```bash
bash run.sh
```

Backend running at: `http://localhost:8000`

API docs: `http://localhost:8000/docs`

---

## Frontend Setup (2 minutes)

### Step 1: Open New Terminal

### Step 2: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

Frontend running at: `http://localhost:3000`

---

## Test the Application (1 minute)

1. Open browser: `http://localhost:3000`

2. Fill in sample data:
   - Age: 30
   - Monthly Income: 100000
   - Monthly Expenses: 60000
   - Total Savings: 500000
   - Total Debt: 200000
   - Emergency Fund: 200000
   - Life Insurance: 5000000
   - Health Insurance: 500000
   - Dependents: 2
   - Risk Profile: Moderate

3. Click "Continue to Portfolio"

4. Add sample holding:
   - Scheme: HDFC Equity Fund
   - Asset Class: Equity
   - Units: 100
   - Invested Amount: 100000
   - Current Value: 150000
   - Purchase Date: 2023-01-15

5. Click "Analyze My Financial Health"

6. View comprehensive analysis!

---

## Optional: AI Integration

For AI-powered recommendations:

### Step 1: Get API Key
- OpenAI: https://platform.openai.com/api-keys
- OR Anthropic: https://console.anthropic.com/

### Step 2: Create .env File
```bash
cd backend
cp .env.example .env
```

### Step 3: Add API Key
Edit `.env` file:
```
OPENAI_API_KEY=your_key_here
```
OR
```
ANTHROPIC_API_KEY=your_key_here
```

### Step 4: Restart Backend
Stop the backend (Ctrl+C) and start again.

---

## Troubleshooting

### Port Already in Use

**Backend (Port 8000):**
```bash
uvicorn app.main:app --reload --port 8001
```

**Frontend (Port 3000):**
Edit `vite.config.js`:
```javascript
server: {
  port: 3001
}
```

### Module Not Found Errors

**Backend:**
```bash
pip install --upgrade -r requirements.txt
```

**Frontend:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors

Check that backend is running on `localhost:8000` and frontend on `localhost:3000`.

### API Errors

If AI recommendations fail, the system automatically falls back to rule-based recommendations. No action needed.

---

## Production Build

### Backend
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

Production build in `frontend/dist/`

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Install backend deps | `pip install -r requirements.txt` |
| Run backend | `uvicorn app.main:app --reload` |
| Install frontend deps | `npm install` |
| Run frontend | `npm run dev` |
| Build frontend | `npm run build` |
| View API docs | `http://localhost:8000/docs` |

---

## Project Structure Overview

```
ai-money-mentor/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── models/   # Pydantic schemas
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   └── main.py   # FastAPI app
│   └── requirements.txt
│
├── frontend/         # React Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/            # Documentation
└── README.md        # Full documentation
```

---

## Next Steps

1. ✅ Setup complete
2. 📖 Read [ARCHITECTURE.md](docs/ARCHITECTURE.md) for technical details
3. 📊 Review [IMPACT_MODEL.md](docs/IMPACT_MODEL.md) for business metrics
4. 🎬 Check [VIDEO_SCRIPT.md](docs/VIDEO_SCRIPT.md) for presentation guide
5. 📽️ View [PRESENTATION](presentation/AI_MONEY_MENTOR_PRESENTATION.md) for slide content

---

## Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review API docs at `/docs` endpoint
3. Check browser console for errors
4. Verify both servers are running

---

**You're ready to analyze financial health!** 🚀
