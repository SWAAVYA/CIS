import { useQuery } from '@tanstack/react-query'
import { getContradictions } from '../api/client'

export function useContradictions(caseId: string) {
  return useQuery({
    queryKey: ['contradictions', caseId],
    queryFn: () => getContradictions(caseId),
    refetchInterval: 30000,
    enabled: !!caseId,
  })
}
