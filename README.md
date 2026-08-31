# 🎓 Moroccan Master's Degree Application Tracker (English Studies)

A full-stack web application designed for Moroccan English Studies graduates to track real-time Master degree openings, deadlines, direct portal inscription links, and personal bookmarks.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, Lucide Icons, Axios (Hosted on **Vercel**)
- **Backend**: Django REST Framework, SQLite / PostgreSQL, Gunicorn, CORS Headers (Hosted on **Render**)

---

## 🚀 Live Demos

- **Public Localtunnel Endpoint**: `https://long-snails-kneel.loca.lt` (Tunnel Password: `196.65.146.187`)
- **Local Dev Server**: `http://127.0.0.1:8000/`

---

## 📦 Deployment Instructions

### 1. Backend (Render.com)
- **Environment**: Python 3.11
- **Build Command**: `pip install -r requirements.txt && python manage.py migrate && python seed_data.py`
- **Start Command**: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`

### 2. Frontend (Vercel.com)
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
