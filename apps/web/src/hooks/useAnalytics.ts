import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from '../api/client'

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
    refetchInterval: 300000,
  })
}
