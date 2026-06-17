import { Routes, Route, NavLink, useParams, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Start } from './pages/Start'
import { Dashboard } from './pages/Dashboard'
import { SignalIntake } from './pages/SignalIntake'
import { SignalPool } from './pages/SignalPool'
import { HypothesisBoard } from './pages/HypothesisBoard'
import { ContradictionLedger } from './pages/ContradictionLedger'
import { CognitiveBriefing } from './pages/CognitiveBriefing'
import { DomainManager } from './pages/DomainManager'
import { Analytics } from './pages/Analytics'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useCase } from './hooks/useCase'

function CaseSidebar() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const { data: caseData } = useCase(caseId)
  const [copied, setCopied] = useState(false)

  function copyCode() {
    if (caseData?.access_code) {
      navigator.clipboard.writeText(caseData.access_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const navItems = [
    { to: `/cases/${caseId}`, label: 'Dashboard', end: true },
    { to: `/cases/${caseId}/intake`, label: 'Observation Intake' },
    { to: `/cases/${caseId}/signals`, label: 'Open Observations' },
    { to: `/cases/${caseId}/hypotheses`, label: 'Hypotheses' },
    { to: `/cases/${caseId}/contradictions`, label: 'Contradictions' },
    { to: `/cases/${caseId}/briefing`, label: 'Briefing' },
    { to: `/cases/${caseId}/domains`, label: 'Domains' },
  ]

  return (
    <aside
      className="w-52 flex-shrink-0 flex flex-col"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', minHeight: '100vh' }}
    >
      <div className="p-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <p className="font-mono text-xs mb-1" style={{ color: 'var(--accent)', letterSpacing: '0.06em' }}>alvirassa</p>
        <p className="font-serif text-sm leading-tight" style={{ color: 'var(--text)' }}>
          {caseData?.title ?? '—'}
        </p>
        <button
          onClick={copyCode}
          className="mt-1 font-mono text-xs"
          style={{ color: copied ? 'var(--green)' : 'var(--text-dim)', cursor: 'pointer' }}
          title="Click to copy access code"
        >
          {copied ? 'Copied!' : (caseData?.access_code ?? '...')}
        </button>
      </div>

      <nav className="flex-1 py-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `block px-4 py-2 text-xs font-sans ${isActive ? 'active-nav' : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              background: isActive ? 'var(--surface2)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <NavLink to="/" className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
          ← All Cases
        </NavLink>
      </div>
    </aside>
  )
}

function CaseLayout() {
  const location = useLocation()
  return (
    <div className="flex" style={{ minHeight: '100vh' }}>
      <CaseSidebar />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary key={location.pathname}>
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="intake" element={<SignalIntake />} />
            <Route path="signals" element={<SignalPool />} />
            <Route path="hypotheses" element={<HypothesisBoard />} />
            <Route path="contradictions" element={<ContradictionLedger />} />
            <Route path="briefing" element={<CognitiveBriefing />} />
            <Route path="domains" element={<DomainManager />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ErrorBoundary><Start /></ErrorBoundary>} />
      <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
      <Route path="/cases/:id/*" element={<CaseLayout />} />
    </Routes>
  )
}
