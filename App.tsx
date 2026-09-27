import { FormEvent, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import {
  Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Award, BarChart3, Bell,
  BookOpen, BrainCircuit, BriefcaseBusiness, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, Clock3, CloudUpload, Compass, Download, FileText, Filter, Gauge,
  Heart, Layers3, LayoutDashboard, LogOut, Menu, MoreHorizontal, Play, Plus, Search,
  Settings2, ShieldCheck, Sparkles, Target, TrendingUp, Upload, Users, X, Zap, Printer
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, LineChart,
  Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

// --- CORE DATASETS ---
const initialSkillData = [
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

const courses = [
  {
    id: 'IG-DA-104',
    title: 'SQL Fundamentals for Public Data',
    skill: 'SQL',
    level: 'Beginner',
    duration: '4h 20m',
    lessons: 8,
    color: 'mint',
    description: 'Build confident querying habits with practical, public-sector datasets and hands-on exercises.',
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
    description: 'Create clear reports and interactive dashboards for better public administration decisions.',
    progress: 0,
    outcomes: ['Design automated executive dashboards', 'Write DAX formulas', 'Publish secure government reports'],
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
  },
  {
    id: 'IG-SEC-301',
    title: 'Cybersecurity Baseline for Public Servants',
    skill: 'Cybersecurity',
    level: 'Beginner',
    duration: '2h 30m',
    lessons: 5,
    color: 'lilac',
    description: 'Information security protocols, password hygiene, and safe government data handling standards.',
    progress: 0,
    outcomes: ['Threat prevention', 'MFA hygiene', 'Incident escalation'],
    provider: 'iGOT Karmayogi'
  }
]

const staff = [
  { id: 'SIH-1042', name: 'Aarav Mehta', department: 'Digital Services', role: 'Junior Data Analyst', assessed: '8 / 10', gaps: 3, progress: 68, email: 'aarav.mehta@sih.demo' },
  { id: 'SIH-1088', name: 'Sana Iyer', department: 'Finance', role: 'Finance Officer', assessed: '12 / 15', gaps: 2, progress: 82, email: 'sana.iyer@sih.demo' },
  { id: 'SIH-1114', name: 'Kabir Nair', department: 'Operations', role: 'Program Coordinator', assessed: '6 / 9', gaps: 4, progress: 45, email: 'kabir.nair@sih.demo' },
  { id: 'SIH-1206', name: 'Diya Rao', department: 'Digital Services', role: 'Cybersecurity Analyst', assessed: '11 / 14', gaps: 2, progress: 74, email: 'diya.rao@sih.demo' },
  { id: 'SIH-1261', name: 'Rehan Kapoor', department: 'Digital Services', role: 'Cloud Engineer', assessed: '9 / 12', gaps: 3, progress: 61, email: 'rehan.kapoor@sih.demo' },
  { id: 'SIH-1280', name: 'Anika Bose', department: 'Administration', role: 'HR Specialist', assessed: '7 / 11', gaps: 2, progress: 88, email: 'anika.bose@sih.demo' },
  { id: 'SIH-1305', name: 'Vihaan Shah', department: 'Finance', role: 'Data Analyst', assessed: '10 / 13', gaps: 3, progress: 57, email: 'vihaan.shah@sih.demo' },
  { id: 'SIH-1341', name: 'Mira Das', department: 'Operations', role: 'Program Coordinator', assessed: '8 / 12', gaps: 1, progress: 92, email: 'mira.das@sih.demo' },
  { id: 'SIH-1379', name: 'Arjun Pillai', department: 'Digital Services', role: 'Junior Data Analyst', assessed: '9 / 12', gaps: 3, progress: 63, email: 'arjun.pillai@sih.demo' },
  { id: 'SIH-1402', name: 'Tara Menon', department: 'Administration', role: 'Policy Officer', assessed: '6 / 10', gaps: 4, progress: 39, email: 'tara.menon@sih.demo' },
]

const employeeNav = [
  { label: 'OVERVIEW', items: [{ to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
  { label: 'MY DEVELOPMENT', items: [
    { to: '/employee/skills', label: 'My Skills', icon: Layers3 },
    { to: '/employee/skill-gap', label: 'Skill Gap Analysis', icon: Target },
    { to: '/employee/recommendations', label: 'Learning Path', icon: Sparkles },
    { to: '/employee/igot', label: 'iGOT Resources', icon: BookOpen },
  ] },
  { label: 'MY ACTIVITY', items: [
    { to: '/employee/quiz-generator', label: 'AI Quiz Generator', icon: BrainCircuit },
    { to: '/employee/assessments', label: 'Assessments', icon: FileText },
    { to: '/employee/progress', label: 'My Progress', icon: TrendingUp },
    { to: '/employee/profile', label: 'My Profile', icon: Users },
  ] },
]

const hrNav = [
  { label: 'WORKFORCE', items: [
    { to: '/hr/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/hr/employees', label: 'Employees', icon: Users },
    { to: '/hr/skills', label: 'Skills Inventory', icon: Layers3 },
    { to: '/hr/skill-gap', label: 'Workforce Skill Gaps', icon: Target },
  ] },
  { label: 'INTELLIGENCE', items: [
    { to: '/hr/role-mapping', label: 'Role & Skill Mapping', icon: BriefcaseBusiness },
    { to: '/hr/analytics', label: 'Workforce Analytics', icon: BarChart3 },
    { to: '/hr/reports', label: 'Reports', icon: FileText },
  ] },
]

const headingMap: Record<string, [string, string]> = {
  '/employee/dashboard': ['Your Skill Intelligence', 'A clear view of current capability and target role readiness.'],
  '/employee/skills': ['My Skill Profile', 'Your capabilities, assessed against the roles you want to grow into.'],
  '/employee/skill-gap': ['Skill Gap Analysis', 'Compare your current capability with the requirements of your next role.'],
  '/employee/recommendations': ['Your Personalized Learning Path', 'AI-recommended learning connecting your highest-priority skill gaps.'],
  '/employee/igot': ['iGOT Learning Resources', 'SkillSphere AI connects identified skill gaps with relevant resources in the iGOT ecosystem.'],
  '/employee/quiz-generator': ['AI Quiz Generator', 'Turn learning material into a focused, adaptive knowledge check.'],
  '/employee/assessments': ['Assessments & Feedback', 'Review recent evaluations and turn results into verified skill progress.'],
  '/employee/progress': ['My Progress', 'See how consistent learning is changing your skill readiness.'],
  '/employee/profile': ['My Profile', 'Your professional profile and personalized development preferences.'],
  '/hr/dashboard': ['Workforce Skill Intelligence', 'A live view of capability, participation and opportunity across your organization.'],
  '/hr/employees': ['Workforce Directory', 'Explore employee capability profiles and their development activity.'],
  '/hr/skills': ['Skills Inventory', 'A comprehensive view of competencies mapped across the organization.'],
  '/hr/skill-gap': ['Workforce Skill Gaps', 'Understand where role requirements and current capability diverge.'],
  '/hr/role-mapping': ['Role & Skill Mapping', 'Define the competencies, proficiency levels and criticality for each role.'],
  '/hr/analytics': ['Workforce Analytics', 'Multi-dimensional skill intelligence by department, role and time period.'],
  '/hr/reports': ['Executive Reports', 'Generate and export a snapshot of workforce learning and skill readiness.'],
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  return hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'
}

// --- MAIN APP ROUTER ---
function App() {
  const [user, setUser] = useState(() => localStorage.getItem('sph-user') || '')
  const [role, setRole] = useState(() => localStorage.getItem('sph-role') || '')
  const [skillLevel, setSkillLevel] = useState(() => Number(localStorage.getItem('sph-sql')) || 2)
  const location = useLocation()
  const navigate = useNavigate()

  const login = async (email: string, password: string, selectedRole: string) => {
    const fullName = selectedRole === 'hr' ? 'Priya Nair' : 'Aarav Mehta'
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(900),
      })
      if (response.ok) {
        const result = await response.json()
        localStorage.setItem('sph-token', result.access_token)
        localStorage.setItem('sph-api-name', result.user.name)
      }
    } catch {
      localStorage.removeItem('sph-token')
    }
    setUser(fullName)
    setRole(selectedRole)
    localStorage.setItem('sph-user', fullName)
    localStorage.setItem('sph-role', selectedRole)
    navigate(selectedRole === 'hr' ? '/hr/dashboard' : '/employee/dashboard')
  }

  const logout = () => {
    localStorage.removeItem('sph-user')
    localStorage.removeItem('sph-role')
    localStorage.removeItem('sph-token')
    setUser('')
    setRole('')
    navigate('/')
  }

  const completeQuiz = () => {
    const next = Math.min(5, skillLevel + 1)
    setSkillLevel(next)
    localStorage.setItem('sph-sql', String(next))
    navigate('/employee/assessments?result=1')
  }

  const protectedPath = location.pathname.startsWith('/employee') || location.pathname.startsWith('/hr')
  if (protectedPath && !user) return <Navigate to="/login" replace />
  if (role === 'employee' && location.pathname.startsWith('/hr')) return <Navigate to="/employee/dashboard" replace />
  if (role === 'hr' && location.pathname.startsWith('/employee')) return <Navigate to="/hr/dashboard" replace />

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route path="/employee/*" element={<Workspace role="employee" name={user} onLogout={logout} skillLevel={skillLevel} onCompleteQuiz={completeQuiz} />} />
      <Route path="/hr/*" element={<Workspace role="hr" name={user} onLogout={logout} skillLevel={skillLevel} onCompleteQuiz={completeQuiz} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// --- LANDING PAGE ---
function Landing() {
  const steps = [
    { n: '01', title: 'Assess', desc: 'Evaluate existing skills through transparent baseline evaluations.' },
    { n: '02', title: 'Understand', desc: 'Build an employee skill profile with objective capability metrics.' },
    { n: '03', title: 'Identify', desc: 'Detect job-role-specific skill gaps against target career roles.' },
    { n: '04', title: 'Personalize', desc: 'Recommend relevant learning resources from the iGOT ecosystem.' },
    { n: '05', title: 'Evaluate', desc: 'Generate AI-powered quizzes and assessments from learning material.' },
    { n: '06', title: 'Improve', desc: 'Update the skill profile based on verified performance evidence.' },
  ]

  return (
    <div className="landing">
      {/* Navbar */}
      <header className="site-nav">
        <Link to="/" className="brand">
          <span className="brand-mark"><Layers3 size={19} /></span>
          <span>SkillSphere <b>AI</b></span>
        </Link>
        <nav>
          <a href="#how">How It Works</a>
          <a href="#platform">Why SkillSphere AI</a>
          <a href="#igot">iGOT Integration</a>
          <a href="#loop">Closed Loop</a>
          <a href="#about">About</a>
        </nav>
        <div className="nav-actions">
          <Link className="nav-login" to="/login">Login</Link>
          <Link className="button button-dark button-small" to="/login">
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> SIH26101 · SMART INDIA HACKATHON
            </div>
            <h1>
              Build Skills.<br />
              <span>Bridge Gaps.</span><br />
              Become Future-Ready.
            </h1>
            <p className="hero-sub">
              AI-powered skill intelligence that understands what employees know, identifies what they need, and connects them to personalized learning.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="button button-dark">
                Explore Platform <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="button button-light">
                <Play size={14} fill="currentColor" /> Login to Demo
              </Link>
            </div>
            <div className="hero-note">
              <ShieldCheck size={16} /> Government-grade workforce intelligence layer for iGOT Karmayogi
            </div>
          </div>

          {/* Hero Visual: Employee Profile -> AI Skill Analysis -> Skill Gap -> Learning -> Assessment -> Skill Growth */}
          <div className="hero-art" aria-label="AI workforce intelligence workflow">
            <div className="art-top">
              <span>SKILL INTELLIGENCE ENGINE</span>
              <span className="live-dot">LIVE MODEL</span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="core">
              <div className="core-icon"><BrainCircuit size={28} /></div>
              <span>SKILL<br />SPHERE</span>
              <b>AI</b>
            </div>

            <div className="node node-profile">
              <span className="node-icon peach"><Users size={16} /></span>
              <span><b>Employee Profile</b><small>8 skills assessed</small></span>
              <CheckCircle2 className="node-check" size={15} />
            </div>

            <div className="node node-gap">
              <span className="node-icon yellow"><Target size={16} /></span>
              <span><b>Skill Gap Found</b><small>SQL · Priority 1 (+2)</small></span>
            </div>

            <div className="node node-learn">
              <span className="node-icon green"><BookOpen size={16} /></span>
              <span><b>Learning Matched</b><small>iGOT · 4h 20m</small></span>
            </div>

            <div className="node node-assess">
              <span className="node-icon lilac"><Award size={16} /></span>
              <span><b>Skill Growth</b><small>SQL · 2/5 → 3/5</small></span>
              <ArrowUpRight size={15} />
            </div>

            <span className="art-caption">A continuous cycle of evidence-led capability growth</span>
          </div>
        </section>

        {/* Trust Strip */}
        <div className="trust-strip">
          <div className="wrap trust-inner">
            <span>INTELLIGENCE FOR THE PUBLIC GOOD</span>
            <span><ShieldCheck size={15} /> Role-Based Access Control</span>
            <span><Activity size={15} /> Measurable Capability Gains</span>
            <span><Heart size={15} /> Human-Centered Public Service Development</span>
          </div>
        </div>

        {/* How It Works Section: 6 steps */}
        <section className="section wrap" id="how">
          <div className="section-heading">
            <div className="eyebrow">SIX-STEP CLOSED LOOP WORKFLOW</div>
            <h2>How SkillSphere AI Works</h2>
            <p>From understanding existing competencies to verified skill growth, every step is automated, transparent, and measurable.</p>
          </div>
          <div className="steps-grid">
            {steps.map((st, i) => (
              <div className="step" key={st.title}>
                <div className="step-number">
                  {st.n}
                  {i < steps.length - 1 && <ArrowRight size={13} />}
                </div>
                <h3>{st.title}</h3>
                <p>{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Differentiation Section: Why SkillSphere AI */}
        <section className="difference" id="platform">
          <div className="wrap">
            <div className="section-heading centered">
              <div className="eyebrow" style={{ color: '#38bdf8', background: 'rgba(56,189,248,0.1)', borderColor: 'rgba(56,189,248,0.3)' }}>
                THE INTELLIGENCE LAYER
              </div>
              <h2>Why SkillSphere AI?</h2>
            </div>
            <div className="diff-grid">
              <div className="diff-card ecosystem">
                <div className="diff-label"><BookOpen size={15} /> EXISTING LEARNING ECOSYSTEM</div>
                <h3>iGOT Karmayogi</h3>
                <p>Extensive catalog of courses and training for civil servants.</p>
                <ul>
                  <li><Check size={14} /> Learning resources & modules</li>
                  <li><Check size={14} /> Training programs</li>
                  <li><Check size={14} /> Content repository</li>
                  <li><Check size={14} /> Broad catalog without skill-gap matching</li>
                </ul>
              </div>

              <div className="diff-center">
                <span><Sparkles size={18} /></span>
                <b>“We don't replace the learning ecosystem.”</b>
                <small>We make it intelligent and personalized.</small>
              </div>

              <div className="diff-card intelligence">
                <div className="diff-label"><BrainCircuit size={15} /> SKILL INTELLIGENCE LAYER</div>
                <h3>SkillSphere AI</h3>
                <p>The closed-loop cognitive engine powering targeted capability development.</p>
                <ul>
                  <li><Check size={14} /> Skill assessment & profile synthesis</li>
                  <li><Check size={14} /> Job-role skill-gap detection</li>
                  <li><Check size={14} /> Personalized recommendations</li>
                  <li><Check size={14} /> AI-generated assessments from materials</li>
                  <li><Check size={14} /> Continuous feedback & dynamic profile update</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Continuous Loop Section */}
        <section className="loop-section wrap" id="loop">
          <div>
            <div className="eyebrow">CONTINUOUS INTELLIGENCE</div>
            <h2>Traditional LMS vs.<br />SkillSphere AI Loop</h2>
            <p style={{ marginTop: '12px', color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>
              <strong>Traditional Learning:</strong> Course → Learn → Quiz (Linear, disconnected).<br /><br />
              <strong>SkillSphere AI:</strong> Assess → Identify Skill Gap → Personalize → Recommend → Learn → AI Assessment → Feedback → Update Skill Profile → Recalculate Gap.
            </p>
            <div style={{ marginTop: '24px' }}>
              <Link to="/login" className="text-link">Explore the Live Demo <ArrowRight size={15} /></Link>
            </div>
          </div>
          <div className="loop-visual">
            <div className="loop-center">
              <BrainCircuit size={24} />
              <span>SKILL<br />PROFILE</span>
            </div>
            {[
              ['Assess', 'loop-a'],
              ['Identify Gap', 'loop-b'],
              ['Personalize', 'loop-c'],
              ['Learn', 'loop-d'],
              ['Evaluate', 'loop-e'],
              ['Improve', 'loop-f']
            ].map(([label, cls]) => (
              <div className={`loop-node ${cls}`} key={label}>
                <span /><b>{label}</b>
              </div>
            ))}
          </div>
        </section>

        {/* Closing Banner */}
        <section className="closing" id="about">
          <div className="wrap closing-inner">
            <span>SKILLSPHERE AI · SIH26101</span>
            <h2>
              “We don't build another LMS.<br />
              <em>We make workforce learning intelligent, personalized and measurable.”</em>
            </h2>
            <Link to="/login" className="button button-dark" style={{ marginTop: '12px' }}>
              Enter the Platform <ArrowRight size={16} />
            </Link>
            <p>Understand Skills. Bridge Gaps. Build the Future.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="wrap">
          <Link to="/" className="brand">
            <span className="brand-mark"><Layers3 size={17} /></span>
            <span>SkillSphere <b>AI</b></span>
          </Link>
          <span>AI-enabled Skill Intelligence & Learning Platform</span>
          <span>SIH Problem Statement: SIH26101</span>
        </div>
      </footer>
    </div>
  )
}

// --- LOGIN PAGE ---
function Login({ onLogin }: { onLogin: (email: string, password: string, role: string) => void }) {
  const [selected, setSelected] = useState('employee')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleQuickFill = (roleChoice: 'employee' | 'hr') => {
    setSelected(roleChoice)
    if (roleChoice === 'employee') {
      setEmail('employee@sih.demo')
      setPassword('Employee@123')
    } else {
      setEmail('hr@sih.demo')
      setPassword('HR@123')
    }
    setError('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const valid = selected === 'employee'
      ? email.trim().toLowerCase() === 'employee@sih.demo' && password === 'Employee@123'
      : email.trim().toLowerCase() === 'hr@sih.demo' && password === 'HR@123'

    if (!valid) {
      setError('Invalid demo credentials. Use the 1-click fill buttons below.')
      return
    }
    onLogin(email, password, selected)
  }

  return (
    <div className="login-page">
      <header className="site-nav login-nav">
        <Link to="/" className="brand">
          <span className="brand-mark"><Layers3 size={18} /></span>
          <span>SkillSphere <b>AI</b></span>
        </Link>
        <Link className="text-link" to="/">Back to Home <ArrowRight size={15} /></Link>
      </header>

      <main className="login-layout">
        <div className="login-aside">
          <div className="eyebrow"><span className="eyebrow-dot" /> SIH26101 · ENTERPRISE DEMO ACCESS</div>
          <h1>Capability is<br />our greatest<br /><span>infrastructure.</span></h1>
          <p>One intelligent platform to understand capability, direct learning, and measure the difference across public services.</p>
          <div className="aside-stat">
            <span><Activity size={16} /></span>
            <div>
              <b>Assess → Learn → Improve</b>
              <small>A continuous cycle, built around people.</small>
            </div>
          </div>
          <div className="aside-steps">
            <span>ASSESS</span><i /><span>PERSONALIZE</span><i /><span>GROW</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-head">
            <span className="secure-label">SECURE DEMO ACCESS</span>
            <h2>Welcome Back</h2>
            <p>Select your workspace role to continue.</p>
          </div>

          <div className="role-switch">
            <button
              type="button"
              className={selected === 'employee' ? 'selected' : ''}
              onClick={() => { setSelected('employee'); setError('') }}
            >
              <Users size={15} /> Employee / Official
            </button>
            <button
              type="button"
              className={selected === 'hr' ? 'selected' : ''}
              onClick={() => { setSelected('hr'); setError('') }}
            >
              <BriefcaseBusiness size={15} /> HR / Administrator
            </button>
          </div>

          <form onSubmit={submit}>
            <label htmlFor="email">
              Employee ID / Email
              <div className="input-wrap">
                <Users size={15} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={selected === 'employee' ? 'employee@sih.demo' : 'hr@sih.demo'}
                  required
                />
              </div>
            </label>

            <label htmlFor="password">
              Password
              <div className="input-wrap">
                <ShieldCheck size={15} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            <div className="form-meta">
              <label className="check-label">
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <button
                type="button"
                className="forgot"
                onClick={() => setError('Use the 1-click Quick Fill buttons below.')}
              >
                Forgot password?
              </button>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button className="button button-dark login-submit" type="submit">
              Continue to Workspace <ArrowRight size={16} />
            </button>
          </form>

          {/* Quick-fill helper buttons for judges */}
          <div className="demo-credentials">
            <span>1-CLICK QUICK FILL FOR DEMO EVALUATION</span>
            <div style={{ gap: '8px', display: 'flex', flexDirection: 'column', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickFill('employee')}
                className="button button-outline button-small"
                style={{ width: '100%', justifyContent: 'space-between', background: '#ffffff' }}
              >
                <span><b>Employee:</b> employee@sih.demo</span>
                <span style={{ color: '#087e75', fontWeight: 700 }}>Auto-fill</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hr')}
                className="button button-outline button-small"
                style={{ width: '100%', justifyContent: 'space-between', background: '#ffffff' }}
              >
                <span><b>HR Admin:</b> hr@sih.demo</span>
                <span style={{ color: '#087e75', fontWeight: 700 }}>Auto-fill</span>
              </button>
            </div>
          </div>

          <p className="login-foot">
            <ShieldCheck size={13} /> Your demo session is stored locally with secure state management.
          </p>
        </div>
      </main>

      <footer className="login-footer">
        SkillSphere AI <span>·</span> AI-enabled Skill Intelligence & Learning Platform <span>·</span> SIH26101
      </footer>
    </div>
  )
}

// --- WORKSPACE SHELL (Sidebar + Topbar + Content) ---
function Workspace({
  role, name, onLogout, skillLevel, onCompleteQuiz
}: {
  role: 'employee' | 'hr'
  name: string
  onLogout: () => void
  skillLevel: number
  onCompleteQuiz?: () => void
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<any | null>(null)

  const nav = role === 'hr' ? hrNav : employeeNav
  const page = headingMap[location.pathname] || ['Workspace', 'Your SkillSphere AI workspace.']
  const current = nav.flatMap(group => group.items).find(item => item.to === location.pathname)?.label || ''
  const welcomeName = name.split(' ')[0]

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <Link to="/" className="brand">
            <span className="brand-mark"><Layers3 size={18} /></span>
            <span>SkillSphere <b>AI</b></span>
          </Link>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="workspace-switch">
          <div className="workspace-avatar">{role === 'hr' ? 'G' : 'D'}</div>
          <span>
            <b>{role === 'hr' ? 'Gov. Workforce' : 'Digital Services'}</b>
            <small>{role === 'hr' ? 'HR / Administrator' : 'Employee Workspace'}</small>
          </span>
          <ChevronDown size={15} />
        </div>

        <div className="side-nav">
          {nav.map(group => (
            <div className="nav-group" key={group.label}>
              <p>{group.label}</p>
              {group.items.map(item => (
                <Link
                  to={item.to}
                  key={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`side-link ${location.pathname === item.to ? 'active' : ''}`}
                >
                  <item.icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.to === '/employee/recommendations' && <span className="new-dot" />}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="readiness-mini">
            <div>
              <span>YOUR READINESS</span>
              <b>{skillLevel >= 3 ? '78%' : '72%'}</b>
            </div>
            <div className="mini-track">
              <span style={{ width: skillLevel >= 3 ? '78%' : '72%' }} />
            </div>
            <small><TrendingUp size={12} /> Up {skillLevel >= 3 ? '14%' : '8%'} this quarter</small>
          </div>

          <Link to={role === 'hr' ? '/hr/dashboard' : '/employee/profile'} className="account-link">
            <div className="user-avatar">{role === 'hr' ? 'PN' : 'AM'}</div>
            <span>
              <b>{name}</b>
              <small>{role === 'hr' ? 'Administrator' : 'Official'}</small>
            </span>
            <button
              aria-label="Sign out"
              title="Sign Out"
              onClick={(e) => { e.preventDefault(); onLogout() }}
            >
              <LogOut size={16} />
            </button>
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Container */}
      <main className="app-main">
        {/* Topbar */}
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={19} />
          </button>
          <div className="breadcrumbs">
            <span>SkillSphere</span>
            <ChevronRight size={14} />
            <b>{current}</b>
          </div>

          <div className="topbar-actions">
            <div className="top-search">
              <Search size={15} />
              <input
                placeholder="Search competencies, roles, courses..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </div>
            <button
              className="icon-button notification"
              aria-label="Notifications"
              onClick={() => window.alert('No new alerts. Your skill intelligence profile is synchronized.')}
            >
              <Bell size={18} />
              <i />
            </button>
            <div className="top-user" onClick={() => navigate(role === 'hr' ? '/hr/dashboard' : '/employee/profile')}>
              <span className="user-avatar">{role === 'hr' ? 'PN' : 'AM'}</span>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" /> {role === 'hr' ? 'WORKFORCE INTELLIGENCE' : `GOOD ${getTimeOfDay().toUpperCase()}, ${welcomeName.toUpperCase()}`}
              </div>
              <h1>{location.pathname === '/employee/dashboard' ? `Good ${getTimeOfDay()}, ${welcomeName}` : page[0]}</h1>
              <p>{page[1]}</p>
            </div>
            <div className="heading-actions">
              <button
                className="button button-outline button-small"
                onClick={() => {
                  if (role === 'hr') {
                    navigate('/hr/reports')
                  } else {
                    window.print()
                  }
                }}
              >
                <Download size={14} /> {role === 'hr' ? 'Export Reports' : 'Save Summary'}
              </button>
              <button
                className="button button-dark button-small"
                onClick={() => navigate(role === 'hr' ? '/hr/role-mapping' : '/employee/skill-gap')}
              >
                <Plus size={15} /> {role === 'hr' ? 'Map Role' : 'Explore Skill Gaps'}
              </button>
            </div>
          </div>

          {/* Subroutes */}
          <Routes>
            <Route path="dashboard" element={role === 'hr' ? <HRDashboard /> : <EmployeeDashboard skillLevel={skillLevel} />} />
            <Route path="skills" element={role === 'hr' ? <HRSkills /> : <SkillsPage skillLevel={skillLevel} />} />
            <Route path="skill-gap" element={role === 'hr' ? <HRGaps /> : <SkillGap skillLevel={skillLevel} />} />
            <Route path="recommendations" element={<Recommendations skillLevel={skillLevel} />} />
            <Route path="igot" element={<IGOT />} />
            <Route path="quiz-generator" element={<QuizGenerator onComplete={onCompleteQuiz || (() => navigate('/employee/assessments?result=1'))} />} />
            <Route path="assessments" element={<Assessments skillLevel={skillLevel} onComplete={onCompleteQuiz} />} />
            <Route path="progress" element={<ProgressPage skillLevel={skillLevel} />} />
            <Route path="profile" element={<Profile name={name} role={role} skillLevel={skillLevel} />} />
            <Route path="employees" element={<Employees onSelectEmployee={(emp) => setSelectedStaffDetail(emp)} />} />
            <Route path="role-mapping" element={<RoleMapping />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>

      {/* HR Employee Detail Drawer */}
      {selectedStaffDetail && (
        <div className="modal-overlay" onClick={() => setSelectedStaffDetail(null)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className="course-tag">{selectedStaffDetail.department}</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0b192c', marginTop: '4px' }}>
                  {selectedStaffDetail.name}
                </h3>
                <small style={{ color: '#64748b' }}>{selectedStaffDetail.role} · ID: {selectedStaffDetail.id}</small>
              </div>
              <button className="icon-button" onClick={() => setSelectedStaffDetail(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="metric-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <Metric label="Assessed Skills" value={selectedStaffDetail.assessed} icon={Layers3} />
                <Metric label="Active Gaps" value={String(selectedStaffDetail.gaps)} icon={Target} tone="peach" />
              </div>

              <Panel title="Assessed Competencies" subtitle="Recent skill profile evaluation">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'SQL', lvl: selectedStaffDetail.name === 'Aarav Mehta' ? skillLevel : 3, req: 4 },
                    { name: 'Python', lvl: 4, req: 4 },
                    { name: 'Data Analytics', lvl: 3, req: 4 },
                    { name: 'Communication', lvl: 4, req: 4 }
                  ].map(s => (
                    <div key={s.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <b>{s.name}</b>
                        <span>{s.lvl} / {s.req} (Req)</span>
                      </div>
                      <div className="level-track">
                        <span style={{ width: `${s.lvl * 20}%` }} />
                        <i style={{ left: `${s.req * 20}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Recommended Interventions">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <b style={{ fontSize: '13px', color: '#0b192c' }}>SQL Fundamentals for Public Data</b>
                    <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                      Recommended to close high-priority gap for Senior Data Analyst transition.
                    </p>
                    <span className="course-tag" style={{ marginTop: '8px' }}>iGOT Karmayogi</span>
                  </div>
                </div>
              </Panel>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="button button-dark full-button"
                  onClick={() => {
                    window.alert(`Assigned customized learning plan to ${selectedStaffDetail.name}.`)
                    setSelectedStaffDetail(null)
                  }}
                >
                  <Check size={14} /> Assign Development Plan
                </button>
                <button
                  className="button button-outline"
                  onClick={() => window.print()}
                >
                  <Printer size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- UI HELPER COMPONENTS ---
function Metric({
  label, value, change, icon: Icon, tone = 'mint', detail
}: {
  label: string
  value: string
  change?: string
  icon: typeof Activity
  tone?: string
  detail?: string
}) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${tone}`}><Icon size={17} /></span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-bottom">
        {change && (
          <span className="metric-change">
            <ArrowUpRight size={13} /> {change}
          </span>
        )}
        <span>{detail}</span>
      </div>
    </div>
  )
}

function Panel({
  title, subtitle, children, action
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <b>{label}</b>
      {payload.map((item: any) => (
        <span key={item.dataKey}>
          <i style={{ background: item.color || item.fill }} />
          {item.name}: {item.value}{item.dataKey === 'readiness' ? '%' : ''}
        </span>
      ))}
    </div>
  )
}

// --- EMPLOYEE DASHBOARD ---
function EmployeeDashboard({ skillLevel }: { skillLevel: number }) {
  const skills = [
    { skill: 'Python', current: 4, required: 4 },
    { skill: 'SQL', current: skillLevel, required: 4 },
    { skill: 'Data analytics', current: 3, required: 4 },
    { skill: 'Communication', current: 4, required: 4 },
  ]

  const gaps = [
    { skill: 'SQL', current: skillLevel, required: 4, gap: Math.max(0, 4 - skillLevel) },
    { skill: 'Power BI', current: 1, required: 4, gap: 3 },
    { skill: 'Python', current: 4, required: 4, gap: 0 },
    { skill: 'Statistics', current: 3, required: 3, gap: 0 },
  ]

  const learningData = [
    { month: 'Jan', hours: 8, readiness: 54 },
    { month: 'Feb', hours: 12, readiness: 59 },
    { month: 'Mar', hours: 15, readiness: 62 },
    { month: 'Apr', hours: 11, readiness: 67 },
    { month: 'May', hours: 21, readiness: 72 },
    { month: 'Jun', hours: 18, readiness: skillLevel >= 3 ? 78 : 72 },
  ]

  return (
    <>
      <div className="metric-grid">
        <Metric
          label="Overall Skill Readiness"
          value={skillLevel >= 3 ? "78%" : "72%"}
          change={skillLevel >= 3 ? "14%" : "8%"}
          icon={Gauge}
          detail="vs. last quarter"
        />
        <Metric
          label="Skills Assessed"
          value="8 / 12"
          change="2 new"
          icon={Layers3}
          tone="lavender"
          detail="role competencies"
        />
        <Metric
          label="Active Skill Gaps"
          value={skillLevel >= 3 ? "2" : "3"}
          icon={Target}
          tone="peach"
          detail={skillLevel >= 3 ? "1 high priority" : "2 high priority"}
        />
        <Metric
          label="Learning Progress"
          value={skillLevel >= 3 ? "76%" : "68%"}
          change="12%"
          icon={BookOpen}
          tone="gold"
          detail="across 3 courses"
        />
      </div>

      <div className="dashboard-grid">
        <Panel
          title="Skill Proficiency"
          subtitle="Current proficiency against role requirements (Scale 1–5)"
          action={<Link className="panel-link" to="/employee/skills">View full profile <ArrowRight size={13} /></Link>}
        >
          <div className="chart-wrap chart-large">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={skills} margin={{ top: 10, right: 12, bottom: 0, left: -22 }}>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="skill" tick={{ fill: '#818982', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar name="Current level" dataKey="current" fill="#087e75" radius={[4, 4, 0, 0]} barSize={25} />
                <Line name="Required level" dataKey="required" stroke="#e5a84a" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3, fill: '#e5a84a' }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span><i className="legend-current" /> Current level</span>
            <span><i className="legend-required" /> Required level</span>
            <small>Proficiency Scale: 1 (Novice) to 5 (Expert)</small>
          </div>
        </Panel>

        <Panel
          title="Skill Gap Overview"
          subtitle="Priority development areas"
          action={<Link className="icon-button" to="/employee/skill-gap" aria-label="View skill gaps"><ArrowUpRight size={16} /></Link>}
        >
          <div className="gap-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gaps} layout="vertical" margin={{ left: 4, right: 14, top: 4, bottom: 0 }}>
                <XAxis type="number" domain={[0, 4]} hide />
                <YAxis type="category" dataKey="skill" width={72} tick={{ fill: '#69736d', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar name="Skill gap" dataKey="gap" radius={[0, 4, 4, 0]} barSize={13}>
                  {gaps.map((entry) => (
                    <Cell key={entry.skill} fill={entry.gap >= 2 ? '#de7d62' : entry.gap === 1 ? '#e6a75a' : '#a8d3be'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="gap-note">
            <span className="gap-note-icon"><Target size={15} /></span>
            <span>
              <b>{skillLevel >= 3 ? 'Power BI is now your highest gap' : 'SQL & Power BI are your highest-priority gaps'}</b>
              <small>{skillLevel >= 3 ? 'SQL improved to level 3 (+1)' : '2 proficiency levels to close for target role'}</small>
            </span>
            <Link to="/employee/skill-gap"><ArrowRight size={15} /></Link>
          </div>
        </Panel>
      </div>

      <div className="dashboard-grid lower-grid">
        <Panel
          title="Learning Progress"
          subtitle="Monthly learning hours and readiness trend"
          action={<span className="select-chip">Last 6 Months <ChevronDown size={13} /></span>}
        >
          <div className="chart-wrap chart-medium">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={learningData} margin={{ top: 6, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="learnFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#58ad90" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#58ad90" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="month" tick={{ fill: '#818982', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area name="Learning hours" dataKey="hours" type="monotone" stroke="#188c75" strokeWidth={2} fill="url(#learnFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Your Next Best Step" subtitle="Recommended for your target career role">
          <div className="next-course">
            <div className="course-art mint-art">
              <BookOpen size={24} />
              <span>iGOT · 4H 20M</span>
            </div>
            <div className="next-course-copy">
              <span className="course-tag">HIGH-PRIORITY GAP · SQL</span>
              <h4>SQL Fundamentals for Public Data</h4>
              <p>Build confidence with practical datasets, queries, and guided exercises.</p>
              <Link to="/employee/recommendations" className="button button-dark button-small">
                Continue Learning <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Panel>
      </div>

      <div className="journey-banner">
        <div className="journey-icon"><Sparkles size={20} /></div>
        <div>
          <b>Closed-Loop Skill Intelligence Active.</b>
          <span>Assess → Identify Skill Gap → Personalize → Learn → AI Assessment → Update Skill Profile</span>
        </div>
        <Link to="/employee/skill-gap" className="text-link">Explore Skill Gaps <ArrowRight size={15} /></Link>
      </div>
    </>
  )
}

// --- MY SKILLS PROFILE ---
function SkillsPage({ skillLevel }: { skillLevel: number }) {
  const groups = ['Technical', 'Professional']
  const readiness = skillLevel >= 3 ? 78 : 72

  return (
    <>
      <div className="skills-summary">
        <div>
          <span>OVERALL PROFICIENCY</span>
          <b>{readiness}%</b>
          <small><TrendingUp size={13} /> +{skillLevel >= 3 ? '14%' : '8%'} since last assessment</small>
        </div>
        <div className="readiness-ring">
          <div><b>{readiness}</b><small>/ 100</small></div>
        </div>
        <div className="skills-summary-copy">
          <b>Your Strongest Capabilities</b>
          <p>Python, Communication, and Problem Solving meet target expectations. SQL and Power BI are priority growth targets.</p>
          <Link className="text-link" to="/employee/skill-gap">Explore Development Areas <ArrowRight size={14} /></Link>
        </div>
      </div>

      {groups.map(group => (
        <section className="skills-section" key={group}>
          <div className="section-title-row">
            <h3>{group} Skills <span>{initialSkillData.filter(s => s.group === group).length}</span></h3>
            <button className="icon-button" aria-label={`More ${group} skills`}><MoreHorizontal size={18} /></button>
          </div>
          <div className="skill-cards">
            {initialSkillData
              .filter(s => s.group === group)
              .map((item, i) => {
                const current = item.skill === 'SQL' ? skillLevel : item.current
                const isOnTarget = current >= item.required
                const isPriority = current <= 2

                return (
                  <article className="skill-card" key={item.skill}>
                    <div className="skill-card-top">
                      <span className={`skill-symbol symbol-${i % 4}`}>{item.skill.slice(0, 1)}</span>
                      <span className={`status-pill ${isOnTarget ? 'status-good' : isPriority ? 'status-priority' : 'status-progress'}`}>
                        {isOnTarget ? 'On Target' : isPriority ? 'Priority Gap' : 'In Progress'}
                      </span>
                    </div>
                    <h4>{item.skill}</h4>
                    <div className="skill-level-row">
                      <span>Current <b>{current}/5</b></span>
                      <span>Required <b>{item.required}/5</b></span>
                    </div>
                    <div className="level-track">
                      <span style={{ width: `${current * 20}%` }} />
                      <i style={{ left: `${item.required * 20}%` }} />
                    </div>
                    <div className="skill-foot">
                      <span><Clock3 size={12} /> Assessed {item.skill === 'SQL' && skillLevel >= 3 ? 'Today (Verified)' : '12 Jun 2026'}</span>
                      <button
                        className="panel-link"
                        onClick={() => window.alert(`${item.skill}: Assessed proficiency is ${current}/5. Target role requires ${item.required}/5.`)}
                      >
                        Details <ArrowRight size={12} />
                      </button>
                    </div>
                  </article>
                )
              })}
          </div>
        </section>
      ))}
    </>
  )
}

// --- SKILL GAP ANALYSIS PAGE ---
function SkillGap({ skillLevel }: { skillLevel: number }) {
  const [currentRole, setCurrentRole] = useState('Junior Data Analyst')
  const [targetRole, setTargetRole] = useState('Senior Data Analyst')

  const gapRows = [
    { skill: 'SQL', current: skillLevel, required: 4, gap: Math.max(0, 4 - skillLevel) },
    { skill: 'Power BI', current: 1, required: 4, gap: 3 },
    { skill: 'Python', current: 4, required: 4, gap: 0 },
    { skill: 'Statistics', current: 3, required: 3, gap: 0 },
  ]

  return (
    <>
      <div className="role-selector panel">
        <div className="role-select">
          <label>CURRENT JOB ROLE</label>
          <div>
            <BriefcaseBusiness size={15} />
            <select value={currentRole} onChange={e => setCurrentRole(e.target.value)}>
              <option>Junior Data Analyst</option>
              <option>Data Analyst</option>
              <option>Program Coordinator</option>
              <option>Finance Officer</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        <div className="role-arrow"><ArrowRight size={17} /></div>

        <div className="role-select">
          <label>TARGET CAREER ROLE</label>
          <div>
            <Target size={15} />
            <select value={targetRole} onChange={e => setTargetRole(e.target.value)}>
              <option>Senior Data Analyst</option>
              <option>Data Analyst</option>
              <option>Data Product Manager</option>
              <option>Policy Analyst</option>
            </select>
            <ChevronDown size={14} />
          </div>
        </div>

        <span className="updated-label">
          <span /> AI GAP ANALYSIS SYNCHRONIZED
        </span>
      </div>

      <div className="gap-summary-row">
        <div className="gap-summary">
          <span className="metric-icon peach"><Target size={17} /></span>
          <div>
            <small>SKILLS TO DEVELOP</small>
            <b>{gapRows.filter(r => r.gap > 0).length} <small>of 4 role skills</small></b>
          </div>
        </div>
        <div className="gap-summary">
          <span className="metric-icon gold"><ArrowDownRight size={17} /></span>
          <div>
            <small>HIGHEST PRIORITY GAP</small>
            <b>Power BI <small>3 levels to close</small></b>
          </div>
        </div>
        <div className="gap-summary">
          <span className="metric-icon mint"><CheckCircle2 size={17} /></span>
          <div>
            <small>SKILLS ON TARGET</small>
            <b>{gapRows.filter(r => r.gap === 0).length} <small>role skills</small></b>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Panel title="Role Competency Comparison" subtitle={`Current capability vs. ${targetRole} requirements`}>
          <div className="chart-wrap chart-large">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapRows} margin={{ top: 12, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="skill" tick={{ fill: '#818982', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar name="Current level" dataKey="current" fill="#147e75" radius={[4, 4, 0, 0]} barSize={23} />
                <Bar name="Required level" dataKey="required" fill="#d8b46c" radius={[4, 4, 0, 0]} barSize={23} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <span><i className="legend-current" /> Current level</span>
            <span><i className="legend-required" /> Required level</span>
            <small>Scale: 1–5</small>
          </div>
        </Panel>

        <Panel title="Skill Gap Matrix" subtitle="Priority is evaluated from role weight and competency gap">
          <div className="gap-table">
            <div className="gap-table-head">
              <span>SKILL</span>
              <span>CURRENT</span>
              <span>REQUIRED</span>
              <span>GAP</span>
            </div>
            {gapRows.map(row => (
              <div className={`gap-table-row ${row.gap >= 2 ? 'high-gap' : ''}`} key={row.skill}>
                <b>
                  {row.skill}
                  {row.gap >= 2 && <i>HIGH PRIORITY</i>}
                </b>
                <span>{row.current}/5</span>
                <span>{row.required}/5</span>
                <strong className={row.gap >= 2 ? 'gap-number' : 'gap-zero'}>{row.gap}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="priority-banner">
        <div className="priority-badge"><Target size={18} /></div>
        <div>
          <b>Your highest-priority development areas are SQL and Power BI.</b>
          <span>Close high-priority gaps first with curated courses matched from the iGOT Karmayogi catalog.</span>
        </div>
        <Link className="button button-dark button-small" to="/employee/recommendations">
          View Personalized Learning <ArrowRight size={14} />
        </Link>
      </div>
    </>
  )
}

// --- PERSONALIZED RECOMMENDATIONS ---
function Recommendations({ skillLevel }: { skillLevel: number }) {
  const [started, setStarted] = useState<string[]>(['IG-DA-104'])

  return (
    <>
      <div className="recommendation-intro">
        <span className="spark-square"><Sparkles size={19} /></span>
        <div>
          <b>Curated for Your Next Role: Senior Data Analyst</b>
          <p>Every recommendation explicitly explains WHY it was selected based on your verified skill gap.</p>
        </div>
        <span className="match-score">
          <b>94%</b>
          <small>LEARNING PATH MATCH</small>
        </span>
      </div>

      <div className="recommendation-list">
        {courses.map((course, i) => (
          <article className="recommendation-card" key={course.id}>
            <div className={`recommendation-cover ${course.color}`}>
              <span>
                {i === 0 ? <Layers3 size={24} /> : i === 1 ? <BarChart3 size={24} /> : <Activity size={24} />}
              </span>
              <small>iGOT<br />KARMAYOGI</small>
              <b>0{i + 1}</b>
            </div>

            <div className="recommendation-body">
              <div className="recommendation-kickers">
                <span className="course-tag">SKILL GAP · {course.skill.toUpperCase()}</span>
                <span className="match-mini"><Sparkles size={12} /> {96 - i * 6}% Match</span>
              </div>
              <h3>{course.title}</h3>
              <div className="rec-levels">
                <span>
                  Current Level: <b>{course.skill === 'SQL' ? `${skillLevel}/5` : course.skill === 'Power BI' ? '1/5' : '3/5'}</b>
                </span>
                <span>Required Level: <b>4/5</b></span>
                <span><Clock3 size={13} /> {course.duration}</span>
              </div>

              {/* Explicit WHY RECOMMENDED */}
              <div className="why-rec">
                <Sparkles size={14} />
                <span>
                  <b>Why Recommended:</b><br />
                  {course.skill === 'SQL'
                    ? 'You have an active SQL skill gap for your selected career role (Senior Data Analyst). This course covers multi-table JOINs, filtering, and query normalization.'
                    : course.skill === 'Power BI'
                    ? 'Power BI is your highest-priority gap (3 levels). This hands-on resource develops executive reporting competencies expected of a senior analyst.'
                    : 'Strengthen your evidence-based analysis and uncertainty quantification to fulfill target role requirements.'}
                </span>
              </div>

              <div className="rec-actions">
                <button
                  className="button button-dark button-small"
                  onClick={() => setStarted(prev => prev.includes(course.id) ? prev : [...prev, course.id])}
                >
                  {started.includes(course.id) ? (
                    <><Check size={14} /> Continue Learning</>
                  ) : (
                    <><Play size={13} /> Start Learning</>
                  )} <ArrowRight size={13} />
                </button>
                <Link to="/employee/igot" className="button button-outline button-small">
                  View Course Details <ArrowUpRight size={14} />
                </Link>
                <span className="provider-label">
                  <BookOpen size={12} /> Provider: iGOT Karmayogi
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="prototype-note">
        <ShieldCheck size={15} />
        <span>
          <b>Personalized Recommendation Engine:</b> Rationale is generated dynamically by matching detected skill gaps against iGOT competencies.
        </span>
      </div>
    </>
  )
}

// --- iGOT INTEGRATION PAGE ---
function IGOT() {
  const [filter, setFilter] = useState('All skills')
  const list = filter === 'All skills' ? courses : courses.filter(course => course.skill === filter)

  return (
    <>
      <div className="igot-callout">
        <div className="igot-emblem"><BookOpen size={20} /></div>
        <div>
          <b>iGOT Learning Resources</b>
          <span>SkillSphere AI connects identified skill gaps with relevant learning resources available through the iGOT learning ecosystem.</span>
        </div>
        <span className="api-label">
          <span /> iGOT Integration — Prototype / Authorized API Placeholder
        </span>
      </div>

      <div className="course-toolbar">
        <div>
          <h3>Recommended For You <span>{list.length}</span></h3>
          <p>Prioritized according to your workforce skill-gap analysis</p>
        </div>
        <label className="filter-control">
          <Filter size={14} />
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option>All skills</option>
            {courses.map(c => <option key={c.skill}>{c.skill}</option>)}
          </select>
          <ChevronDown size={14} />
        </label>
      </div>

      <div className="course-grid">
        {list.map(course => (
          <article className="course-card" key={course.id}>
            <div className={`course-card-art ${course.color}`}>
              <div className="course-brand">
                <Layers3 size={16} /> iGOT Karmayogi
              </div>
              <span className="course-art-icon">
                {course.skill === 'SQL' ? <Layers3 size={29} /> : course.skill === 'Power BI' ? <BarChart3 size={29} /> : <Activity size={29} />}
              </span>
              <span className="course-art-number">{course.id}</span>
            </div>

            <div className="course-card-copy">
              <div className="course-tags">
                <span>{course.skill}</span>
                <span>{course.level}</span>
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <div className="course-facts">
                <span><Clock3 size={13} /> {course.duration}</span>
                <span><FileText size={13} /> {course.lessons} lessons</span>
              </div>

              <div className="learning-outcomes">
                <b>LEARNING OUTCOMES</b>
                {course.outcomes?.map((outc, i) => (
                  <span key={i}><Check size={13} /> {outc}</span>
                ))}
              </div>

              <div className="course-id">
                <span>COURSE ID: <b>{course.id}</b></span>
                <span>PROVIDER: <b>{course.provider}</b></span>
              </div>

              <button
                className="button button-dark full-button"
                onClick={() => window.alert(`Navigating to iGOT Learning module: ${course.title} (${course.id}).`)}
              >
                View Learning Resource <ArrowRight size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="prototype-note">
        <ShieldCheck size={15} />
        <span>
          <b>Important Note:</b> iGOT Integration — Prototype / Authorized API Placeholder. No direct database access to iGOT is claimed. This catalog uses mock course data for demonstration.
        </span>
      </div>
    </>
  )
}

// --- AI QUIZ GENERATOR ---
function QuizGenerator({ onComplete }: { onComplete: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [count, setCount] = useState('5')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [type, setType] = useState('MCQ')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  const chooseFile = (selected?: File) => {
    if (!selected) return
    const allowed = /\.(pdf|ppt|pptx|doc|docx|txt|mp4|mov|webm)$/i
    if (!allowed.test(selected.name)) {
      window.alert('Supported formats: PDF, PPT/PPTX, DOC/DOCX, TXT, or Video.')
      return
    }
    if (selected.size > 30 * 1024 * 1024) {
      window.alert('Maximum allowed file size is 30 MB.')
      return
    }
    setFile(selected)
    setGenerated(false)
    setStepIndex(1)
  }

  const generate = () => {
    if (!file) {
      window.alert('Please drop or select a learning material file first.')
      return
    }
    setGenerating(true)
    let currentStep = 1
    const timer = setInterval(() => {
      currentStep += 1
      setStepIndex(currentStep)
      if (currentStep >= 5) {
        clearInterval(timer)
        setGenerating(false)
        setGenerated(true)
      }
    }, 400)
  }

  const pipelineStages = [
    { title: 'Content Uploaded', sub: 'Material securely received', icon: Upload },
    { title: 'Content Extraction', sub: 'Text and document structure analyzed', icon: FileText },
    { title: 'Topic Detection', sub: 'Relational DB concepts identified', icon: Compass },
    { title: 'Key Concept Extraction', sub: 'JOINs, filtering and aggregations isolated', icon: Zap },
    { title: 'AI Question Generation', sub: 'Targeted assessment questions formulated', icon: BrainCircuit },
    { title: 'Quiz Ready', sub: 'Review and evaluate your learning', icon: CheckCircle2 },
  ]

  return (
    <>
      <div className="quiz-builder-layout">
        <div className="quiz-config">
          <Panel title="Upload Learning Material" subtitle="Upload documents or videos to automatically generate an assessment">
            <label
              className={`upload-drop ${file ? 'has-file' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                chooseFile(e.dataTransfer.files[0])
              }}
            >
              <input
                type="file"
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp4,.mov,.webm"
                onChange={e => chooseFile(e.target.files?.[0])}
              />
              <span className="upload-icon">
                {file ? <FileText size={22} /> : <CloudUpload size={23} />}
              </span>
              <b>{file ? file.name : 'Drag & drop learning material here'}</b>
              <small>
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB · Ready for AI processing`
                  : 'or browse files from your computer'}
              </small>
              <span className="upload-browse">{file ? 'Choose Another File' : 'Browse Files'}</span>
              <span className="file-types">SUPPORTED: PDF · PPT / PPTX · DOC / DOCX · TXT · VIDEO (MAX 30 MB)</span>
            </label>

            <div className="config-fields">
              <label>
                Number of Questions
                <div className="segmented">
                  {['5', '10', '20'].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={count === n ? 'active' : ''}
                      onClick={() => setCount(n)}
                    >
                      {n} Questions
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Difficulty
                <div className="segmented">
                  {['Easy', 'Intermediate', 'Hard'].map(d => (
                    <button
                      key={d}
                      type="button"
                      className={difficulty === d ? 'active' : ''}
                      onClick={() => setDifficulty(d)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </label>

              <label>
                Question Type
                <div className="type-select">
                  <BrainCircuit size={15} />
                  <select value={type} onChange={e => setType(e.target.value)}>
                    <option value="MCQ">Multiple Choice (MCQ)</option>
                    <option value="True-False">True / False</option>
                    <option value="Multiple Select">Multiple Select</option>
                  </select>
                  <ChevronDown size={14} />
                </div>
              </label>
            </div>

            <button
              className="button button-dark full-button generate-button"
              onClick={generate}
              disabled={generating}
            >
              {generating ? (
                <><span className="spinner" /> AI Extracting & Generating Questions...</>
              ) : (
                <><Sparkles size={15} /> Generate Quiz <ArrowRight size={15} /></>
              )}
            </button>

            {generated && (
              <div className="generated-result">
                <CheckCircle2 size={18} />
                <span>
                  <b>Assessment Successfully Generated!</b>
                  <small>{count} {difficulty.toLowerCase()} {type} questions created from {file?.name}</small>
                </span>
                <button type="button" onClick={onComplete}>
                  Start Assessment <ArrowRight size={14} />
                </button>
              </div>
            )}
          </Panel>
        </div>

        {/* AI Workflow Visualization */}
        <div className="quiz-process">
          <Panel title="AI Processing Pipeline" subtitle="From uploaded content to verified assessment">
            <div className="process-list">
              {pipelineStages.map((stage, i) => {
                const isDone = i <= stepIndex && (file !== null || i === 0)
                const isCurrent = i === stepIndex && generating
                const IconComponent = stage.icon

                return (
                  <div
                    className={`process-item ${isCurrent ? 'process-active' : ''}`}
                    key={stage.title}
                  >
                    <span className="process-icon"><IconComponent size={15} /></span>
                    <span>
                      <b>{stage.title}</b>
                      <small>{stage.sub}</small>
                    </span>
                    <span className={`process-state ${isDone ? 'state-done' : ''}`}>
                      {isDone ? <Check size={14} /> : isCurrent ? <span /> : '—'}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="ai-note">
              <BrainCircuit size={16} />
              <span>
                <b>Modular AI Processing:</b> Uses Content AI to extract key concepts, then Quiz AI generates pedagogical MCQs complete with answers and diagnostic explanations.
              </span>
            </div>
          </Panel>
        </div>
      </div>
    </>
  )
}

// --- INTERACTIVE QUIZ & AI FEEDBACK ---
function Assessments({
  skillLevel, onComplete
}: {
  skillLevel: number
  onComplete?: () => void
}) {
  const completedParam = new URLSearchParams(window.location.search).has('result')
  const [answers, setAnswers] = useState<Record<number, number>>({ 0: 1, 1: 2, 2: 1, 3: 2, 4: 1 })
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [submitted, setSubmitted] = useState(completedParam)

  const questions = [
    {
      q: 'Which SQL clause is used to filter aggregated grouped results?',
      options: ['WHERE', 'HAVING', 'ORDER BY', 'GROUP BY'],
      answer: 1,
      explain: 'HAVING filters aggregated groups after GROUP BY is applied, whereas WHERE filters individual rows.'
    },
    {
      q: 'Which join returns all rows from the left table and matching rows from the right table?',
      options: ['INNER JOIN', 'CROSS JOIN', 'LEFT JOIN', 'FULL OUTER JOIN'],
      answer: 2,
      explain: 'LEFT JOIN preserves every record from the left table, filling non-matching right columns with NULL.'
    },
    {
      q: 'What is the primary benefit of creating an index on a frequently queried table column?',
      options: ['Reduces total storage size', 'Improves data retrieval speed', 'Removes duplicate records', 'Formats column data'],
      answer: 1,
      explain: 'Indexes allow the database query engine to locate target records rapidly without requiring a full sequential table scan.'
    },
    {
      q: 'Which SQL aggregate function counts only non-null values in the specified column?',
      options: ['COUNT(*)', 'SUM()', 'COUNT(column)', 'AVG()'],
      answer: 2,
      explain: 'COUNT(column) evaluates rows with non-null values in that column, unlike COUNT(*) which counts all rows.'
    },
    {
      q: 'What is the key integrity rule of a primary key in a relational database?',
      options: ['A unique row identifier that cannot be NULL', 'A foreign key pointer to an external database', 'A sort order clause', 'A password hash for authentication'],
      answer: 0,
      explain: 'A primary key uniquely identifies each entity row and strictly forbids NULL values.'
    },
  ]

  const handleSubmitQuiz = () => {
    setSubmitted(true)
    if (onComplete) onComplete()
    window.history.replaceState({}, '', `${window.location.pathname}?result=1`)
  }

  if (submitted) {
    return (
      <>
        {/* Result Banner */}
        <div className="result-banner">
          <div className="result-score">
            <b>80</b><span>%</span>
          </div>
          <div>
            <span className="course-tag">ASSESSMENT RESULT · SQL FUNDAMENTALS</span>
            <h2>Evaluation Complete, Aarav!</h2>
            <p>Score: 4/5 (80%) · 4 Correct, 1 Incorrect. Your skill profile has been updated automatically.</p>
          </div>
          <div className="result-grade">
            <small>VERIFIED SCORE</small>
            <b>4 / 5</b>
            <span>Completed Today</span>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* AI Learning Feedback */}
          <Panel title="AI Learning Feedback" subtitle="Diagnostic insights tailored to your responses">
            <div className="feedback-block">
              <div>
                <span className="feedback-icon green"><Check size={15} /></span>
                <b>Strengths</b>
              </div>
              <p>Basic SQL concepts, primary key entity integrity, and aggregate filtering clauses.</p>

              <div>
                <span className="feedback-icon amber"><Target size={15} /></span>
                <b>Needs Improvement</b>
              </div>
              <p>JOIN operations (LEFT vs INNER JOIN set differences) and query indexing optimization.</p>

              <div>
                <span className="feedback-icon blue"><Sparkles size={15} /></span>
                <b>Recommended Next Step</b>
              </div>
              <p>“Complete an intermediate SQL learning resource on iGOT Karmayogi to master multi-table query performance.”</p>

              <Link to="/employee/recommendations" className="button button-dark button-small">
                View Recommended Learning <ArrowRight size={14} />
              </Link>
            </div>
          </Panel>

          {/* Continuous Skill Update Simulation */}
          <Panel title="Continuous Skill Profile Update" subtitle="Demonstrating closed-loop skill intelligence">
            <div className="skill-update">
              <div>
                <small>BEFORE ASSESSMENT</small>
                <b>SQL <span>2/5</span></b>
                <div className="update-bar"><i style={{ width: '40%' }} /></div>
              </div>

              <ArrowRight size={18} style={{ color: '#087e75' }} />

              <div>
                <small>QUIZ PERFORMANCE</small>
                <b className="update-score">80% <span>4 / 5 Correct</span></b>
                <div className="update-bar score"><i style={{ width: '80%' }} /></div>
              </div>

              <ArrowRight size={18} style={{ color: '#087e75' }} />

              <div>
                <small>AFTER ASSESSMENT</small>
                <b style={{ color: '#087e75' }}>SQL <span>{skillLevel >= 3 ? skillLevel : 3}/5</span></b>
                <div className="update-bar"><i style={{ width: `${(skillLevel >= 3 ? skillLevel : 3) * 20}%` }} /></div>
              </div>
            </div>

            <div className="updated-confirm">
              <CheckCircle2 size={16} /> “Your skill profile has been updated based on your latest assessment.”
            </div>

            <div style={{ marginTop: '12px' }}>
              <Link to="/employee/skill-gap" className="button button-outline button-small">
                View Updated Skill Gap <ArrowRight size={14} />
              </Link>
            </div>
          </Panel>
        </div>

        {/* Detailed Question Review with Explanations */}
        <Panel title="Question-by-Question Review & Explanations" subtitle="Diagnostic answers with pedagogical rationales">
          <div className="question-review">
            {questions.map((q, i) => {
              const isCorrect = i !== 4
              return (
                <div
                  className={`review-row ${isCorrect ? 'review-correct' : 'review-incorrect'}`}
                  key={q.q}
                >
                  <span>{isCorrect ? <Check size={15} /> : <X size={15} />}</span>
                  <div>
                    <b>Question {i + 1}: {q.q}</b>
                    <p style={{ marginTop: '3px' }}>
                      {isCorrect
                        ? `Correct Answer: "${q.options[q.answer]}". ${q.explain}`
                        : `Your Answer: "${q.options[1]}". Correct Answer: "${q.options[q.answer]}". ${q.explain}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      </>
    )
  }

  const q = questions[currentQIndex]

  return (
    <>
      <div className="quiz-live-top">
        <div>
          <span className="course-tag">AI-GENERATED ASSESSMENT · SQL FUNDAMENTALS</span>
          <h2>SQL Knowledge Check</h2>
          <p>Answer the following questions to verify your competency level.</p>
        </div>
        <div className="quiz-progress-count">
          <b>{currentQIndex + 1}</b><span> / {questions.length} Questions</span>
        </div>
      </div>

      <div className="assessment-layout">
        <div className="assessment-main">
          <section className="question-card">
            <div className="question-header">
              <span>QUESTION {String(currentQIndex + 1).padStart(2, '0')} OF {String(questions.length).padStart(2, '0')}</span>
              <span>1 POINT</span>
            </div>
            <h3>{q.q}</h3>

            <div className="question-options">
              {q.options.map((option, optIdx) => (
                <button
                  type="button"
                  key={option}
                  className={answers[currentQIndex] === optIdx ? 'option-selected' : ''}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQIndex]: optIdx }))}
                >
                  <span>{String.fromCharCode(65 + optIdx)}</span>
                  {option}
                  {answers[currentQIndex] === optIdx && <Check size={15} />}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                type="button"
                className="button button-outline button-small"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
              >
                <ArrowLeft size={14} /> Previous
              </button>

              {currentQIndex < questions.length - 1 ? (
                <button
                  type="button"
                  className="button button-dark button-small"
                  onClick={() => setCurrentQIndex(prev => Math.min(questions.length - 1, prev + 1))}
                >
                  Next Question <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  className="button button-dark button-small"
                  onClick={handleSubmitQuiz}
                >
                  Submit Quiz <Check size={14} />
                </button>
              )}
            </div>
          </section>
        </div>

        <aside className="assessment-aside">
          <Panel title="Assessment Overview">
            <div className="assessment-summary">
              <span>Total Questions: <b>{questions.length}</b></span>
              <span>Answered: <b>{Object.keys(answers).length} of {questions.length}</b></span>
              <span>Estimated Time: <b>~5 min</b></span>
              <div className="assessment-track">
                <i style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
              </div>
              <button
                className="button button-dark full-button"
                onClick={handleSubmitQuiz}
              >
                Submit Quiz <ArrowRight size={14} />
              </button>
              <small>Your skill profile and skill gap will be automatically recalculated upon submission.</small>
            </div>
          </Panel>
        </aside>
      </div>
    </>
  )
}

// --- MY PROGRESS PAGE ---
function ProgressPage({ skillLevel }: { skillLevel: number }) {
  const learningData = [
    { month: 'Jan', hours: 8, readiness: 54 },
    { month: 'Feb', hours: 12, readiness: 59 },
    { month: 'Mar', hours: 15, readiness: 62 },
    { month: 'Apr', hours: 11, readiness: 67 },
    { month: 'May', hours: 21, readiness: 72 },
    { month: 'Jun', hours: 18, readiness: skillLevel >= 3 ? 78 : 72 },
  ]

  const timeline = [
    { date: '12 Jun', title: 'Skill Assessment', desc: 'Baseline SQL capability assessed at Level 2/5', tag: 'ASSESS', type: 'check' },
    { date: '14 Jun', title: 'SQL Fundamentals Course', desc: 'Started course on iGOT Karmayogi (4h 20m)', tag: 'LEARN', type: 'book' },
    { date: 'Today', title: 'AI Quiz Evaluation', desc: 'Scored 80% (4/5) on diagnostic quiz', tag: 'ASSESS', type: 'quiz' },
    { date: 'Today', title: 'Skill Profile Updated', desc: 'SQL proficiency increased from 2/5 to 3/5', tag: 'IMPROVE', type: 'up' },
  ]

  return (
    <>
      <div className="metric-grid">
        <Metric label="Courses Started" value="3" icon={BookOpen} tone="lavender" detail="1 in progress" />
        <Metric label="Courses Completed" value="2" icon={CheckCircle2} tone="mint" detail="verified on iGOT" />
        <Metric label="Learning Hours" value="24.5" change="18%" icon={Clock3} tone="gold" detail="year to date" />
        <Metric label="Gap Reduction" value={skillLevel >= 3 ? "42%" : "31%"} change="9%" icon={TrendingUp} tone="peach" detail="since baseline assessment" />
      </div>

      <div className="dashboard-grid">
        <Panel title="Readiness Trajectory" subtitle="Continuous capability growth over the last 6 months">
          <div className="chart-wrap chart-large">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningData} margin={{ top: 10, right: 8, bottom: 0, left: -15 }}>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="month" tick={{ fill: '#818982', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Line name="Readiness" dataKey="readiness" stroke="#087e75" strokeWidth={2.5} dot={{ r: 4, fill: '#087e75', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Skill Improvement" subtitle="Capability gains across verified assessments">
          <div className="improvement-list">
            {[
              ['SQL', 40, skillLevel >= 3 ? 60 : 40, skillLevel >= 3 ? '+1 Level (Now 3/5)' : 'In Progress'],
              ['Data analytics', 40, 60, '+1 Level'],
              ['Communication', 60, 80, '+1 Level'],
              ['Cloud computing', 20, 40, '+1 Level']
            ].map(([name, from, to, change]) => (
              <div className="improvement-item" key={String(name)}>
                <span>
                  <b>{name}</b>
                  <small>{change}</small>
                </span>
                <div className="level-track">
                  <span style={{ width: `${to}%` }} />
                  <i style={{ left: `${from}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Continuous Learning Timeline" subtitle="From initial baseline assessment to measurable capability growth">
        <div className="timeline">
          {timeline.map((item, i) => (
            <div className="timeline-item" key={item.title}>
              <span className="timeline-date">{item.date}</span>
              <span className={`timeline-icon timeline-${item.type}`}>
                {item.type === 'check' ? <Check size={14} /> : item.type === 'book' ? <BookOpen size={14} /> : item.type === 'quiz' ? <BrainCircuit size={14} /> : <TrendingUp size={14} />}
              </span>
              <div>
                <b>{item.title}</b>
                <small>{item.desc}</small>
              </div>
              <span className={`timeline-tag ${i === 3 ? 'green-tag' : ''}`}>{item.tag}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// --- PROFILE PAGE ---
function Profile({ name, role, skillLevel }: { name: string; role: string; skillLevel: number }) {
  return (
    <>
      <div className="profile-head">
        <div className="profile-avatar">{role === 'hr' ? 'PN' : 'AM'}</div>
        <div>
          <span className="course-tag">{role === 'hr' ? 'HR ADMINISTRATOR' : 'GOVERNMENT OFFICIAL'}</span>
          <h2>{name}</h2>
          <p>{role === 'hr' ? 'Human Resources · Workforce Intelligence' : 'Digital Services · Junior Data Analyst'}</p>
        </div>
        <button
          className="button button-outline button-small"
          onClick={() => window.alert('Profile settings saved.')}
        >
          Edit Profile <Settings2 size={14} />
        </button>
      </div>

      <div className="dashboard-grid">
        <Panel title="Professional Details">
          <div className="profile-details">
            {[
              ['Employee ID', role === 'hr' ? 'SIH-HR-001' : 'SIH-1042'],
              ['Department', role === 'hr' ? 'Human Resources' : 'Digital Services'],
              ['Current Role', role === 'hr' ? 'Workforce Administrator' : 'Junior Data Analyst'],
              ['Target Role', role === 'hr' ? 'Senior Administrator' : 'Senior Data Analyst'],
              ['Work Location', 'New Delhi, India'],
              ['Verified SQL Level', role === 'hr' ? '—' : `${skillLevel} / 5`],
              ['Portal Access', 'Active (Verified)']
            ].map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Development Preferences">
          <div className="profile-details">
            {[
              ['Learning Format', 'Short practical modules (Micro-learning)'],
              ['Weekly Target', '3.5 Hours / Week'],
              ['Primary Domain', 'Data Analytics & Public Governance'],
              ['Assessment Frequency', 'Bi-weekly Adaptive Quizzes']
            ].map(([label, value]) => (
              <div key={label}>
                <small>{label}</small>
                <b>{value}</b>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  )
}

// --- HR DASHBOARD ---
function HRDashboard() {
  const dept = [
    { name: 'Digital Services', gaps: 62 },
    { name: 'Finance', gaps: 48 },
    { name: 'Operations', gaps: 71 },
    { name: 'Administration', gaps: 36 }
  ]

  const common = [
    { skill: 'SQL', count: 38 },
    { skill: 'Data Analytics', count: 31 },
    { skill: 'Cybersecurity', count: 26 },
    { skill: 'Cloud Computing', count: 22 },
    { skill: 'Communication', count: 17 }
  ]

  const trendData = [
    { month: 'Jan', readiness: 61, hours: 210 },
    { month: 'Feb', readiness: 64, hours: 320 },
    { month: 'Mar', readiness: 66, hours: 410 },
    { month: 'Apr', readiness: 69, hours: 380 },
    { month: 'May', readiness: 71, hours: 490 },
    { month: 'Jun', readiness: 74, hours: 520 },
  ]

  return (
    <>
      <div className="metric-grid">
        <Metric label="Total Employees" value="1,248" change="6.2%" icon={Users} detail="across 18 departments" />
        <Metric label="Employees Assessed" value="986" change="12%" icon={CheckCircle2} tone="lavender" detail="79% workforce coverage" />
        <Metric label="Active Skill Gaps" value="3,462" icon={Target} tone="peach" detail="across 42 job roles" />
        <Metric label="Learning Participation" value="74%" change="8%" icon={BookOpen} tone="gold" detail="this quarter" />
      </div>

      <div className="dashboard-grid">
        <Panel
          title="Department Skill Gap Distribution"
          subtitle="Percentage of mapped competencies requiring intervention"
          action={<Link className="panel-link" to="/hr/analytics">Full analytics <ArrowRight size={13} /></Link>}
        >
          <div className="hr-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept} margin={{ top: 8, right: 4, bottom: 0, left: -12 }}>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="name" tick={{ fill: '#818982', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar name="Gap prevalence" dataKey="gaps" fill="#168578" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Most Common Skill Gaps"
          subtitle="Prevalence across workforce assessments"
          action={<Link className="icon-button" to="/hr/skill-gap" aria-label="View gaps"><ArrowUpRight size={16} /></Link>}
        >
          <div className="common-gaps">
            {common.map((item, index) => (
              <div className="common-gap" key={item.skill}>
                <span className="gap-rank">0{index + 1}</span>
                <b>{item.skill}</b>
                <div className="common-track">
                  <i style={{ width: `${(item.count / 40) * 100}%` }} />
                </div>
                <span>{item.count}%</span>
              </div>
            ))}
          </div>
          <div className="common-gap-foot">
            Highest organizational development priority across <b>12 departments</b>
          </div>
        </Panel>
      </div>

      <div className="dashboard-grid lower-grid">
        <Panel title="Skill Improvement Trend" subtitle="Average workforce readiness score">
          <div className="chart-wrap chart-medium">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -19 }}>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="month" tick={{ fill: '#818982', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 90]} tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Line name="Readiness" dataKey="readiness" stroke="#087e75" strokeWidth={2.5} dot={{ r: 3, fill: '#087e75' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Workforce Assessment Coverage" subtitle="Status of active staff baseline evaluations">
          <div className="coverage-content">
            <div className="coverage-ring">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ value: 79 }, { value: 21 }]} dataKey="value" innerRadius="72%" outerRadius="92%" startAngle={90} endAngle={-270} stroke="none">
                    {[0, 1].map(i => <Cell key={i} fill={i === 0 ? '#188c75' : '#edf0ed'} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div>
                <b>79%</b>
                <small>Assessed</small>
              </div>
            </div>
            <div className="coverage-legend">
              <span><i /> Assessed: <b>986 staff</b></span>
              <span><i /> Pending: <b>262 staff</b></span>
              <p>Coverage is up <b>12%</b> following recent automated batch assessments.</p>
              <Link to="/hr/employees" className="panel-link">View Employee Directory <ArrowRight size={13} /></Link>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}

// --- HR EMPLOYEES DIRECTORY ---
function Employees({ onSelectEmployee }: { onSelectEmployee: (emp: any) => void }) {
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('All departments')

  const filtered = staff.filter(person =>
    (department === 'All departments' || person.department === department) &&
    `${person.id} ${person.name} ${person.role}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <div className="table-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input
            placeholder="Search by name, employee ID or role..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <label className="filter-control">
          <Filter size={14} />
          <select value={department} onChange={e => setDepartment(e.target.value)}>
            <option>All departments</option>
            {[...new Set(staff.map(p => p.department))].map(dept => (
              <option key={dept}>{dept}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </label>
        <span className="results-count">{filtered.length} Employees Found</span>
      </div>

      <div className="table-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>DEPARTMENT</th>
              <th>JOB ROLE</th>
              <th>SKILLS ASSESSED</th>
              <th>SKILL GAPS</th>
              <th>LEARNING PROGRESS</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(person => (
              <tr key={person.id} onClick={() => onSelectEmployee(person)}>
                <td>
                  <span className="table-person">
                    <span className="user-avatar">{person.name.split(' ').map(n => n[0]).join('')}</span>
                    <span>
                      <b>{person.name}</b>
                      <small>{person.id}</small>
                    </span>
                  </span>
                </td>
                <td>{person.department}</td>
                <td>{person.role}</td>
                <td>{person.assessed}</td>
                <td>
                  <span className={`gap-count ${person.gaps >= 3 ? 'gap-count-high' : ''}`}>
                    {person.gaps} Gaps
                  </span>
                </td>
                <td>
                  <span className="table-progress">
                    <span><i style={{ width: `${person.progress}%` }} /></span>
                    <b>{person.progress}%</b>
                  </span>
                </td>
                <td><ChevronRight size={16} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-foot">
        Showing {filtered.length} of 10 fictional demo employees (click any row to view profile drawer)
        <button
          className="panel-link"
          onClick={() => window.alert('The demo dataset contains 10 fictional employee profiles.')}
        >
          Demo Information <CircleHelp size={13} />
        </button>
      </div>
    </>
  )
}

// --- HR SKILLS INVENTORY ---
function HRSkills() {
  const [query, setQuery] = useState('')
  const [skillsList, setSkillsList] = useState([
    ...new Set([...initialSkillData.map(s => s.skill), 'Cybersecurity', 'Policy Analysis', 'Project Management', 'Data Visualization', 'Cloud Architecture'])
  ])

  const filtered = skillsList.filter(s => s.toLowerCase().includes(query.toLowerCase()))

  const handleAddSkill = () => {
    const name = window.prompt('Enter new skill name:')
    if (name?.trim()) {
      setSkillsList(prev => [...prev, name.trim()])
      window.alert(`Skill "${name.trim()}" successfully registered in the workforce inventory.`)
    }
  }

  return (
    <>
      <div className="table-toolbar">
        <div className="toolbar-search">
          <Search size={15} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search skill catalog..."
          />
        </div>
        <span className="results-count">{filtered.length} Skills in Inventory</span>
        <button className="button button-dark button-small" onClick={handleAddSkill}>
          <Plus size={14} /> Add Skill
        </button>
      </div>

      <div className="inventory-grid">
        {filtered.map((skill, i) => (
          <article className="inventory-card" key={skill}>
            <span className={`skill-symbol symbol-${i % 4}`}>{skill.slice(0, 1)}</span>
            <div>
              <b>{skill}</b>
              <small>{[142, 108, 92, 74, 53][i % 5]} employees assessed</small>
            </div>
            <span className="inventory-status"><span /> Active</span>
            <button
              className="icon-button"
              aria-label={`Skill options for ${skill}`}
              onClick={() => window.alert(`${skill}: View mapped roles, assessment metrics, and gap trends.`)}
            >
              <MoreHorizontal size={18} />
            </button>
          </article>
        ))}
      </div>
    </>
  )
}

// --- HR WORKFORCE SKILL GAPS ---
function HRGaps() {
  const dept = [
    { name: 'Digital Services', gaps: 62 },
    { name: 'Finance', gaps: 48 },
    { name: 'Operations', gaps: 71 },
    { name: 'Administration', gaps: 36 }
  ]

  return (
    <>
      <div className="metric-grid">
        <Metric label="Open Skill Gaps" value="3,462" icon={Target} tone="peach" detail="across 42 job roles" />
        <Metric label="High-Priority Gaps" value="824" icon={ArrowDownRight} tone="gold" detail="criticality score ≥ 4" />
        <Metric label="Employees Affected" value="786" icon={Users} tone="lavender" detail="63% of assessed staff" />
        <Metric label="Gaps Closing" value="31%" change="9%" icon={TrendingUp} detail="quarter over quarter" />
      </div>

      <div className="dashboard-grid">
        <Panel title="Gaps by Skill Area" subtitle="Share of assessed employees below target proficiency">
          <div className="common-gaps large-common-gaps">
            {[
              ['SQL', 78],
              ['Data Analytics', 65],
              ['Cybersecurity', 58],
              ['Cloud Computing', 49],
              ['Communication', 33],
              ['Power BI', 29]
            ].map(([skill, value], i) => (
              <div className="common-gap" key={String(skill)}>
                <span className="gap-rank">0{i + 1}</span>
                <b>{skill}</b>
                <div className="common-track">
                  <i style={{ width: `${value}%` }} />
                </div>
                <span>{value}%</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Department Comparison" subtitle="Skills below role benchmark">
          <div className="gap-chart gap-chart-tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dept} layout="vertical" margin={{ left: 8, right: 14, top: 8, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#69736d', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="gaps" name="Gap prevalence" fill="#d78b60" radius={[0, 4, 4, 0]} barSize={17} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="priority-banner">
        <div className="priority-badge"><Target size={18} /></div>
        <div>
          <b>Data & Analytics account for the largest share of open workforce gaps.</b>
          <span>Initiate automated cohort learning pathways for Digital Services and Finance.</span>
        </div>
        <Link className="button button-dark button-small" to="/hr/role-mapping">
          Review Role Mapping <ArrowRight size={14} />
        </Link>
      </div>
    </>
  )
}

// --- HR ROLE & SKILL MAPPING ---
function RoleMapping() {
  const [roles, setRoles] = useState([
    {
      name: 'Data Analyst',
      category: 'Digital Services',
      skills: [
        ['SQL', 4, 5],
        ['Python', 4, 4],
        ['Statistics', 3, 4],
        ['Data Visualization', 4, 5]
      ] as [string, number, number][]
    },
    {
      name: 'Cybersecurity Analyst',
      category: 'Digital Services',
      skills: [
        ['Network Security', 4, 5],
        ['Risk Assessment', 3, 4],
        ['Incident Response', 4, 5]
      ] as [string, number, number][]
    },
    {
      name: 'Finance Officer',
      category: 'Finance',
      skills: [
        ['Financial Analysis', 4, 5],
        ['Data Analytics', 3, 4],
        ['Communication', 3, 3]
      ] as [string, number, number][]
    }
  ])

  const addRole = () => {
    const name = window.prompt('Enter new Job Role title:')
    if (name?.trim()) {
      setRoles(prev => [...prev, { name: name.trim(), category: 'New Role', skills: [] }])
    }
  }

  const addSkill = (roleName: string) => {
    const skill = window.prompt(`Add a skill requirement to ${roleName}:`)
    if (skill?.trim()) {
      setRoles(prev =>
        prev.map(r => r.name === roleName ? { ...r, skills: [...r.skills, [skill.trim(), 3, 3] as [string, number, number]] } : r)
      )
    }
  }

  const updateRequired = (roleName: string, skillName: string, value: number) => {
    setRoles(prev =>
      prev.map(r => r.name === roleName ? { ...r, skills: r.skills.map(s => s[0] === skillName ? [s[0], value, s[2]] : s) } : r)
    )
  }

  return (
    <>
      <div className="role-mapping-toolbar">
        <div>
          <b>Role & Skill Mapping Configuration</b>
          <p>Define required competencies, expected proficiency (1–5) and criticality weights.</p>
        </div>
        <button className="button button-dark button-small" onClick={addRole}>
          <Plus size={14} /> Add Role
        </button>
      </div>

      <div className="role-cards">
        {roles.map((role) => (
          <article className="role-card" key={role.name}>
            <div className="role-card-head">
              <span className="role-icon"><BriefcaseBusiness size={17} /></span>
              <div>
                <h3>{role.name}</h3>
                <small>{role.category} · {role.skills.length} mapped competencies</small>
              </div>
              <button
                className="icon-button"
                onClick={() => addSkill(role.name)}
                aria-label={`Add skill to ${role.name}`}
              >
                <Plus size={17} />
              </button>
            </div>

            <div className="role-skills">
              <div className="role-skills-head">
                <span>SKILL</span>
                <span>REQUIRED LEVEL</span>
                <span>IMPORTANCE</span>
                <span />
              </div>
              {role.skills.map(([skill, level, importance]) => (
                <div className="role-skill-row" key={skill}>
                  <b>{skill}</b>
                  <label>
                    <select
                      value={level}
                      onChange={e => updateRequired(role.name, skill, Number(e.target.value))}
                    >
                      {[1, 2, 3, 4, 5].map(n => (
                        <option key={n} value={n}>{n} / 5</option>
                      ))}
                    </select>
                    <ChevronDown size={12} />
                  </label>
                  <span className="importance-dots">
                    {[1, 2, 3, 4, 5].map(n => (
                      <i key={n} className={n <= importance ? 'filled' : ''} />
                    ))}
                  </span>
                  <span className="importance-label">
                    {importance >= 5 ? 'Critical' : importance >= 4 ? 'High' : 'Medium'}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="panel-link role-add-skill"
              onClick={() => addSkill(role.name)}
            >
              <Plus size={13} /> Add Skill Requirement
            </button>
          </article>
        ))}
      </div>
    </>
  )
}

// --- HR WORKFORCE ANALYTICS ---
function Analytics() {
  const [filters, setFilters] = useState({
    department: 'All departments',
    role: 'All roles',
    skill: 'All skills',
    period: 'Last 6 months'
  })

  const setFilter = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const heatmap = [
    ['Digital Services', [4, 3, 5, 2, 3]],
    ['Finance', [3, 4, 2, 2, 4]],
    ['Operations', [5, 3, 3, 4, 2]],
    ['Administration', [2, 2, 4, 3, 2]]
  ]

  const trendData = [
    { month: 'Jan', readiness: 61, hours: 210 },
    { month: 'Feb', readiness: 64, hours: 320 },
    { month: 'Mar', readiness: 66, hours: 410 },
    { month: 'Apr', readiness: 69, hours: 380 },
    { month: 'May', readiness: 71, hours: 490 },
    { month: 'Jun', readiness: 74, hours: 520 },
  ]

  return (
    <>
      <div className="analytics-filters">
        {[
          ['department', ['All departments', 'Digital Services', 'Finance', 'Operations', 'Administration']],
          ['role', ['All roles', 'Data Analyst', 'Finance Officer', 'Program Coordinator']],
          ['skill', ['All skills', 'SQL', 'Data Analytics', 'Cybersecurity']],
          ['period', ['Last 6 months', 'Last 30 days', 'This year']]
        ].map(([key, options]) => (
          <label key={String(key)}>
            <span>{String(key).toUpperCase()}</span>
            <div>
              <select
                value={filters[key as keyof typeof filters]}
                onChange={e => setFilter(key as keyof typeof filters, e.target.value)}
              >
                {(options as string[]).map(option => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <ChevronDown size={13} />
            </div>
          </label>
        ))}
      </div>

      <div className="metric-grid">
        <Metric label="Readiness Index" value="71.8%" change="4.2%" icon={Gauge} detail="period over period" />
        <Metric label="Open Skill Gaps" value="3,462" icon={Target} tone="peach" detail="across selected scope" />
        <Metric label="Learning Participation" value="74%" change="8%" icon={BookOpen} tone="gold" detail="within selected scope" />
        <Metric label="Assessments Completed" value="2,184" change="14%" icon={CheckCircle2} tone="lavender" detail="in selected period" />
      </div>

      <div className="dashboard-grid">
        <Panel title="Skill-Gap Intensity Heatmap" subtitle="Cross-departmental competency gap levels">
          <div className="heatmap">
            <div className="heatmap-head">
              <span>DEPARTMENT</span>
              {['SQL', 'Analytics', 'Security', 'Cloud', 'Comms'].map(s => <span key={s}>{s}</span>)}
            </div>
            {heatmap.map(([name, scores]) => (
              <div className="heatmap-row" key={String(name)}>
                <b>{String(name)}</b>
                {(scores as number[]).map((score, i) => (
                  <span className={`heat-cell heat-${score}`} title={`Gap level ${score}`} key={i}>
                    {score}
                  </span>
                ))}
              </div>
            ))}
            <div className="heat-legend">
              <span>Lower Gap</span>
              {[1, 2, 3, 4, 5].map(n => <i className={`heat-${n}`} key={n} />)}
              <span>Higher Gap</span>
            </div>
          </div>
        </Panel>

        <Panel title="Department Skill-Gap Trend" subtitle="Average gaps across the selected period">
          <div className="chart-wrap chart-large">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid vertical={false} stroke="#edf0ed" />
                <XAxis dataKey="month" tick={{ fill: '#818982', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#969e97', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Line name="Readiness" dataKey="readiness" stroke="#188c75" strokeWidth={2} dot={false} />
                <Line name="Learning hours" dataKey="hours" stroke="#d89b55" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Assessment & Learning Outcomes" subtitle="Workforce learning translating into measurable capability gains">
        <div className="analytics-outcomes">
          {[
            ['Assessment Completion', '79%', '+12%'],
            ['Learning Participation', '74%', '+8%'],
            ['Average Quiz Score', '81%', '+5%'],
            ['Skill Gap Reduction', '31%', '+9%']
          ].map(([name, value, delta]) => (
            <div key={name}>
              <small>{name}</small>
              <b>{value}</b>
              <span><ArrowUpRight size={12} /> {delta} this period</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

// --- HR REPORTS ---
function Reports() {
  const [report, setReport] = useState('Workforce Skill Gap Summary')
  const [period, setPeriod] = useState('Q2 2026')
  const [ready, setReady] = useState(false)

  return (
    <>
      <div className="report-builder panel">
        <div className="report-builder-copy">
          <span className="report-icon"><FileText size={21} /></span>
          <div>
            <h3>Build an Executive Workforce Report</h3>
            <p>Select report parameters to generate an official snapshot of workforce capability and training participation.</p>
          </div>
        </div>

        <div className="report-form">
          <label>
            Report Type
            <div>
              <select value={report} onChange={e => { setReport(e.target.value); setReady(false) }}>
                <option>Workforce Skill Gap Summary</option>
                <option>Department Readiness Overview</option>
                <option>Learning Participation Report</option>
                <option>Assessment Outcomes Summary</option>
              </select>
              <ChevronDown size={14} />
            </div>
          </label>

          <label>
            Reporting Period
            <div>
              <select value={period} onChange={e => { setPeriod(e.target.value); setReady(false) }}>
                <option>Q2 2026</option>
                <option>Q1 2026</option>
                <option>2025 Full Year</option>
                <option>Last 30 Days</option>
              </select>
              <ChevronDown size={14} />
            </div>
          </label>

          <button className="button button-dark" onClick={() => setReady(true)}>
            <BarChart3 size={15} /> Generate Report <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {ready && (
        <div className="report-ready">
          <CheckCircle2 size={19} />
          <div>
            <b>{report} · {period}</b>
            <span>Report generated with verified assessment metrics, skill gaps, and iGOT learning outcomes.</span>
          </div>
          <button className="button button-outline button-small" onClick={() => window.print()}>
            <Printer size={14} /> Print / Save PDF
          </button>
        </div>
      )}

      <div className="report-history">
        <div className="section-title-row">
          <h3>Recent Generated Reports</h3>
          <span className="results-count">OFFICIAL ARCHIVE</span>
        </div>
        {[
          ['Workforce Skill Gap Summary', 'Q2 2026', 'Today', 'Verified'],
          ['Learning Participation Report', 'Q1 2026', '18 Jun 2026', 'Verified'],
          ['Department Readiness Overview', 'Q1 2026', '10 Jun 2026', 'Verified'],
          ['Assessment Outcomes Summary', 'May 2026', '02 Jun 2026', 'Verified']
        ].map(([title, p, date, status]) => (
          <div className="report-history-row" key={title}>
            <span className="history-file"><FileText size={17} /></span>
            <div>
              <b>{title}</b>
              <small>{p} · Generated {date}</small>
            </div>
            <span className="report-status"><Check size={12} /> {status}</span>
            <button
              className="icon-button"
              onClick={() => window.print()}
              aria-label={`Print ${title}`}
            >
              <Printer size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="prototype-note">
        <ShieldCheck size={15} />
        <span>
          Reports aggregate anonymized workforce capability data in compliance with government data protection standards.
        </span>
      </div>
    </>
  )
}

export default App
