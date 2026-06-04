import { useQuery } from '@tanstack/react-query'
import { getSignals, getSignal } from '../api/client'
import type { SignalQueryParams } from '../types'

export function useSignals(caseId: string, params?: SignalQueryParams) {
  return useQuery({
    queryKey: ['signals', caseId, params],
    queryFn: () => getSignals(caseId, params),
    refetchInterval: 30000,
    enabled: !!caseId,
  })
}

export function useSignal(id: string) {
  return useQuery({
    queryKey: ['signal', id],
    queryFn: () => getSignal(id),
    enabled: !!id,
  })
}
