import { useQuery } from '@tanstack/react-query'
import { getCase, getCaseByCode } from '../api/client'
import type { CaseStats } from '../types'

export function useCase(id: string) {
  return useQuery({
    queryKey: ['case', id],
    queryFn: () => getCase(id),
    refetchInterval: 30000,
    enabled: !!id,
  })
}

export function useCaseByCode(code: string) {
  return useQuery({
    queryKey: ['case-by-code', code],
    queryFn: () => getCaseByCode(code),
    enabled: !!code,
  })
}

export function useCaseStats(id: string): CaseStats | undefined {
  const { data } = useCase(id)
  return data?.stats
}
