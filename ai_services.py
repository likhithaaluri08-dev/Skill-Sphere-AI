from typing import List, Dict, Any

class SkillAssessmentAI:
    """Skill Assessment AI: Current skills -> Skill Profile"""
    @staticmethod
    def analyze_profile(raw_skills: List[Dict[str, Any]]) -> Dict[str, Any]:
        total_score = sum(s.get("current_level", 2) for s in raw_skills)
        max_possible = len(raw_skills) * 5
        readiness_pct = round((total_score / max(max_possible, 1)) * 100, 1)
        
        strongest = [s["name"] for s in raw_skills if s.get("current_level", 0) >= 4]
        needs_work = [s["name"] for s in raw_skills if s.get("current_level", 0) <= 2]
        
        return {
            "readiness_score": readiness_pct,
            "skills_assessed_count": len(raw_skills),
            "strongest_skills": strongest,
            "priority_skills": needs_work,
            "last_assessed": "12 Jun 2026"
        }

class SkillGapAI:
    """Skill Gap AI: Current skills + required skills -> Skill gaps"""
    @staticmethod
    def calculate_gaps(current_skills: Dict[str, int], required_skills: Dict[str, int]) -> List[Dict[str, Any]]:
        gaps = []
        for skill_name, req_level in required_skills.items():
            curr_level = current_skills.get(skill_name, 1)
            gap_amount = max(0, req_level - curr_level)
            priority = "High" if gap_amount >= 2 else ("Medium" if gap_amount == 1 else "Low")
            gaps.append({
                "skill": skill_name,
                "current": curr_level,
                "required": req_level,
                "gap": gap_amount,
                "priority": priority
            })
        # Sort highest gap first
        gaps.sort(key=lambda x: x["gap"], reverse=True)
        return gaps

class RecommendationAI:
    """Recommendation AI: Skill gaps + learning resources -> Personalized recommendations"""
    @staticmethod
    def generate_recommendations(gaps: List[Dict[str, Any]], target_role: str) -> List[Dict[str, Any]]:
        recs = []
        for g in gaps:
            if g["gap"] > 0:
                skill = g["skill"]
                if skill == "SQL":
                    recs.append({
                        "id": 1,
                        "course_id": "IG-DA-104",
                        "title": "SQL Fundamentals for Public Data",
                        "skill": "SQL",
                        "current_level": g["current"],
                        "required_level": g["required"],
                        "why_recommended": f"You have a {g['gap']}-level SQL skill gap for your target role of {target_role}. This hands-on module covers relational query design and database filtering.",
                        "provider": "iGOT Karmayogi",
                        "duration": "4h 20m",
                        "match_score": 95,
                        "progress": 38
                    })
                elif skill == "Power BI":
                    recs.append({
                        "id": 2,
                        "course_id": "IG-BI-212",
                        "title": "Power BI: From Data to Decisions",
                        "skill": "Power BI",
                        "current_level": g["current"],
                        "required_level": g["required"],
                        "why_recommended": f"Power BI has a high gap of {g['gap']} levels for {target_role}. Building reports and interactive government dashboards is required at level {g['required']}.",
                        "provider": "iGOT Karmayogi",
                        "duration": "6h 10m",
                        "match_score": 91,
                        "progress": 0
                    })
                elif skill == "Data Analytics":
                    recs.append({
                        "id": 3,
                        "course_id": "IG-AN-087",
                        "title": "Applied Statistics & Analytics for Public Sector",
                        "skill": "Data Analytics",
                        "current_level": g["current"],
                        "required_level": g["required"],
                        "why_recommended": f"Strengthen empirical analysis and evidence-based reporting to fulfill senior role competencies.",
                        "provider": "iGOT Karmayogi",
                        "duration": "3h 45m",
                        "match_score": 86,
                        "progress": 0
                    })
        return recs

