from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="employee")  # "employee" | "hr"
    department = Column(String(100), default="Digital Services")
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("EmployeeProfile", back_populates="user", uselist=False)
    uploaded_contents = relationship("UploadedContent", back_populates="user")
    quiz_attempts = relationship("QuizAttempt", back_populates="user")


class JobRole(Base):
    __tablename__ = "job_roles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), unique=True, index=True, nullable=False)
    department = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    required_skills = relationship("RoleRequiredSkill", back_populates="role")


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), default="Technical")  # "Technical" | "Professional"
    description = Column(Text, nullable=True)

    role_requirements = relationship("RoleRequiredSkill", back_populates="skill")
    employee_skills = relationship("EmployeeSkill", back_populates="skill")
    learning_resources = relationship("LearningResource", back_populates="skill")
    igot_resources = relationship("IGOTResource", back_populates="skill")


class RoleRequiredSkill(Base):
    __tablename__ = "role_required_skills"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    required_level = Column(Integer, default=3)  # 1-5 scale
    importance = Column(Integer, default=3)      # 1-5 scale (5=Critical, 4=High, 3=Medium)

    role = relationship("JobRole", back_populates="required_skills")
    skill = relationship("Skill", back_populates="role_requirements")


class EmployeeProfile(Base):
    __tablename__ = "employee_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    employee_code = Column(String(50), unique=True, index=True, nullable=False)
    current_role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=True)
    target_role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=True)
    department = Column(String(100), default="Digital Services")
    readiness_score = Column(Float, default=72.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="profile")
    current_role = relationship("JobRole", foreign_keys=[current_role_id])
    target_role = relationship("JobRole", foreign_keys=[target_role_id])
    skills = relationship("EmployeeSkill", back_populates="profile")
    gaps = relationship("SkillGap", back_populates="profile")
    recommendations = relationship("Recommendation", back_populates="profile")
    learning_progress = relationship("LearningProgress", back_populates="profile")


class EmployeeSkill(Base):
    __tablename__ = "employee_skills"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    current_level = Column(Integer, default=2)  # 1-5 scale
    last_assessed_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("EmployeeProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="employee_skills")


class SkillGap(Base):
    __tablename__ = "skill_gaps"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    target_role_id = Column(Integer, ForeignKey("job_roles.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    current_level = Column(Integer, default=1)
    required_level = Column(Integer, default=4)
    gap_level = Column(Integer, default=3)
    priority = Column(String(50), default="High")  # "High" | "Medium" | "Low"

    profile = relationship("EmployeeProfile", back_populates="gaps")
    target_role = relationship("JobRole")
    skill = relationship("Skill")


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    provider = Column(String(100), default="SkillSphere AI")
    duration_minutes = Column(Integer, default=120)
    level = Column(String(50), default="Intermediate")
    resource_url = Column(String(255), nullable=True)

    skill = relationship("Skill", back_populates="learning_resources")


class IGOTResource(Base):
    __tablename__ = "igot_resources"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    category = Column(String(100), default="Data & Analytics")
    difficulty = Column(String(50), default="Intermediate")
    duration = Column(String(50), default="4h 20m")
    lessons_count = Column(Integer, default=8)
    description = Column(Text, nullable=True)
    learning_outcomes = Column(Text, nullable=True)
    provider = Column(String(100), default="iGOT Karmayogi")

    skill = relationship("Skill", back_populates="igot_resources")
    recommendations = relationship("Recommendation", back_populates="igot_resource")
    progress_records = relationship("LearningProgress", back_populates="igot_resource")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    igot_resource_id = Column(Integer, ForeignKey("igot_resources.id"), nullable=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    reason = Column(Text, nullable=False)
    match_score = Column(Integer, default=90)
    status = Column(String(50), default="Recommended")  # "Recommended" | "Started" | "Completed"
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("EmployeeProfile", back_populates="recommendations")
    igot_resource = relationship("IGOTResource", back_populates="recommendations")
    skill = relationship("Skill")


class UploadedContent(Base):
    __tablename__ = "uploaded_content"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(50), nullable=False)
    file_size_bytes = Column(Integer, default=0)
    extracted_topics = Column(Text, nullable=True)
    key_concepts = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="uploaded_contents")
    quizzes = relationship("Quiz", back_populates="content")


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    content_id = Column(Integer, ForeignKey("uploaded_content.id"), nullable=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)
    title = Column(String(255), nullable=False)
    difficulty = Column(String(50), default="Intermediate")
    question_count = Column(Integer, default=5)
    question_type = Column(String(50), default="Multiple Choice")
    created_at = Column(DateTime, default=datetime.utcnow)

    content = relationship("UploadedContent", back_populates="quizzes")
    skill = relationship("Skill")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String(255), nullable=False)
    option_b = Column(String(255), nullable=False)
    option_c = Column(String(255), nullable=False)
    option_d = Column(String(255), nullable=False)
    correct_option = Column(Integer, default=0)  # 0: A, 1: B, 2: C, 3: D
    explanation = Column(Text, nullable=True)

    quiz = relationship("Quiz", back_populates="questions")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    score = Column(Integer, default=0)
    total_questions = Column(Integer, default=5)
    percentage = Column(Float, default=0.0)
    feedback_strengths = Column(Text, nullable=True)
    feedback_weaknesses = Column(Text, nullable=True)
    recommended_next_step = Column(Text, nullable=True)
    before_skill_level = Column(Integer, default=2)
    after_skill_level = Column(Integer, default=3)
    attempted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="quiz_attempts")
    quiz = relationship("Quiz", back_populates="attempts")


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    profile_id = Column(Integer, ForeignKey("employee_profiles.id"), nullable=False)
    igot_resource_id = Column(Integer, ForeignKey("igot_resources.id"), nullable=True)
    progress_percentage = Column(Integer, default=0)
    hours_spent = Column(Float, default=0.0)
    status = Column(String(50), default="In Progress")
    last_accessed = Column(DateTime, default=datetime.utcnow)

    profile = relationship("EmployeeProfile", back_populates="learning_progress")
    igot_resource = relationship("IGOTResource", back_populates="progress_records")
