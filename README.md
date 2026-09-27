# SkillSphere AI

**SIH26101 — AI-enabled Skill Intelligence & Learning Platform**

A live-demo prototype for the closed loop **Assess → Identify skill gaps → Personalize learning → Learn → Assess → Improve**. The React demo works on its own with fictional data and local session state. A FastAPI service, SQLAlchemy relational schema and PostgreSQL configuration are included for API-backed demonstrations; SQLite is used automatically when `DATABASE_URL` is not set.

## Run the frontend

Requirements: Node.js 20.19+ recommended. Open a terminal in this folder:

```powershell
npm install
npm run dev
```

Open the URL printed by Vite (normally `http://localhost:5173`).

Demo accounts:

| Workspace | Email | Password |
| --- | --- | --- |
| Employee | `employee@sih.demo` | `Employee@123` |
| HR administrator | `hr@sih.demo` | `HR@123` |

The demo includes the employee skill profile, role-to-role gap comparison, explainable course recommendations, mock iGOT catalog, upload-to-quiz simulation, assessment feedback and persistent browser skill-level update. HR routes include a workforce dashboard, fictional employee register, role mapping, gap analytics and report builder. Route authorization is enforced in the React app for the demo experience.

## Run the API

Requirements: Python 3.11+ and pip.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn backend.main:app --reload --port 8001
```

The API seeds ten fictional employee profiles, five roles, fifteen skills, role requirements, iGOT placeholder resources and a learning-progress record on first startup. Demo API credentials match the frontend table above. API documentation is available at `http://localhost:8001/docs`; health check: `GET /api/health`.

For local SQLite-backed demos, leave `DATABASE_URL` unset. For PostgreSQL, create a database and set the environment variables from `.env.example` before starting Uvicorn. The default JWT secret is for local demonstration only; always set a long random `JWT_SECRET` for deployment. The PostgreSQL driver is included in `backend/requirements.txt`.

The frontend gracefully remains usable without the API. Vite proxies `/api` to `http://127.0.0.1:8001`; demo login obtains and stores a JWT when the service is available.

## Main API routes

- `POST /api/auth/login`, `POST /api/auth/register`
- `GET /api/skills`, `GET /api/employees/{id}/skills`
- `POST /api/skill-gap/analyze`, `GET /api/employees/{id}/skill-gaps`
- `GET /api/recommendations/{employee_id}`, `POST /api/recommendations/generate`
- `GET /api/igot/courses?skill=SQL`, `GET /api/igot/courses?role=Data%20Analyst`
- `POST /api/content/upload`
- `POST /api/quiz/generate`, `GET /api/quiz/{id}`, `POST /api/quiz/{id}/submit`
- `GET /api/hr/analytics`, `GET /api/hr/skill-gaps`, `GET /api/hr/roles`, `POST /api/hr/role-skills`

Employee and quiz endpoints require a bearer JWT. HR analytics and role-mapping endpoints require the HR role. Uploaded files are limited to 30 MB and an explicit allowlist of document and video extensions. The quiz, content extraction and recommendation services return deterministic mock-AI results and require no external key. iGOT data is fictional and clearly treated as a **Prototype / Authorized API Placeholder**; this project does not claim direct iGOT database access.

## Database tables

`users`, `employee_profiles`, `skills`, `employee_skills`, `job_roles`, `role_required_skills`, `assessments`, `assessment_results`, `skill_gaps`, `learning_resources`, `igot_resources`, `recommendations`, `uploaded_content`, `quizzes`, `questions`, `quiz_attempts`, and `learning_progress` use SQLAlchemy models and foreign-key relationships.

## Security note

This is a demonstration, not a production deployment. Before production, add managed secrets, HTTPS, refresh-token/session revocation, rate limiting, audit logging, malware scanning and private object storage; review retention and privacy requirements for employee data and uploaded learning content. External AI and iGOT integrations are intentionally placeholders.