class ContentAI:
    """Content AI: Uploaded content -> Topics + concepts"""
    @staticmethod
    def extract_topics_and_concepts(filename: str, file_type: str) -> Dict[str, Any]:
        return {
            "filename": filename,
            "file_type": file_type,
            "detected_topics": [
                "Relational Database Architecture",
                "SQL Query Filtering & Aggregation",
                "Table Joins & Integrity Constraints",
                "Index Optimization & Retrieval Performance"
            ],
            "key_concepts": [
                "HAVING vs WHERE clauses",
                "Primary and foreign key enforcement",
                "INNER vs LEFT JOIN set intersections",
                "B-Tree index scan performance"
            ],
            "extracted_token_count": 2840,
            "pipeline_stages": [
                {"stage": "Content Uploaded", "status": "completed"},
                {"stage": "Content Extraction", "status": "completed"},
                {"stage": "Topic Detection", "status": "completed"},
                {"stage": "Key Concept Extraction", "status": "completed"},
                {"stage": "AI Question Generation", "status": "ready"}
            ]
        }

class QuizAI:
    """Quiz AI: Topics + concepts -> MCQs + answers + explanations"""
    @staticmethod
    def generate_quiz(topic: str = "SQL Fundamentals", count: int = 5, difficulty: str = "Intermediate") -> List[Dict[str, Any]]:
        bank = [
            {
                "id": 1,
                "question": "Which SQL clause is used to filter aggregated group results?",
                "options": ["WHERE", "HAVING", "ORDER BY", "GROUP BY"],
                "correct_option": 1,
                "explanation": "HAVING filters grouped and aggregated rows after the GROUP BY operation occurs, whereas WHERE filters individual rows before aggregation."
            },
            {
                "id": 2,
                "question": "Which join returns all rows from the left table and matched rows from the right table?",
                "options": ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "FULL OUTER JOIN"],
                "correct_option": 2,
                "explanation": "LEFT JOIN guarantees all records from the left-hand table are preserved, filling right-hand columns with NULL if there is no match."
            },
            {
                "id": 3,
                "question": "What is the primary benefit of creating an index on a frequently queried column?",
                "options": ["Reduces table storage size", "Accelerates row retrieval speed", "Eliminates duplicate values", "Formats the query output"],
                "correct_option": 1,
                "explanation": "Indexes allow the database query engine to pinpoint target records rapidly without requiring full sequential table scans."
            },
            {
                "id": 4,
                "question": "Which SQL aggregate function counts only non-null values in the specified column?",
                "options": ["COUNT(*)", "SUM()", "COUNT(column_name)", "TOTAL()"],
                "correct_option": 2,
                "explanation": "COUNT(column_name) ignores NULL entries, while COUNT(*) tallies every record regardless of nullability."
            },
            {
                "id": 5,
                "question": "What is the key characteristic of a primary key in a relational database?",
                "options": ["Must uniquely identify each row and cannot be NULL", "Can accept duplicate numbers if indexed", "Only allows alphanumeric strings", "Must link directly to a remote foreign server"],
                "correct_option": 0,
                "explanation": "A primary key constraint enforces entity integrity by requiring unique, non-null values for every record."
            }
        ]
        return bank[:count]

class FeedbackAI:
    """Feedback AI: Quiz performance -> Feedback + next learning step"""
    @staticmethod
    def evaluate_performance(score: int, total: int, skill: str = "SQL", current_level: int = 2) -> Dict[str, Any]:
        pct = round((score / max(total, 1)) * 100, 1)
        improved_level = current_level + (1 if pct >= 70 else 0)
        improved_level = min(5, improved_level)
        
        strengths = "Solid grasp of core relational fundamentals, filtering constraints, and primary key properties."
        needs_work = "Multi-table JOIN operations, query indexing nuances, and complex grouping aggregates."
        next_step = f"Complete an intermediate {skill} practical module on iGOT Karmayogi, then test advanced query optimization."

        return {
            "score": score,
            "total": total,
            "percentage": pct,
            "passed": pct >= 70,
            "strengths": strengths,
            "needs_improvement": needs_work,
            "recommended_next_step": next_step,
            "before_skill": skill,
            "before_level": current_level,
            "after_level": improved_level,
            "updated_gap": max(0, 4 - improved_level)
        }
