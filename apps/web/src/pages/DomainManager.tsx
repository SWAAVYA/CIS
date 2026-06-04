import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDomains, createDomain, declareIndependence } from '../api/client'
import type { Domain, DomainIndependence } from '../types'

export function DomainManager() {
  const { id } = useParams<{ id: string }>()
  const caseId = id!
  const qc = useQueryClient()

  const { data: domains } = useQuery({
    queryKey: ['domains', caseId],
    queryFn: () => getDomains(caseId),
    refetchInterval: 5000,
  })

  // Derive independence matrix from domains' embedded independence arrays (deduplicated by pair key)
  const matrix = (() => {
    const seen = new Set<string>()
    const rows: DomainIndependence[] = []
    for (const d of domains ?? []) {
      for (const row of d.independence ?? []) {
        const key = [row.domain_a_id, row.domain_b_id].sort().join('|')
        if (!seen.has(key)) { seen.add(key); rows.push(row) }
      }
    }
    return rows
  })()

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const createMutation = useMutation({
    mutationFn: () => createDomain(caseId, name.trim(), desc.trim() || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['domains', caseId] })
      qc.invalidateQueries({ queryKey: ['case', caseId] })
      setName('')
      setDesc('')
      setCreating(false)
    },
    onError: (e) => setCreateError(e instanceof Error ? e.message : 'Failed'),
  })

  const indMutation = useMutation({
    mutationFn: ({ a, b, isInd }: { a: Domain; b: Domain; isInd: boolean }) =>
      declareIndependence(caseId, a.id, b.id, isInd),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['independence', caseId] })
      qc.invalidateQueries({ queryKey: ['case', caseId] })
    },
  })

  function getDeclaration(a: Domain, b: Domain): DomainIndependence | undefined {
    return (matrix ?? []).find(d =>
      (d.domain_a_id === a.id && d.domain_b_id === b.id) ||
      (d.domain_a_id === b.id && d.domain_b_id === a.id)
    )
  }

  const domainList = domains ?? []

  return (
    <div className="p-6 space-y-8">
      <h2 className="font-serif text-xl" style={{ color: 'var(--accent)' }}>Domain Manager</h2>

      {/* Domain list */}
      <div>
        <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Domains</div>
        {domainList.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-dim)' }}>No domains yet.</p>
        ) : (
          <div className="space-y-px mb-4">
            {domainList.map(d => (
              <div key={d.id} className="px-4 py-3 flex items-center justify-between"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div>
                  <span className="font-mono text-sm" style={{ color: 'var(--text)' }}>{d.name}</span>
                  {d.description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{d.description}</p>
                  )}
                </div>
                <span className="text-xs font-mono" style={{ color: 'var(--text-dim)' }}>
                  {d.signal_count ?? 0} signals
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add domain form */}
        <div className="p-4 space-y-3" style={{ background: 'var(--surface)', border: '1px solid var(--border2)' }}>
          <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Add Domain</div>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Domain name"
            className="w-full px-3 py-2 text-sm rounded font-mono"
            style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          />
          <input
            type="text" value={desc} onChange={e => setDesc(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-2 text-sm rounded font-mono"
            style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border2)', outline: 'none' }}
          />
          {createError && <p className="text-xs" style={{ color: 'var(--red)' }}>{createError}</p>}
          <button
            onClick={() => { setCreateError(''); createMutation.mutate() }}
            disabled={!name.trim() || creating || createMutation.isPending}
            className="px-4 py-2 text-xs rounded font-sans uppercase tracking-widest disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}
          >
            {createMutation.isPending ? 'Adding...' : 'Add Domain'}
          </button>
        </div>
      </div>

      {/* Independence matrix */}
      {domainList.length >= 2 && (
        <div>
          <div className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
            Independence Matrix
          </div>
          <div className="overflow-x-auto">
            <table style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="p-2" />
                  {domainList.map(d => (
                    <th key={d.id} className="p-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                      {d.name.slice(0, 12)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {domainList.map((rowDomain, ri) => (
                  <tr key={rowDomain.id}>
                    <td className="p-2 text-xs font-mono pr-4" style={{ color: 'var(--text-muted)' }}>
                      {rowDomain.name.slice(0, 12)}
                    </td>
                    {domainList.map((colDomain, ci) => {
                      if (ri === ci) {
                        return (
                          <td key={colDomain.id} className="p-2 text-center">
                            <span style={{ color: 'var(--text-dim)' }}>—</span>
                          </td>
                        )
                      }
                      if (ri > ci) {
                        // Mirror: already shown in upper triangle
                        const decl = getDeclaration(rowDomain, colDomain)
                        return (
                          <td key={colDomain.id} className="p-2">
                            <CellButton
                              declaration={decl}
                              domainA={rowDomain}
                              domainB={colDomain}
                              onSet={(isInd) => indMutation.mutate({ a: rowDomain, b: colDomain, isInd })}
                            />
                          </td>
                        )
                      }
                      const decl = getDeclaration(rowDomain, colDomain)
                      return (
                        <td key={colDomain.id} className="p-2">
                          <CellButton
                            declaration={decl}
                            domainA={rowDomain}
                            domainB={colDomain}
                            onSet={(isInd) => indMutation.mutate({ a: rowDomain, b: colDomain, isInd })}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
            Click a cell to declare independence or dependence between two domains.
          </p>
        </div>
      )}

      {domainList.length < 2 && (
        <div className="p-3 text-xs" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          Add at least two domains to declare independence relationships.
        </div>
      )}
    </div>
  )
}

function CellButton({
  declaration,
  domainA,
  domainB,
  onSet,
}: {
  declaration?: DomainIndependence
  domainA: Domain
  domainB: Domain
  onSet: (isInd: boolean) => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  let label = 'UNSET'
  let color = 'var(--text-muted)'
  let bg = 'var(--surface2)'
  let borderColor = 'var(--border)'

  if (declaration !== undefined) {
    if (declaration.is_independent) {
      label = 'INDEP'
      color = 'var(--green)'
      bg = '#4f9e6f22'
      borderColor = '#4f9e6f55'
    } else {
      label = 'DEP'
      color = 'var(--red)'
      bg = '#c94f4f22'
      borderColor = '#c94f4f55'
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-2 py-1 text-xs font-mono"
        style={{ background: bg, color, border: `1px solid ${borderColor}`, minWidth: 56 }}
        title={declaration === undefined ? `SHG will not evaluate ${domainA.name} × ${domainB.name} until independence is declared.` : undefined}
      >
        {label}
      </button>
      {showMenu && (
        <div
          className="absolute z-10 top-full left-0 mt-1 flex gap-1 p-2"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border2)' }}
        >
          <button
            onClick={() => { onSet(true); setShowMenu(false) }}
            className="px-2 py-1 text-xs font-mono rounded"
            style={{ background: '#4f9e6f22', color: 'var(--green)', border: '1px solid #4f9e6f55' }}
          >
            INDEP
          </button>
          <button
            onClick={() => { onSet(false); setShowMenu(false) }}
            className="px-2 py-1 text-xs font-mono rounded"
            style={{ background: '#c94f4f22', color: 'var(--red)', border: '1px solid #c94f4f55' }}
          >
            DEP
          </button>
          <button onClick={() => setShowMenu(false)} className="px-2 py-1 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>
      )}
    </div>
  )
}
