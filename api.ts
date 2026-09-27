import { Course, Skill } from './types'

const API_BASE = '/api'

export async function loginApi(email: string, password: string, role: string) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('Backend unavailable, using client store authentication', err)
  }
  // Client-side authentication fallback
  const valid = role === 'employee'
    ? email.toLowerCase() === 'employee@sih.demo' && password === 'Employee@123'
    : email.toLowerCase() === 'hr@sih.demo' && password === 'HR@123'

  if (!valid) {
    throw new Error('Those demo credentials do not match the selected account type.')
  }
  return {
    access_token: 'mock-jwt-token-sih26101',
    role,
    full_name: role === 'hr' ? 'Priya Nair' : 'Aarav Mehta',
    email,
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${API_BASE}/skills`)
    if (res.ok) {
      return await res.json()
    }
  } catch (e) {
    // fallback
  }
  return [
    { skill: 'Python', current: 4, required: 4, group: 'Technical' },
    { skill: 'SQL', current: 2, required: 4, group: 'Technical' },
    { skill: 'Data analytics', current: 3, required: 4, group: 'Technical' },
    { skill: 'Machine learning', current: 2, required: 3, group: 'Technical' },
    { skill: 'Cloud computing', current: 2, required: 3, group: 'Technical' },
    { skill: 'Communication', current: 4, required: 4, group: 'Professional' },
    { skill: 'Leadership', current: 3, required: 4, group: 'Professional' },
    { skill: 'Problem solving', current: 4, required: 4, group: 'Professional' },
    { skill: 'Power BI', current: 1, required: 4, group: 'Technical' },
    { skill: 'Statistics', current: 3, required: 3, group: 'Technical' },
  ]
}

export async function fetchIgotCourses(skill?: string): Promise<Course[]> {
  try {
    const url = skill && skill !== 'All skills'
      ? `${API_BASE}/igot/courses?skill=${encodeURIComponent(skill)}`
      : `${API_BASE}/igot/courses`
    const res = await fetch(url)
    if (res.ok) {
      return await res.json()
    }
  } catch (e) {
    // fallback
  }
  const defaultCourses: Course[] = [
    {
      id: 'IG-DA-104',
      title: 'SQL Fundamentals for Public Data',
      skill: 'SQL',
      level: 'Beginner',
      duration: '4h 20m',
      lessons: 8,
      color: 'mint',
      description: 'Build confident querying habits with practical, public-sector datasets.',
      progress: 38,
      outcomes: ['Write clean filtering queries', 'Master GROUP BY & aggregations', 'Relational JOIN operations'],
      provider: 'iGOT Karmayogi'
    },
    {
      id: 'IG-BI-212',
      title: 'Power BI: From Data to Decisions',
      skill: 'Power BI',
      level: 'Intermediate',
      duration: '6h 10m',
      lessons: 12,
      color: 'gold',
      description: 'Create clear reports and interactive dashboards for better administrative decisions.',
      progress: 0,
      outcomes: ['Design automated dashboards', 'Write DAX formulas', 'Publish secure reports'],
      provider: 'iGOT Karmayogi'
    },
    {
      id: 'IG-AN-087',
      title: 'Applied Statistics for Analysts',
      skill: 'Statistics',
      level: 'Intermediate',
      duration: '3h 45m',
      lessons: 7,
      color: 'blue',
      description: 'Interpret evidence, uncertainty and trends with statistical fluency.',
      progress: 0,
      outcomes: ['Probability distributions', 'Hypothesis testing', 'Public metrics evaluation'],
      provider: 'iGOT Karmayogi'
    }
  ]
  if (skill && skill !== 'All skills') {
    return defaultCourses.filter(c => c.skill === skill)
  }
  return defaultCourses
}

export async function analyzeSkillGap(currentRole: string, targetRole: string) {
  try {
    const res = await fetch(`${API_BASE}/skill-gap/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_role: currentRole, target_role: targetRole })
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (e) {
    // fallback
  }
  return {
    gaps: [
      { skill: 'SQL', current: 2, required: 4, gap: 2, priority: 'High' },
      { skill: 'Power BI', current: 1, required: 4, gap: 3, priority: 'High' },
      { skill: 'Python', current: 4, required: 4, gap: 0, priority: 'Low' },
      { skill: 'Statistics', current: 3, required: 3, gap: 0, priority: 'Low' },
    ],
    summary: 'Your highest-priority development areas are SQL and Power BI.'
  }
}
