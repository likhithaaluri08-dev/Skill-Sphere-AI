from typing import List, Optional, Any
from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str
    email: str

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "employee"

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "employee"
    department: Optional[str] = "Digital Services"

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    department: str

    class Config:
        from_attributes = True

class SkillItem(BaseModel):
    id: Optional[int] = None
    name: str
    category: str = "Technical"
    current_level: int = 1
    required_level: int = 4
    importance: Optional[int] = 3

class SkillOut(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class SkillCreate(BaseModel):
    name: str
    category: str = "Technical"
    description: Optional[str] = None

class SkillGapItem(BaseModel):
    skill: str
    current: int
    required: int
    gap: int
    priority: str = "High"

class SkillGapAnalyzeRequest(BaseModel):
    employee_id: Optional[int] = 1
    current_role: str
    target_role: str

class RecommendationItem(BaseModel):
    id: int
    course_id: str
    title: str
    skill: str
    current_level: int
    required_level: int
    why_recommended: str
    provider: str
    duration: str
    match_score: int
    progress: int

class IGOTCourse(BaseModel):
    id: str
    title: str
    skill: str
    level: str
    duration: str
    lessons: int
    color: str
    description: str
    outcomes: List[str]
    progress: int

class QuestionSchema(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_option: int
    explanation: str

class QuizDetail(BaseModel):
    id: int
    title: str
    difficulty: str
    question_count: int
    questions: List[QuestionSchema]

class QuizSubmitRequest(BaseModel):
    answers: dict[int, int]  # question_id or index -> chosen option index

class QuizResultResponse(BaseModel):
    score: int
    total: int
    percentage: float
    strengths: str
    needs_improvement: str
    recommended_next_step: str
    before_skill: str
    before_level: int
    after_level: int
    updated_gap: int

class RoleCreateRequest(BaseModel):
    title: str
    department: str
    skills: List[dict] # [{"skill": "SQL", "required": 4, "importance": 5}]

class RoleOut(BaseModel):
    id: int
    title: str
    department: str
    skills_count: int
