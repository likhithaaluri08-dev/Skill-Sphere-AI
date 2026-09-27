from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import get_db, engine, Base
from .models import User, EmployeeProfile, Skill, JobRole, IGOTResource, Quiz, Question, EmployeeSkill, SkillGap, UploadedContent
from .schemas import (
    Token, LoginRequest, RegisterRequest, UserOut, SkillOut,
    SkillGapAnalyzeRequest, SkillGapItem, RecommendationItem,
    IGOTCourse, QuizDetail, QuizSubmitRequest, QuizResultResponse, RoleCreateRequest
)
from .auth import create_access_token, get_password_hash, verify_password, get_current_user
from .ai_services import (
    SkillAssessmentAI, SkillGapAI, RecommendationAI,
    ContentAI, QuizAI, FeedbackAI
)
from .seed_data import seed_database

app = FastAPI(
    title="SkillSphere AI Backend",
    description="AI-enabled Skill Intelligence & Learning Platform (SIH26101)",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    seed_database()

# Root & Health check
@app.get("/")
def read_root():
    return {
        "platform": "SkillSphere AI",
        "problem_statement": "SIH26101",
        "subtitle": "AI-enabled Skill Intelligence & Learning Platform",
        "tagline": "Understand Skills. Bridge Gaps. Build the Future.",
        "status": "online",
        "documentation": "/docs"
    }

# --- AUTHENTICATION ---
@app.post("/api/auth/login", response_model=Token)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        # Demo bypass for specific demo accounts if password matches
        if req.role == "hr" and req.email == "hr@sih.demo" and req.password == "HR@123":
            user = db.query(User).filter(User.email == "hr@sih.demo").first()
        elif req.email == "employee@sih.demo" and req.password == "Employee@123":
            user = db.query(User).filter(User.email == "employee@sih.demo").first()
        else:
            raise HTTPException(status_code=400, detail="Invalid email or password.")
            
    token = create_access_token({
        "sub": user.email,
        "role": user.role,
        "name": user.full_name,
        "user_id": user.id,
        "department": user.department
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "email": user.email
    }

@app.post("/api/auth/register", response_model=UserOut)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user = User(
        email=req.email,
        hashed_password=get_password_hash(req.password),
        full_name=req.full_name,
        role=req.role,
        department=req.department or "Digital Services"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# --- SKILLS ---
@app.get("/api/skills")
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).all()
    return [{"id": s.id, "name": s.name, "category": s.category, "description": s.description} for s in skills]

@app.get("/api/employees/{id}/skills")
def get_employee_skills(id: int, db: Session = Depends(get_db)):
    profile = db.query(EmployeeProfile).filter(EmployeeProfile.id == id).first()
    if not profile:
        profile = db.query(EmployeeProfile).first()
    
    # Return structured skills
    results = [
        {"skill": "Python", "current": 4, "required": 4, "group": "Technical", "last_assessed": "12 Jun 2026"},
        {"skill": "SQL", "current": 2, "required": 4, "group": "Technical", "last_assessed": "12 Jun 2026"},
        {"skill": "Data Analytics", "current": 3, "required": 4, "group": "Technical", "last_assessed": "12 Jun 2026"},
        {"skill": "Machine Learning", "current": 2, "required": 3, "group": "Technical", "last_assessed": "10 Jun 2026"},
        {"skill": "Cloud Computing", "current": 2, "required": 3, "group": "Technical", "last_assessed": "08 Jun 2026"},
        {"skill": "Communication", "current": 4, "required": 4, "group": "Professional", "last_assessed": "14 Jun 2026"},
        {"skill": "Leadership", "current": 3, "required": 4, "group": "Professional", "last_assessed": "14 Jun 2026"},
        {"skill": "Problem Solving", "current": 4, "required": 4, "group": "Professional", "last_assessed": "14 Jun 2026"},
        {"skill": "Power BI", "current": 1, "required": 4, "group": "Technical", "last_assessed": "12 Jun 2026"},
        {"skill": "Statistics", "current": 3, "required": 3, "group": "Technical", "last_assessed": "10 Jun 2026"}
    ]
    return results

# --- SKILL GAP ANALYSIS ---
@app.post("/api/skill-gap/analyze")
def analyze_skill_gap(req: SkillGapAnalyzeRequest):
    # Simulated current vs target role capability
    current_map = {"SQL": 2, "Power BI": 1, "Python": 4, "Statistics": 3, "Data Analytics": 3}
    required_map = {"SQL": 4, "Power BI": 4, "Python": 4, "Statistics": 3, "Data Analytics": 4}
    if req.target_role == "Data Analyst":
        required_map = {"SQL": 3, "Power BI": 2, "Python": 3, "Statistics": 3, "Data Analytics": 3}
    
    gaps = SkillGapAI.calculate_gaps(current_map, required_map)
    summary = "Your highest-priority development areas are SQL and Power BI."
    return {
        "current_role": req.current_role,
        "target_role": req.target_role,
        "gaps": gaps,
        "highest_priority_gaps": ["SQL", "Power BI"],
        "summary": summary
    }

@app.get("/api/employees/{id}/skill-gaps")
def get_employee_skill_gaps(id: int):
    return [
        {"skill": "SQL", "current": 2, "required": 4, "gap": 2, "priority": "High"},
        {"skill": "Power BI", "current": 1, "required": 4, "gap": 3, "priority": "High"},
        {"skill": "Python", "current": 4, "required": 4, "gap": 0, "priority": "Low"},
        {"skill": "Statistics", "current": 3, "required": 3, "gap": 0, "priority": "Low"},
    ]

# --- RECOMMENDATIONS ---
@app.get("/api/recommendations/{employee_id}")
def get_recommendations(employee_id: int):
    gaps = [
        {"skill": "SQL", "current": 2, "required": 4, "gap": 2},
        {"skill": "Power BI", "current": 1, "required": 4, "gap": 3},
        {"skill": "Data Analytics", "current": 3, "required": 4, "gap": 1}
    ]
    return RecommendationAI.generate_recommendations(gaps, "Senior Data Analyst")

@app.post("/api/recommendations/generate")
def generate_recommendations(payload: dict):
    gaps = payload.get("gaps", [{"skill": "SQL", "current": 2, "required": 4, "gap": 2}])
    role = payload.get("target_role", "Senior Data Analyst")
    return RecommendationAI.generate_recommendations(gaps, role)

# --- iGOT INTEGRATION ---
@app.get("/api/igot/courses")
def get_igot_courses(
    skill: Optional[str] = Query(None),
    role: Optional[str] = Query(None)
):
    catalog = [
        {
            "id": "IG-DA-104",
            "title": "SQL Fundamentals for Public Data",
            "skill": "SQL",
            "level": "Beginner",
            "duration": "4h 20m",
            "lessons": 8,
            "color": "mint",
            "description": "Build confident querying habits with practical, public-sector datasets.",
            "outcomes": ["Write clean filtering queries", "Master GROUP BY and aggregations", "Relational JOIN operations"],
            "provider": "iGOT Karmayogi",
            "progress": 38,
            "competency_area": "Data Governance"
        },
        {
            "id": "IG-BI-212",
            "title": "Power BI: From Data to Decisions",
            "skill": "Power BI",
            "level": "Intermediate",
            "duration": "6h 10m",
            "lessons": 12,
            "color": "gold",
            "description": "Create clear reports and interactive dashboards for better administrative decisions.",
            "outcomes": ["Design automated executive dashboards", "Write DAX formulas", "Publish secure government reports"],
            "provider": "iGOT Karmayogi",
            "progress": 0,
            "competency_area": "Data Visualization"
        },
        {
            "id": "IG-AN-087",
            "title": "Applied Statistics for Analysts",
            "skill": "Statistics",
            "level": "Intermediate",
            "duration": "3h 45m",
            "lessons": 7,
            "color": "blue",
            "description": "Interpret evidence, uncertainty and trends with statistical fluency.",
            "outcomes": ["Probability distributions", "Hypothesis testing", "Public metrics evaluation"],
            "provider": "iGOT Karmayogi",
            "progress": 0,
            "competency_area": "Empirical Research"
        },
        {
            "id": "IG-SEC-301",
            "title": "Cybersecurity Baseline for Public Servants",
            "skill": "Cybersecurity",
            "level": "Beginner",
            "duration": "2h 30m",
            "lessons": 5,
            "color": "lilac",
            "description": "Information security protocols and safe data handling standards.",
            "outcomes": ["Threat prevention", "Password & MFA hygiene", "Incident escalation"],
            "provider": "iGOT Karmayogi",
            "progress": 0,
            "competency_area": "Cyber Hygiene"
        }
    ]
    if skill and skill != "All skills":
        catalog = [c for c in catalog if c["skill"].lower() == skill.lower()]
    return catalog

# --- CONTENT UPLOAD ---
@app.post("/api/content/upload")
async def upload_content(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    valid_exts = (".pdf", ".ppt", ".pptx", ".doc", ".docx", ".txt", ".mp4", ".mov", ".webm")
    if not file.filename.lower().endswith(valid_exts):
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, PPT, DOC, TXT, or Video.")
    
    file_type = file.filename.split(".")[-1].lower()
    content_info = ContentAI.extract_topics_and_concepts(file.filename, file_type)
    return {
        "status": "success",
        "message": "Learning material processed successfully.",
        "details": content_info
    }

# --- QUIZ & ASSESSMENT ---
@app.post("/api/quiz/generate")
def generate_quiz(payload: dict):
    topic = payload.get("topic", "SQL Fundamentals")
    count = int(payload.get("count", 5))
    difficulty = payload.get("difficulty", "Intermediate")
    questions = QuizAI.generate_quiz(topic=topic, count=count, difficulty=difficulty)
    return {
        "quiz_id": 101,
        "title": f"{topic} Assessment",
        "difficulty": difficulty,
        "question_count": len(questions),
        "questions": questions
    }

@app.get("/api/quiz/{id}")
def get_quiz(id: int):
    questions = QuizAI.generate_quiz()
    return {
        "quiz_id": id,
        "title": "SQL Fundamentals Assessment",
        "difficulty": "Intermediate",
        "questions": questions
    }

@app.post("/api/quiz/{id}/submit", response_model=QuizResultResponse)
def submit_quiz(id: int, req: QuizSubmitRequest):
    questions = QuizAI.generate_quiz()
    score = 0
    for q in questions:
        q_idx = q["id"] - 1
        if q_idx in req.answers and req.answers[q_idx] == q["correct_option"]:
            score += 1
        elif (q_idx + 1) in req.answers and req.answers[q_idx + 1] == q["correct_option"]:
            score += 1
            
    eval_res = FeedbackAI.evaluate_performance(score, len(questions), skill="SQL", current_level=2)
    return eval_res

# --- HR WORKFORCE ANALYTICS ---
@app.get("/api/hr/analytics")
def get_hr_analytics(
    department: Optional[str] = "All departments",
    role: Optional[str] = "All roles",
    skill: Optional[str] = "All skills",
    period: Optional[str] = "Last 6 months"
):
    heatmap = [
        {"department": "Digital Services", "scores": [4, 3, 5, 2, 3]},
        {"department": "Finance", "scores": [3, 4, 2, 2, 4]},
        {"department": "Operations", "scores": [5, 3, 3, 4, 2]},
        {"department": "Administration", "scores": [2, 2, 4, 3, 2]}
    ]
    if department != "All departments":
        heatmap = [h for h in heatmap if h["department"] == department]

    return {
        "readiness_index": 71.8,
        "open_skill_gaps": 3462,
        "learning_participation": 74.0,
        "assessments_completed": 2184,
        "heatmap": heatmap,
        "skills_header": ["SQL", "Analytics", "Security", "Cloud", "Comms"],
        "outcomes": [
            {"metric": "Assessment completion", "value": "79%", "change": "+12%"},
            {"metric": "Learning participation", "value": "74%", "change": "+8%"},
            {"metric": "Average quiz score", "value": "81%", "change": "+5%"},
            {"metric": "Skill gap reduction", "value": "31%", "change": "+9%"}
        ]
    }

@app.get("/api/hr/skill-gaps")
def get_hr_skill_gaps():
    return {
        "department_gaps": [
            {"name": "Digital Services", "gaps": 62},
            {"name": "Finance", "gaps": 48},
            {"name": "Operations", "gaps": 71},
            {"name": "Administration", "gaps": 36}
        ],
        "common_gaps": [
            {"skill": "SQL", "count": 38},
            {"skill": "Data Analytics", "count": 31},
            {"skill": "Cybersecurity", "count": 26},
            {"skill": "Cloud", "count": 22},
            {"skill": "Communication", "count": 17}
        ]
    }

@app.get("/api/hr/employees")
def get_hr_employees(db: Session = Depends(get_db)):
    staff = [
        {"id": "SIH-1042", "name": "Aarav Mehta", "department": "Digital Services", "role": "Junior Data Analyst", "assessed": "8 / 10", "gaps": 3, "progress": 68},
        {"id": "SIH-1088", "name": "Sana Iyer", "department": "Finance", "role": "Finance Officer", "assessed": "12 / 15", "gaps": 2, "progress": 82},
        {"id": "SIH-1114", "name": "Kabir Nair", "department": "Operations", "role": "Program Coordinator", "assessed": "6 / 9", "gaps": 4, "progress": 45},
        {"id": "SIH-1206", "name": "Diya Rao", "department": "Cybersecurity", "role": "Security Analyst", "assessed": "11 / 14", "gaps": 2, "progress": 74},
        {"id": "SIH-1261", "name": "Rehan Kapoor", "department": "Digital Services", "role": "Cloud Engineer", "assessed": "9 / 12", "gaps": 3, "progress": 61},
        {"id": "SIH-1280", "name": "Anika Bose", "department": "Administration", "role": "HR Specialist", "assessed": "7 / 11", "gaps": 2, "progress": 88},
        {"id": "SIH-1305", "name": "Vihaan Shah", "department": "Finance", "role": "Data Analyst", "assessed": "10 / 13", "gaps": 3, "progress": 57},
        {"id": "SIH-1341", "name": "Mira Das", "department": "Operations", "role": "Program Coordinator", "assessed": "8 / 12", "gaps": 1, "progress": 92},
        {"id": "SIH-1379", "name": "Arjun Pillai", "department": "Digital Services", "role": "Junior Data Analyst", "assessed": "9 / 12", "gaps": 3, "progress": 63},
        {"id": "SIH-1402", "name": "Tara Menon", "department": "Administration", "role": "Policy Officer", "assessed": "6 / 10", "gaps": 4, "progress": 39}
    ]
    return staff
