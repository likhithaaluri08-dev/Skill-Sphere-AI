export interface Skill {
  skill: string
  current: number
  required: number
  group: 'Technical' | 'Professional'
  last_assessed?: string
}

export interface SkillGap {
  skill: string
  current: number
  required: number
  gap: number
  priority?: 'High' | 'Medium' | 'Low'
}

export interface LearningDataPoint {
  month: string
  hours: number
  readiness: number
}

export interface Course {
  id: string
  title: string
  skill: string
  level: string
  duration: string
  lessons: number
  color: 'mint' | 'gold' | 'blue' | 'lilac'
  description: string
  progress: number
  outcomes?: string[]
  provider?: string
}

export interface Employee {
  id: string
  name: string
  department: string
  role: string
  assessed: string
  gaps: number
  progress: number
  email?: string
}

export interface RoleMappingItem {
  name: string
  category: string
  skills: [string, number, number][] // [skill, required_level, importance]
}

export interface Question {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface UserSession {
  name: string
  email: string
  role: 'employee' | 'hr'
  department: string
  token?: string
}
