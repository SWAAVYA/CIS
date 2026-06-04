import { useQuery } from '@tanstack/react-query'
import { getHypotheses, getPlausibilityHistory } from '../api/client'

export function useHypotheses(caseId: string) {
  return useQuery({
    queryKey: ['hypotheses', caseId],
    queryFn: () => getHypotheses(caseId),
    refetchInterval: 30000,
    enabled: !!caseId,
  })
}

export function usePlausibilityHistory(hypothesisId: string) {
  return useQuery({
    queryKey: ['plausibility-history', hypothesisId],
    queryFn: () => getPlausibilityHistory(hypothesisId),
    enabled: !!hypothesisId,
  })
}
