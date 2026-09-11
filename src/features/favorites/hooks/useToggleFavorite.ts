import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/toast-context'
import { isApiError } from '@/lib/api/api-error'
import type { Song } from '@/features/songs/types/song.types'
import { favoriteApi } from '../api/favorite.api'
import { favoriteKeys } from '../queries/favorite.query-keys'

const latestIntent = new Map<number, number>()

export function useToggleFavorite(song: Song) {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationKey: [...favoriteKeys.all, 'toggle', song.id],
    scope: { id: `favorite-${song.id}` },
    mutationFn: async (targetLiked: boolean) => {
      try {
        if (targetLiked) await favoriteApi.likeSong(song.id)
        else await favoriteApi.unlikeSong(song.id)
      } catch (error) {
        if (targetLiked && isApiError(error) && error.status === 409) return
        throw error
      }
    },
    onMutate: async (targetLiked) => {
      const version = (latestIntent.get(song.id) ?? 0) + 1
      latestIntent.set(song.id, version)
      await queryClient.cancelQueries({ queryKey: favoriteKeys.songs() })
      const previous = queryClient.getQueryData<Song[]>(favoriteKeys.songs()) ?? []
      queryClient.setQueryData<Song[]>(
        favoriteKeys.songs(),
        targetLiked
          ? previous.some((item) => item.id === song.id)
            ? previous
            : [song, ...previous]
          : previous.filter((item) => item.id !== song.id),
      )
      return { previous, version }
    },
    onError: (_error, _targetLiked, context) => {
      if (context && latestIntent.get(song.id) === context.version) {
        queryClient.setQueryData(favoriteKeys.songs(), context.previous)
        showToast('Không thể cập nhật bài hát yêu thích. Thay đổi đã được hoàn tác.', 'error')
      }
    },
    onSettled: (_data, _error, _targetLiked, context) => {
      if (context && latestIntent.get(song.id) === context.version) {
        void queryClient.invalidateQueries({ queryKey: favoriteKeys.songs() })
      }
    },
  })
}
