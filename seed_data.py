from datetime import datetime
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import (
    User, JobRole, Skill, RoleRequiredSkill, EmployeeProfile,
    EmployeeSkill, SkillGap, IGOTResource, LearningResource,
    Quiz, Question, LearningProgress, QuizAttempt
)
from .auth import get_password_hash

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    if db.query(User).first():
        db.close()
        return  # Already seeded

    # 1. Seed Skills (15 skills: 10 Technical, 5 Professional)
    skills_data = [
        {"name": "Python", "category": "Technical", "description": "General programming, data pipelines and scripting."},
        {"name": "SQL", "category": "Technical", "description": "Relational database querying, aggregation, and data normalization."},
        {"name": "Data Analytics", "category": "Technical", "description": "Exploratory data analysis, KPI synthesis, and empirical insights."},
        {"name": "Machine Learning", "category": "Technical", "description": "Predictive modeling, classification, and supervised algorithms."},
        {"name": "Cloud Computing", "category": "Technical", "description": "Cloud deployment architectures, serverless, and cloud storage."},
        {"name": "Power BI", "category": "Technical", "description": "Interactive visual dashboards, DAX queries, and executive reports."},
        {"name": "Statistics", "category": "Technical", "description": "Probability distributions, hypothesis testing, and statistical variance."},
        {"name": "Network Security", "category": "Technical", "description": "Firewalls, packet inspection, and zero-trust protocol compliance."},
        {"name": "Data Visualization", "category": "Technical", "description": "Information design, charts, and public dashboard communication."},
        {"name": "Cloud Architecture", "category": "Technical", "description": "Enterprise cloud infrastructure, resilience, and microservices."},
        {"name": "Communication", "category": "Professional", "description": "Clear stakeholder briefings, public documentation, and collaboration."},
        {"name": "Leadership", "category": "Professional", "description": "Team enablement, public service mentorship, and decision ownership."},
        {"name": "Problem Solving", "category": "Professional", "description": "Root-cause diagnostics, structured thinking, and analytical rigor."},
        {"name": "Policy Analysis", "category": "Professional", "description": "Government policy evaluation, regulatory compliance, and impact."},
        {"name": "Project Management", "category": "Professional", "description": "Milestone delivery, agile governance, and cross-team coordination."}
    ]

    skill_objs = {}
    for s in skills_data:
        obj = Skill(**s)
        db.add(obj)
        db.flush()
        skill_objs[obj.name] = obj

    # 2. Seed Job Roles (5 roles)
    roles_data = [
        {"title": "Junior Data Analyst", "department": "Digital Services", "description": "Assists with basic querying, reporting and data cleaning."},
        {"title": "Senior Data Analyst", "department": "Digital Services", "description": "Leads analytical initiatives, complex models, and executive reporting."},
        {"title": "Cybersecurity Analyst", "department": "Digital Services", "description": "Guards infrastructure security and audits threat intelligence."},
        {"title": "Program Coordinator", "department": "Operations", "description": "Oversees public service initiatives and execution schedules."},
        {"title": "Finance Officer", "department": "Finance", "description": "Manages budget analysis, expenditure tracking, and compliance."}
    ]

    role_objs = {}
    for r in roles_data:
        obj = JobRole(**r)
        db.add(obj)
        db.flush()
        role_objs[obj.title] = obj

    # 3. Role Requirements (e.g. for Senior Data Analyst)
    reqs = [
        # Senior Data Analyst
        (role_objs["Senior Data Analyst"].id, skill_objs["SQL"].id, 4, 5),
        (role_objs["Senior Data Analyst"].id, skill_objs["Power BI"].id, 4, 4),
        (role_objs["Senior Data Analyst"].id, skill_objs["Python"].id, 4, 4),
        (role_objs["Senior Data Analyst"].id, skill_objs["Statistics"].id, 3, 3),
        (role_objs["Senior Data Analyst"].id, skill_objs["Data Analytics"].id, 4, 4),
        # Junior Data Analyst
        (role_objs["Junior Data Analyst"].id, skill_objs["SQL"].id, 2, 4),
        (role_objs["Junior Data Analyst"].id, skill_objs["Python"].id, 3, 3),
        (role_objs["Junior Data Analyst"].id, skill_objs["Data Analytics"].id, 2, 3),
        (role_objs["Junior Data Analyst"].id, skill_objs["Communication"].id, 3, 3),
    ]
    for role_id, skill_id, req_lvl, imp in reqs:
        db.add(RoleRequiredSkill(role_id=role_id, skill_id=skill_id, required_level=req_lvl, importance=imp))
    db.flush()

    # 4. Seed iGOT Resources
    igot_courses = [
        {
            "course_id": "IG-DA-104",
            "title": "SQL Fundamentals for Public Data",
            "skill_id": skill_objs["SQL"].id,
            "category": "Data & Analytics",
            "difficulty": "Beginner",
            "duration": "4h 20m",
            "lessons_count": 8,
            "description": "Build confident querying habits with practical, public-sector datasets.",
            "learning_outcomes": "Write multi-condition SQL queries; Master GROUP BY and aggregate functions; Join related tables cleanly.",
            "provider": "iGOT Karmayogi"
        },
        {
            "course_id": "IG-BI-212",
            "title": "Power BI: From Data to Decisions",
            "skill_id": skill_objs["Power BI"].id,
            "category": "Data Visualization",
            "difficulty": "Intermediate",
            "duration": "6h 10m",
            "lessons_count": 12,
            "description": "Create clear reports and interactive dashboards for better public administration decisions.",
            "learning_outcomes": "Design automated Power BI dashboards; Calculate DAX formulas; Share secure government reports.",
            "provider": "iGOT Karmayogi"
        },
        {
            "course_id": "IG-AN-087",
            "title": "Applied Statistics for Analysts",
            "skill_id": skill_objs["Statistics"].id,
            "category": "Analytics",
            "difficulty": "Intermediate",
            "duration": "3h 45m",
            "lessons_count": 7,
            "description": "Interpret evidence, uncertainty and trends with statistical fluency.",
            "learning_outcomes": "Evaluate sample distributions; Test statistical hypothesis; Explain variance to leadership.",
            "provider": "iGOT Karmayogi"
        }
    ]
    for c in igot_courses:
        db.add(IGOTResource(**c))
    db.flush()

    # 5. Seed Users & Employee Profiles (10 employees)
    employees_data = [
        {"name": "Aarav Mehta", "email": "employee@sih.demo", "role": "employee", "code": "SIH-1042", "dept": "Digital Services", "cur_role": "Junior Data Analyst", "target_role": "Senior Data Analyst", "pass": "Employee@123"},
        {"name": "Priya Nair", "email": "hr@sih.demo", "role": "hr", "code": "SIH-HR-001", "dept": "Human Resources", "cur_role": "Senior Data Analyst", "target_role": "Senior Data Analyst", "pass": "HR@123"},
        {"name": "Sana Iyer", "email": "sana.iyer@sih.demo", "role": "employee", "code": "SIH-1088", "dept": "Finance", "cur_role": "Finance Officer", "target_role": "Finance Officer", "pass": "Demo@123"},
        {"name": "Kabir Nair", "email": "kabir.nair@sih.demo", "role": "employee", "code": "SIH-1114", "dept": "Operations", "cur_role": "Program Coordinator", "target_role": "Program Coordinator", "pass": "Demo@123"},
        {"name": "Diya Rao", "email": "diya.rao@sih.demo", "role": "employee", "code": "SIH-1206", "dept": "Digital Services", "cur_role": "Cybersecurity Analyst", "target_role": "Cybersecurity Analyst", "pass": "Demo@123"},
        {"name": "Rehan Kapoor", "email": "rehan.kapoor@sih.demo", "role": "employee", "code": "SIH-1261", "dept": "Digital Services", "cur_role": "Junior Data Analyst", "target_role": "Senior Data Analyst", "pass": "Demo@123"},
        {"name": "Anika Bose", "email": "anika.bose@sih.demo", "role": "employee", "code": "SIH-1280", "dept": "Administration", "cur_role": "Program Coordinator", "target_role": "Program Coordinator", "pass": "Demo@123"},
        {"name": "Vihaan Shah", "email": "vihaan.shah@sih.demo", "role": "employee", "code": "SIH-1305", "dept": "Finance", "cur_role": "Finance Officer", "target_role": "Finance Officer", "pass": "Demo@123"},
        {"name": "Mira Das", "email": "mira.das@sih.demo", "role": "employee", "code": "SIH-1341", "dept": "Operations", "cur_role": "Program Coordinator", "target_role": "Program Coordinator", "pass": "Demo@123"},
        {"name": "Arjun Pillai", "email": "arjun.pillai@sih.demo", "role": "employee", "code": "SIH-1379", "dept": "Digital Services", "cur_role": "Junior Data Analyst", "target_role": "Senior Data Analyst", "pass": "Demo@123"}
    ]

    for emp in employees_data:
        user = User(
            email=emp["email"],
            hashed_password=get_password_hash(emp["pass"]),
            full_name=emp["name"],
            role=emp["role"],
            department=emp["dept"]
        )
        db.add(user)
        db.flush()

        cur_role_id = role_objs[emp["cur_role"]].id if emp["cur_role"] in role_objs else None
        target_role_id = role_objs[emp["target_role"]].id if emp["target_role"] in role_objs else None

        profile = EmployeeProfile(
            user_id=user.id,
            employee_code=emp["code"],
            current_role_id=cur_role_id,
            target_role_id=target_role_id,
            department=emp["dept"],
            readiness_score=72.0 if emp["code"] == "SIH-1042" else 78.5
        )
        db.add(profile)
        db.flush()

        # Add initial employee skills for Aarav Mehta (SIH-1042)
        if emp["code"] == "SIH-1042":
            sample_skills = [
                ("Python", 4), ("SQL", 2), ("Data Analytics", 3),
                ("Machine Learning", 2), ("Cloud Computing", 2),
                ("Communication", 4), ("Leadership", 3), ("Problem Solving", 4),
                ("Power BI", 1), ("Statistics", 3)
            ]
            for sname, lvl in sample_skills:
                db.add(EmployeeSkill(profile_id=profile.id, skill_id=skill_objs[sname].id, current_level=lvl))
            
            # Gaps for Senior Data Analyst
            db.add(SkillGap(profile_id=profile.id, target_role_id=role_objs["Senior Data Analyst"].id, skill_id=skill_objs["SQL"].id, current_level=2, required_level=4, gap_level=2, priority="High"))
            db.add(SkillGap(profile_id=profile.id, target_role_id=role_objs["Senior Data Analyst"].id, skill_id=skill_objs["Power BI"].id, current_level=1, required_level=4, gap_level=3, priority="High"))

    # 6. Seed a Default Quiz with Questions
    quiz = Quiz(
        skill_id=skill_objs["SQL"].id,
        title="SQL Fundamentals Knowledge Check",
        difficulty="Intermediate",
        question_count=5,
        question_type="Multiple Choice"
    )
    db.add(quiz)
    db.flush()

    q_data = [
        ("Which SQL clause is used to filter aggregated grouped results?", "WHERE", "HAVING", "ORDER BY", "GROUP BY", 1, "HAVING filters aggregated groups after GROUP BY is applied."),
        ("Which join returns all rows from the left table and matching rows from the right?", "INNER JOIN", "CROSS JOIN", "LEFT JOIN", "SELF JOIN", 2, "LEFT JOIN preserves all rows from the left-hand table."),
        ("What does an index primarily improve in a database?", "Query readability", "Data retrieval speed", "Storage capacity", "Data normalization", 1, "Indexes help the database query engine locate rows efficiently."),
        ("Which function counts non-null values in a column?", "COUNT(*)", "SUM()", "COUNT(column)", "AVG()", 2, "COUNT(column) counts rows containing non-null values in that specific column."),
        ("What is a primary key?", "A unique row identifier", "A sort order", "A database password", "A table relationship", 0, "A primary key uniquely identifies each record and cannot contain NULL values.")
    ]
    for q_text, a, b, c, d, correct, exp in q_data:
        db.add(Question(
            quiz_id=quiz.id,
            question_text=q_text,
            option_a=a,
            option_b=b,
            option_c=c,
            option_d=d,
            correct_option=correct,
            explanation=exp
        ))

    db.commit()
    db.close()
