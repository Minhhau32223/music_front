import { useQuery } from '@tanstack/react-query'
import { songDetailQuery } from '../queries/song.queries'

export function useSongDetail(id: number | null) {
  return useQuery({ ...songDetailQuery(id ?? 0), enabled: id !== null })
}
